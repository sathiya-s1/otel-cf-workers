import { context as api_context, trace, SpanOptions, SpanKind, Exception, SpanStatusCode, Attributes, Context, propagation } from '@opentelemetry/api'
import { SemanticAttributes } from '@opentelemetry/semantic-conventions'
import {  unwrap, wrap } from '../wrap.js'
import { instrumentEnv } from './env.js'
import { Initialiser, setConfig, getActiveConfig } from '../config.js'
import { exportSpans } from './common.js'
import { DOConstructorTrigger } from '../types.js'

type AlarmFn = DurableObject['alarm']
type Env = Record<string, unknown>
type AnyFn = (...args: any[]) => any

const dbSystem = 'Cloudflare DO SQLite'

/**
 * Get the parent context from the request headers. For RPC requests there is no request object
 * @param headers - The request headers
 * @returns The parent context
 */
export function getParentContextFromHeaders(headers: Headers | Map<string, string> | Record<string, any>): Context {
	if (headers instanceof Map) {
		return propagation.extract(api_context.active(), headers, {
			get(headers, key) {
			return headers.get(key) || undefined
		},
		keys(headers) {
			return [...headers.keys()]
			},
		})
	} else {
		return propagation.extract(api_context.active(), headers as Record<string, any>, {
			get(headers, key) {
				return headers[key] || undefined
			},
			keys(headers) {
				return [...Object.keys(headers)]
			},
		})
	}
}

function getParentContextFromRequest(request: Request) {
	const workerConfig = getActiveConfig()

	if (workerConfig === undefined) {
		return api_context.active()
	}

	const acceptTraceContext =
		typeof workerConfig.handlers.fetch.acceptTraceContext === 'function'
			? workerConfig.handlers.fetch.acceptTraceContext(request)
			: (workerConfig.handlers.fetch.acceptTraceContext ?? true)
	return acceptTraceContext ? getParentContextFromHeaders(request?.headers) : api_context.active()
}

function spanOptions(dbName: string, operation: string, sql?: string): SpanOptions {
	const attributes: Attributes = {
		binding_type: 'DO',
		[SemanticAttributes.DB_NAME]: dbName,
		[SemanticAttributes.DB_SYSTEM]: dbSystem,
		[SemanticAttributes.DB_OPERATION]: operation,
	}
	if (sql) {
		attributes[SemanticAttributes.DB_STATEMENT] = sql?.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
	}
	return {
		kind: SpanKind.CLIENT,
		attributes,
	}
}

function metaAttributes(meta: SqlStorageIngestResult): Attributes {
	return {
		'db.cf.sql.rows_read': meta?.rowsRead,
		'db.cf.sql.rows_written': meta?.rowsWritten
	}
}

function databaseSizeAttributes(databaseSize: number): Attributes {
	return {
		'db.cf.sql.database_size': databaseSize
	}
}

export function instrumentSqlExec(fn: Function) {
	const tracer = trace.getTracer('D1')
	const fnHandler: ProxyHandler<any> = {
		apply: (target, thisArg, argArray) => {
			const sql = argArray[0] as string
			const options = spanOptions('DO SQLite', 'exec', sql)
			return tracer.startActiveSpan('DO SQL Exec', options, (span) => {
				try {
					const result = Reflect.apply(target, thisArg, argArray)
					span.setAttributes(metaAttributes((result as SqlStorageIngestResult)))
					span.setAttributes(databaseSizeAttributes(thisArg?.databaseSize))
					span.setStatus({ code: SpanStatusCode.OK })
					return result
				} catch (error) {
					span.recordException(error as Exception)
					span.setStatus({ code: SpanStatusCode.ERROR })
					throw error
				} finally {
					span.end()
				}
			})
		}

	}
	return wrap(fn, fnHandler)
}

export function instrumentSql(sql: SqlStorage) {
	const sqlHandler: ProxyHandler<SqlStorage> = {
		get(target, prop, receiver) {
			const result = Reflect.get(target, prop, receiver)
			 if (prop === 'exec') {
				return instrumentSqlExec(result)
			} else {
				return result
			}
		},
	}
	return wrap(sql, sqlHandler)
}

let cold_start = true
export type DOClass = { new (state: DurableObjectState, env: any): DurableObject }
export function executeDORPCFn(anyFn: AnyFn, fnName: string, argArray: any[], id: DurableObjectId): Promise<Response> {
	const tracer = trace.getTracer('DO RPC')
	const attributes = {
		[SemanticAttributes.FAAS_TRIGGER]: 'rpc',
		[SemanticAttributes.FAAS_COLDSTART]: cold_start,
	}
	cold_start = false
	const options: SpanOptions = {
		attributes,
		kind: SpanKind.SERVER,
	}
	let spanContext = api_context.active();
	let request = argArray?.[0]?.request || argArray?.[0]?.__otel_request ;
	if (request) {
		spanContext = getParentContextFromRequest(request)
	}
	const namespace = argArray[1];

	if (namespace) {
		fnName = `${fnName}/${namespace}`;
	}

	const promise = tracer.startActiveSpan(`DO RPC ${fnName}`, options, spanContext, async (span) => {
		try {
			span.setAttribute('do.id', id.toString())
			span.setAttribute('do.fn', fnName)
			const response: Response = await anyFn(...argArray)
			span.setStatus({ code: SpanStatusCode.OK })
			span.end()
			return response
		} catch (error) {
			span.recordException(error as Exception)
			span.setStatus({ code: SpanStatusCode.ERROR })
			span.end()
			throw error
		}
	})
	return promise
}

export function executeDOAlarm(alarmFn: NonNullable<AlarmFn>, id: DurableObjectId): Promise<void> {
	const tracer = trace.getTracer('DO alarmHandler')

	const name = id.name || ''
	const promise = tracer.startActiveSpan(`Durable Object Alarm ${name}`, async (span) => {
		span.setAttribute(SemanticAttributes.FAAS_COLDSTART, cold_start)
		cold_start = false
		span.setAttribute('do.id', id.toString())
		if (id.name) span.setAttribute('do.name', id.name)

		try {
			await alarmFn()
			span.end()
		} catch (error) {
			span.recordException(error as Exception)
			span.setStatus({ code: SpanStatusCode.ERROR })
			span.end()
			throw error
		}
	})
	return promise
}

function instrumentDORPCFn(anyFn: AnyFn, fnName: string, initialiser: Initialiser, env: Env, id: DurableObjectId): AnyFn {
	const fetchHandler: ProxyHandler<AnyFn> = {
		async apply(target, thisArg, argArray: any) {
			const request = argArray[0]?.request;
			const config = initialiser(env, request)
			const context = setConfig(config)
			try {
				const bound = target.bind(unwrap(thisArg))
				let response = await api_context.with(context, executeDORPCFn, undefined, bound, fnName, argArray, id)
				return response
			} catch (error) {
				throw error
			} finally {	
				exportSpans()
			}
		},
	}
	return wrap(anyFn, fetchHandler)
}

function instrumentAlarmFn(alarmFn: AlarmFn, initialiser: Initialiser, env: Env, id: DurableObjectId) {
	if (!alarmFn) return undefined

	const alarmHandler: ProxyHandler<NonNullable<AlarmFn>> = {
		async apply(target, thisArg) {
			const config = initialiser(env, 'do-alarm')
			const context = setConfig(config)
			try {
				const bound = target.bind(unwrap(thisArg))
				return await api_context.with(context, executeDOAlarm, undefined, bound, id)
			} catch (error) {
				throw error
			} finally {
				exportSpans()
			}
		},
	}
	return wrap(alarmFn, alarmHandler)
}

function instrumentDurableObjectStub(doObj: DurableObject, initialiser: Initialiser, env: Env, state: DurableObjectState, rpcFunctions: string[]) {
	const objHandler: ProxyHandler<DurableObject> = {
		get(target, prop) {
			if (prop === 'alarm') {
				const alarmFn = Reflect.get(target, prop)
				return instrumentAlarmFn(alarmFn, initialiser, env, state.id)
			} else {
				const result = Reflect.get(target, prop)
				if (typeof result === 'function' && rpcFunctions.includes(String(prop))) {
					return instrumentDORPCFn(result, String(prop), initialiser, env, state.id)
				}
				return result
			}
		},
	}
	return wrap(doObj, objHandler)
}

export function instrumentDOClassRPC(doClass: DOClass, initialiser: Initialiser, rpcFunctions: string[]): DOClass {
	const classHandler: ProxyHandler<DOClass> = {
		construct(target, [orig_state, orig_env]: ConstructorParameters<DOClass>) {
			const trigger: DOConstructorTrigger = {
				id: orig_state.id.toString(),
				name: orig_state.id.name,
			}
			const constructorConfig = initialiser(orig_env, trigger)
			const context = setConfig(constructorConfig)
			const env = instrumentEnv(orig_env)
			const createDO = () => {
				orig_state.storage.sql = instrumentSql(orig_state.storage.sql)
				return new target(orig_state, env)
			}
			const doObj = api_context.with(context, createDO)
			return instrumentDurableObjectStub(doObj, initialiser, env, orig_state, rpcFunctions)
		},
	}
	
	return wrap(doClass, classHandler)
}

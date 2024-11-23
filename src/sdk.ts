import { propagation } from '@opentelemetry/api'
import { Resource } from '@opentelemetry/resources'

import { Initialiser, parseConfig } from './config.js'
import { WorkerTracerProvider } from './provider.js'
import { Trigger, TraceConfig, ResolvedTraceConfig } from './types.js'
import { unwrap } from './wrap.js'
import { createFetchHandler, instrumentGlobalFetch } from './instrumentation/fetch.js'
import { instrumentGlobalCache } from './instrumentation/cache.js'
import { createQueueHandler } from './instrumentation/queue.js'
import { DOClass, instrumentDOClass } from './instrumentation/do.js'
import { instrumentDOClassRPC } from './instrumentation/do-rpc.js'
import { createScheduledHandler } from './instrumentation/scheduled.js'

import { instrumentWorkflow as instrumentWorkflowObject } from './instrumentation/workflow.js'
export { instrumentEnv } from './instrumentation/env.js'
//@ts-ignore
import * as versions from '../versions.json'

type FetchHandler = ExportedHandlerFetchHandler<unknown, unknown>
type ScheduledHandler = ExportedHandlerScheduledHandler<unknown>
type QueueHandler = ExportedHandlerQueueHandler

export { instrumentSql } from './instrumentation/do-rpc.js'
export { getParentContextFromHeaders } from './instrumentation/fetch.js'

export type ResolveConfigFn<Env = any> = (env: Env, trigger: Trigger) => TraceConfig
export type ConfigurationOption = TraceConfig | ResolveConfigFn

export function isRequest(trigger: Trigger): trigger is Request {
	return trigger instanceof Request
}

export function isMessageBatch(trigger: Trigger): trigger is MessageBatch {
	return !!(trigger as MessageBatch).ackAll
}

export function isAlarm(trigger: Trigger): trigger is 'do-alarm' {
	return trigger === 'do-alarm'
}

const createResource = (config: ResolvedTraceConfig): Resource => {
	const workerResourceAttrs = {
		'cloud.provider': 'cloudflare',
		'cloud.platform': 'cloudflare.workers',
		'cloud.region': 'earth',
		'faas.max_memory': 134217728,
		'telemetry.sdk.language': 'js',
		'telemetry.sdk.name': '@firmly/otel-cf-workers',
		'telemetry.sdk.version': versions['@firmly/otel-cf-workers'],
		'telemetry.sdk.build.node_version': versions['node'],
	}
	const serviceResource = new Resource({
		'service.name': config.service.name,
		'service.namespace': config.service.namespace,
		'service.version': config.service.version,
	})
	const resource = new Resource(workerResourceAttrs)
	return resource.merge(serviceResource)
}

let initialised = false
function init(config: ResolvedTraceConfig): void {
	if (!initialised) {
		if (config.instrumentation.instrumentGlobalCache) {
			instrumentGlobalCache()
		}
		if (config.instrumentation.instrumentGlobalFetch) {
			instrumentGlobalFetch()
		}
		propagation.setGlobalPropagator(config.propagator)
		const resource = createResource(config)

		const provider = new WorkerTracerProvider(config.spanProcessors, resource)
		provider.register()
		initialised = true
	}
}

function createInitialiser(config: ConfigurationOption): Initialiser {
	if (typeof config === 'function') {
		return (env, trigger) => {
			const conf = parseConfig(config(env, trigger))
			init(conf)
			return conf
		}
	} else {
		return () => {
			const conf = parseConfig(config)
			init(conf)
			return conf
		}
	}
}

export function instrument<E, Q, C>(
	handler: ExportedHandler<E, Q, C>,
	config: ConfigurationOption,
): ExportedHandler<E, Q, C> {
	const initialiser = createInitialiser(config)

	if (handler.fetch) {
		const fetcher = unwrap(handler.fetch) as FetchHandler
		handler.fetch = createFetchHandler(fetcher, initialiser)
	}

	if (handler.scheduled) {
		const scheduler = unwrap(handler.scheduled) as ScheduledHandler
		handler.scheduled = createScheduledHandler(scheduler, initialiser)
	}

	if (handler.queue) {
		const queuer = unwrap(handler.queue) as QueueHandler
		handler.queue = createQueueHandler(queuer, initialiser)
	}
	return handler
}

export function instrumentDO(doClass: DOClass, config: ConfigurationOption) {
	const initialiser = createInitialiser(config)

	return instrumentDOClass(doClass, initialiser)
}

export function instrumentDORPC(doClass: DOClass, config: ConfigurationOption, rpcFunctions: string[]) {
	const initialiser = createInitialiser(config)

	return instrumentDOClassRPC(doClass, initialiser, rpcFunctions)
}

export function instrumentWorkflow(workflowClass: any, config: ConfigurationOption) {
	const initialiser = createInitialiser(config)

	return instrumentWorkflowObject(workflowClass, initialiser)
}

export { waitUntilTrace } from './instrumentation/fetch.js'

export const __unwrappedFetch = unwrap(fetch)

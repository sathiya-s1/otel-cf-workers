import { context as api_context, trace, SpanKind, Exception, SpanStatusCode, Context, Attributes } from '@opentelemetry/api'
import {  wrap } from '../wrap.js'
import { instrumentEnv } from './env.js'
import { getActiveConfig, Initialiser, setConfig } from '../config.js'
import { exportSpans } from './common.js'
import {  WorkflowStep } from 'cloudflare:workers'
import { propagation } from '@opentelemetry/api';


/**
 * This is a very poor hack. I'm using this to propogate/add the traceparent header to the 
 * workflow params, not really happy about manipulating the event payload.
 * @param data 
 * @returns 
 */
function addTraceHeadersToWorkflowEvent(data: any) {
	const ctx = api_context.active()
	let headers = {}
	propagation.inject(ctx, headers);
	let params = data.params || {};
	data.params = {
		id: data.id,
		...params,
		__otel_request: {
			...(params.__otel_request || {}),
			headers: {
				...(params.__otel_request?.headers || {}),
				...headers
			}
		}
	}
	return data;
}

type Env = Record<string, unknown>


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


function instrumentWorkflowStep(step: WorkflowStep, activeContext: Context): WorkflowStep {
    const stepHandler: ProxyHandler<WorkflowStep> = {
        get(target, prop) {
            const method = Reflect.get(target, prop)
            if (typeof method !== 'function') {
                return method
            }

            return new Proxy(method, {
                apply: async (fn, thisArg, args) => {
                    const [name, ...restArgs] = args
                    const tracer = trace.getTracer('Workflow')

                    switch(prop) {
                        case 'do':
                            return tracer.startActiveSpan(`Workflow Step ${name}`, {
                                attributes: {
									'workflow.step': 'do',
                                    'workflow.step.do.name': name,
                                },
                                kind: SpanKind.INTERNAL
                            }, activeContext, async (span) => {
								let ctx = api_context.active();
                                try {
									if (typeof args[args.length - 1] === 'function') {
										const originalCallback = args[args.length - 1]
										args[args.length - 1] = async (...callbackArgs: any[]) => {
											return api_context.with(ctx, () => originalCallback(...callbackArgs))
										}
									}
									const result = await Reflect.apply(fn, thisArg, args)
									span.setStatus({ code: SpanStatusCode.OK })
									return result;
                                } catch (error) {
                                    span.recordException(error as Exception)
                                    span.setStatus({ code: SpanStatusCode.ERROR })
                                    throw error
                                } finally {
                                    span.end()
                                }
                            })

                        case 'sleep':
                            return tracer.startActiveSpan(`Workflow Step sleep`, {
                                attributes: {
									'workflow.step': 'sleep',
                                    'workflow.step.sleep.name': name,
                                    'workflow.step.sleep.duration': restArgs[0],
                                },
                                kind: SpanKind.INTERNAL
                            }, activeContext, async (span) => {
                                try {
                                    await Reflect.apply(fn, thisArg, args)
                                    span.setStatus({ code: SpanStatusCode.OK })
                                } catch (error) {
                                    span.recordException(error as Exception)
                                    span.setStatus({ code: SpanStatusCode.ERROR })
                                    throw error
                                } finally {
                                    span.end()
									exportSpans()
                                }
                            })

                        case 'sleepUntil':
                            return tracer.startActiveSpan(`Workflow Step sleepUntil`, {
                                attributes: {
									'workflow.step': 'sleepUntil',
                                    'workflow.step.sleep_until.name': name,
                                    'workflow.step.sleep_until.timestamp': restArgs[0].toString(),
                                },
                                kind: SpanKind.INTERNAL
                            }, activeContext, async (span) => {
                                try {
                                    await Reflect.apply(fn, thisArg, args)
                                    span.setStatus({ code: SpanStatusCode.OK })
                                } catch (error) {
                                    span.recordException(error as Exception)
                                    span.setStatus({ code: SpanStatusCode.ERROR })
                                    throw error
                                } finally {
                                    span.end()
                                }
                            })

                        default:
                            return Reflect.apply(fn, thisArg, args)
                    }
                }
            })
        }
    }
    return wrap(step, stepHandler)
}

function instrumentWorkflowRun(runFn: Function, initialiser: Initialiser, env: Env, ctx: ExecutionContext): Function {
    const runHandler: ProxyHandler<Function> = {
        async apply(target, thisArg, [event, step]) {
            const config = initialiser(env)
            const context = setConfig(config)
			let name = event?.payload?.name || 'Unknown';
            return api_context.with(context, async () => {
                const tracer = trace.getTracer('Workflow')
				let otelPropogationRequest = event?.payload?.__otel_request;
				let activeContext = api_context.active();
				if (otelPropogationRequest) {
					activeContext = getParentContextFromRequest(otelPropogationRequest)
				}
                return tracer.startActiveSpan(`Workflow Run ${name}`, {
                    attributes: {
						'workflow.operation': 'run',
						'workflow.id': event?.id || event?.payload?.id,
                        'workflow.run.name': name
                    },
                    kind: SpanKind.CONSUMER
                }, activeContext, async (span) => {
                    try {
                        const bound = target.bind(thisArg)
                        // Wrap the step argument before passing it to run
                        const instrumentedStep = instrumentWorkflowStep(step, api_context.active())
                        const result = await bound(event, instrumentedStep)
                        span.setStatus({ code: SpanStatusCode.OK })
                        return result
                    } catch (error) {
                        span.recordException(error as Exception)
                        span.setStatus({ code: SpanStatusCode.ERROR })
                        throw error
                    } finally {
                        span.end()
                        exportSpans()
                    }
                })
            })
        }
    }
    return wrap(runFn, runHandler)
}

export function instrumentWorkflowCreate(createFn: Function, attrs: Attributes | {}): Function {
    const createHandler: ProxyHandler<Function> = {
        async apply(target, thisArg, [data]) {
            const tracer = trace.getTracer('Workflow')
            let name = (attrs as Attributes)?.['name'] || 'Unknown';
            
            return tracer.startActiveSpan(`Workflow Create ${name}`, {
                attributes: {
                    'workflow.create.name': data.params?.name,
                    'workflow.operation': 'create',
                    'workflow.id': data?.id
                },
                kind: SpanKind.CLIENT
            }, async (span) => {
                try {
                    const result = await Reflect.apply(
                        target,
                        thisArg,
                        [addTraceHeadersToWorkflowEvent(data)]
                    )
                    span.setStatus({ code: SpanStatusCode.OK })
                    return result
                } catch (error) {
                    span.recordException(error as Exception)
                    span.setStatus({ code: SpanStatusCode.ERROR })
                    throw error
                } finally {
                    span.end()
                    exportSpans()
                }
            })
        }
    }
    return wrap(createFn, createHandler)
}


function instrumentWorkflowInstance(workflowObj: any, initialiser: Initialiser, env: Env, ctx: ExecutionContext) {
    const objHandler: ProxyHandler<any> = {
        get(target, prop) {
            if (prop === 'run') {
                const runFn = Reflect.get(target, prop)
                return instrumentWorkflowRun(runFn, initialiser, env, ctx)
            } else {
                const result = Reflect.get(target, prop)
                if (typeof result === 'function') {
                    result.bind(workflowObj)
                }
                return result
            }
        }
    }
    return wrap(workflowObj, objHandler)
}


export function instrumentWorkflowBinding(workflowObj: any, attrs: Attributes | {}) {
    const objHandler: ProxyHandler<any> = {
        get(target, prop) {
            const method = Reflect.get(target, prop)
            if (typeof method !== 'function') {
                return method
            }

            return new Proxy(method, {
                apply: async (fn, thisArg, args) => {
					switch(prop) {
						case 'create':
							const createHandler = instrumentWorkflowCreate(fn, attrs)
							return Reflect.apply(createHandler, thisArg, args)

						default:
							return Reflect.apply(fn, thisArg, args)
					}
                }
            })
        }
    }
    return wrap(workflowObj, objHandler)
}


export function instrumentWorkflow(WorkflowClass: any, initialiser: Initialiser): any {
    const classHandler: ProxyHandler<any> = {
        construct(target, [orig_ctx, orig_env]: [ExecutionContext, Env]) {
            const constructorConfig = initialiser(orig_env)
            const context = setConfig(constructorConfig)
            const env = instrumentEnv(orig_env) // Why is this not working? :(
            
            const createWorkflow = () => {
                return new target(orig_ctx, env)
            }
            const workflowObj = api_context.with(context, createWorkflow)

            return instrumentWorkflowInstance(workflowObj, initialiser, env, orig_ctx)
        }
    }
    return wrap(WorkflowClass, classHandler)
}

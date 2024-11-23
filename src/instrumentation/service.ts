import { passthroughGet, wrap } from '../wrap.js'
import { instrumentClientFetch } from './fetch.js'
import { instrumentWorkflowCreate } from './workflow.js'

export function instrumentServiceBinding(fetcher: Fetcher, envName: string): Fetcher {
	const fetcherHandler: ProxyHandler<Fetcher> = {
		get(target, prop) {
			const method = Reflect.get(target, prop)
			if (prop === 'fetch') {
				const attrs = {
					name: `Service Binding ${envName}`,
				}
				return instrumentClientFetch(method, () => ({ includeTraceContext: true }), attrs)
			} else if (prop === 'create') {
				return new Proxy(method, {
					apply: async (fn, thisArg, args) => {
						switch(prop) {
							case 'create':
								const createHandler = instrumentWorkflowCreate(fn, {
									name: `${String(envName)}`,
								})
								return Reflect.apply(createHandler, thisArg, args)
							default:
								return Reflect.apply(fn, thisArg, args)
						}
					}
				})
			}
			else {
				return passthroughGet(target, prop)
			}
		},
	}
	return wrap(fetcher, fetcherHandler)
}

import { isProxyable, wrap } from '../wrap.js'
import { instrumentDOBinding } from './do.js'
import { instrumentKV } from './kv.js'
import { instrumentQueueSender } from './queue.js'
import { instrumentServiceBinding } from './service.js'
import { instrumentD1 } from './d1'
import { instrumentAnalyticsEngineDataset } from './analytics-engine.js'
import { instrumentWorkflowBinding } from './workflow.js'

const isJSRPC = (item?: unknown): item is Service => {
	// @ts-expect-error The point of RPC types is to block non-existent properties, but that's the goal here
	return !!(item as Service)?.['__some_property_that_will_never_exist' + Math.random()]
}

const isKVNamespace = (item?: unknown): item is KVNamespace => {
	return !isJSRPC(item) && !!(item as KVNamespace)?.getWithMetadata
}

const isQueue = (item?: unknown): item is Queue<unknown> => {
	return !isJSRPC(item) && !!(item as Queue<unknown>)?.sendBatch
}

const isDurableObject = (item?: unknown): item is DurableObjectNamespace => {
	return !isJSRPC(item) && !!(item as DurableObjectNamespace)?.idFromName
}

export const isVersionMetadata = (item?: unknown): item is WorkerVersionMetadata => {
	return (
		!isJSRPC(item) &&
		typeof (item as WorkerVersionMetadata)?.id === 'string' &&
		typeof (item as WorkerVersionMetadata)?.tag === 'string'
	)
}

export const isWorkflowBinding = (item?: unknown): item is Workflow => {
	return !isJSRPC(item) && !!(item as Workflow)?.create
}

const isAnalyticsEngineDataset = (item?: unknown): item is AnalyticsEngineDataset => {
	return !isJSRPC(item) && !!(item as AnalyticsEngineDataset)?.writeDataPoint
}

const isD1Database = (item?: unknown): item is D1Database => {
	return !!(item as D1Database)?.exec && !!(item as D1Database)?.prepare
}

const instrumentEnv = (env: Record<string, unknown>): Record<string, unknown> => {
	const envHandler: ProxyHandler<Record<string, unknown>> = {
		get: (target, prop, receiver) => {
			const item = Reflect.get(target, prop, receiver)
			if (!isProxyable(item)) {
				return item
			}
			/**
			 * Workflows are essentially worker scripts so the .create property is a isJSRPC. The below was a bad hack, 
			 * instead trying to see if I can simply wrap the create method in the instrumentServiceBinding option. 
			 */
			// if (prop.toString().toLowerCase().endsWith('_workflow')) {
			// 	return instrumentWorkflowBinding(item, {
			// 		name: `${String(prop)}`,
			// 	});
			// }
			/**
			 * Both fetch and workflow are instrumented here.
			 */
			if (isJSRPC(item)) {
				return instrumentServiceBinding(item, String(prop))
			} else if (isKVNamespace(item)) {
				return instrumentKV(item, String(prop))
			} else if (isQueue(item)) {
				return instrumentQueueSender(item, String(prop))
			} else if (isDurableObject(item)) {
				return instrumentDOBinding(item, String(prop))
			} else if (isVersionMetadata(item)) {
				// we do not need to log accesses to the metadata
				return item
			} else if (isWorkflowBinding(item)) {
				/**
				 * Never happens. Workflow binding is done as part of the service binding.
				 */
				return instrumentWorkflowBinding(item, {
					name: `${String(prop)}`,
				})
			} else if (isAnalyticsEngineDataset(item)) {
				return instrumentAnalyticsEngineDataset(item, String(prop))
			} else if (isD1Database(item)) {
				return instrumentD1(item, String(prop))
			} else {
				return item
			}
		},
	}
	return wrap(env, envHandler)
}

export { instrumentEnv }

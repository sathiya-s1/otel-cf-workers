import { Context, Attributes } from '@opentelemetry/api';
import { Initialiser } from '../config.js';
/**
 * Get the parent context from the request headers. For RPC requests there is no request object
 * @param headers - The request headers
 * @returns The parent context
 */
export declare function getParentContextFromHeaders(headers: Headers | Map<string, string> | Record<string, any>): Context;
export declare function instrumentWorkflowCreate(createFn: Function, attrs: Attributes | {}): Function;
export declare function instrumentWorkflowBinding(workflowObj: any, attrs: Attributes | {}): any;
export declare function instrumentWorkflow(WorkflowClass: any, initialiser: Initialiser): any;

import { Context } from '@opentelemetry/api';
import { Initialiser } from '../config.js';
type AlarmFn = DurableObject['alarm'];
type AnyFn = (...args: any[]) => any;
/**
 * Get the parent context from the request headers. For RPC requests there is no request object
 * @param headers - The request headers
 * @returns The parent context
 */
export declare function getParentContextFromHeaders(headers: Headers | Map<string, string> | Record<string, any>): Context;
export declare function instrumentSqlExec(fn: Function): any;
export declare function instrumentSql(sql: SqlStorage): SqlStorage;
export type DOClass = {
    new (state: DurableObjectState, env: any): DurableObject;
};
export declare function executeDORPCFn(anyFn: AnyFn, fnName: string, argArray: any[], id: DurableObjectId): Promise<Response>;
export declare function executeDOAlarm(alarmFn: NonNullable<AlarmFn>, id: DurableObjectId): Promise<void>;
export declare function instrumentDOClassRPC(doClass: DOClass, initialiser: Initialiser, rpcFunctions: string[]): DOClass;
export {};
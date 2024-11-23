import { ResolvedTraceConfig, TraceConfig, Trigger } from './types.js';
export type Initialiser = (env: Record<string, unknown>, trigger?: Trigger | any) => ResolvedTraceConfig;
export declare function getContext(ctx?: import("@opentelemetry/api").Context): import("@opentelemetry/api").Context;
export declare function setConfig(config: ResolvedTraceConfig, ctx?: import("@opentelemetry/api").Context): import("@opentelemetry/api").Context;
export declare function getActiveConfig(): ResolvedTraceConfig | undefined;
export declare function parseConfig(supplied: TraceConfig): ResolvedTraceConfig;

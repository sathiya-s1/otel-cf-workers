import { ReadableSpan, Sampler } from '@opentelemetry/sdk-trace-base';
import { ParentRatioSamplingConfig } from './types';
export interface LocalTrace {
    readonly traceId: string;
    readonly localRootSpan: ReadableSpan;
    readonly spans: ReadableSpan[];
}
export type TailSampleFn = (traceInfo: LocalTrace) => boolean;
export declare function multiTailSampler(samplers: TailSampleFn[]): TailSampleFn;
export declare const isHeadSampled: TailSampleFn;
export declare const isRootErrorSpan: TailSampleFn;
export declare function createSampler(conf: ParentRatioSamplingConfig): Sampler;

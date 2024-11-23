export declare const isVersionMetadata: (item?: unknown) => item is WorkerVersionMetadata;
export declare const isWorkflowBinding: (item?: unknown) => item is Workflow;
declare const instrumentEnv: (env: Record<string, unknown>) => Record<string, unknown>;
export { instrumentEnv };

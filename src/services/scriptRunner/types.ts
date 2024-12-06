export interface ScriptRunner {
  execute(script: string): Promise<{
    output: string;
    error?: string;
  }>;
}

export interface ScriptExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTime: number;
}
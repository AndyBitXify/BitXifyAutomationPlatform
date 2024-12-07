export interface Script {
  id: string;
  name: string;
  description: string;
  type: 'powershell' | 'bash' | 'batch';
  content: string;
  category: string;
  status: 'idle' | 'running' | 'success' | 'failed';
  progress?: number;
  output?: string;
  lastRun?: string;
  createdAt: string;
  updatedAt: string;
  inputs?: ScriptInput[];
}

export interface ScriptInput {
  name: string;
  label?: string;
  type?: 'text' | 'password';
  required?: boolean;
  placeholder?: string;
  description?: string;
}

export interface CreateScriptData {
  name: string;
  description: string;
  type: Script['type'];
  content: string;
  category: string;
  inputs?: ScriptInput[];
}

export interface UpdateScriptData {
  name?: string;
  description?: string;
  content?: string;
  category?: string;
  inputs?: ScriptInput[];
}

export interface ScriptExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTime: number;
  requiresInput?: boolean;
  inputs?: ScriptInput[];
}
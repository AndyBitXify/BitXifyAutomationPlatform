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
}

export interface CreateScriptData {
  name: string;
  description: string;
  type: Script['type'];
  content: string;
  category: string;
}

export interface UpdateScriptData {
  name?: string;
  description?: string;
  content?: string;
  category?: string;
}

export interface ScriptExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTime: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}
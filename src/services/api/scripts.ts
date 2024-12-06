import { api } from './base';
import type { Script, CreateScriptData, UpdateScriptData, ScriptExecutionResult } from '../../types/script';

export const scriptsApi = {
  getAll: async () => {
    const { data } = await api.get<Script[]>('/scripts');
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<Script>(`/scripts/${id}`);
    return data;
  },

  create: async (scriptData: CreateScriptData) => {
    const { data } = await api.post<Script>('/scripts', scriptData);
    return data;
  },

  update: async (id: string, scriptData: UpdateScriptData) => {
    const { data } = await api.put<Script>(`/scripts/${id}`, scriptData);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete<void>(`/scripts/${id}`);
    return data;
  },

  execute: async (id: string, script: Script): Promise<ScriptExecutionResult> => {
    const { data } = await api.post<ScriptExecutionResult>(`/scripts/${id}/execute`, {
      content: script.content,
      type: script.type
    });
    return {
      ...data,
      success: true, // Assuming success if the request completes
      executionTime: Date.now() - new Date(script.lastRun || Date.now()).getTime()
    };
  },

  stop: async (id: string): Promise<void> => {
    const { data } = await api.post<void>(`/scripts/${id}/stop`);
    return data;
  },

  getStatus: async (id: string): Promise<Script> => {
    const { data } = await api.get<Script>(`/scripts/${id}/status`);
    return data;
  }
};
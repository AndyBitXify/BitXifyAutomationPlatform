import { Script } from '../../types/script';

const SCRIPTS_KEY = 'bitxify_scripts';

export const scriptStorage = {
  getScripts: (): Script[] => {
    const scripts = localStorage.getItem(SCRIPTS_KEY);
    if (!scripts) return [];
    
    // Reset any running scripts to idle on load
    const parsedScripts = JSON.parse(scripts);
    const resetScripts = parsedScripts.map((script: Script) => ({
      ...script,
      status: script.status === 'running' ? 'idle' : script.status,
      progress: 0,
      output: script.status === 'running' ? 
        `${script.output || ''}\n[${new Date().toISOString()}] Script execution interrupted by application restart.` : 
        script.output
    }));
    
    localStorage.setItem(SCRIPTS_KEY, JSON.stringify(resetScripts));
    return resetScripts;
  },

  saveScript: (script: Script) => {
    const scripts = scriptStorage.getScripts();
    scripts.push(script);
    localStorage.setItem(SCRIPTS_KEY, JSON.stringify(scripts));
  },

  deleteScript: (scriptId: string) => {
    const scripts = scriptStorage.getScripts();
    const updatedScripts = scripts.filter(script => script.id !== scriptId);
    localStorage.setItem(SCRIPTS_KEY, JSON.stringify(updatedScripts));
  },

  updateScript: (updatedScript: Script) => {
    const scripts = scriptStorage.getScripts();
    const index = scripts.findIndex(script => script.id === updatedScript.id);
    if (index !== -1) {
      scripts[index] = updatedScript;
      localStorage.setItem(SCRIPTS_KEY, JSON.stringify(scripts));
    }
  },

  resetRunningScripts: () => {
    const scripts = scriptStorage.getScripts();
    const resetScripts = scripts.map(script => ({
      ...script,
      status: script.status === 'running' ? 'idle' : script.status,
      progress: 0,
      output: script.status === 'running' ? 
        `${script.output || ''}\n[${new Date().toISOString()}] Script execution interrupted by application restart.` : 
        script.output
    }));
    localStorage.setItem(SCRIPTS_KEY, JSON.stringify(resetScripts));
    return resetScripts;
  }
};
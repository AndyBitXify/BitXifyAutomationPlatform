import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import type { Script, Log, DashboardStats } from '../types';

export function useScripts() {
  const [scripts, setScripts] = useState<Script[]>(storage.getScripts());
  const [logs, setLogs] = useState<Log[]>(storage.getLogs());
  const [stats, setStats] = useState<DashboardStats>({
    totalScripts: 0,
    activeScripts: 0,
    failedScripts: 0,
    successRate: 0,
  });

  useEffect(() => {
    storage.setScripts(scripts);
    updateStats(scripts);
  }, [scripts]);

  useEffect(() => {
    storage.setLogs(logs);
  }, [logs]);

  const updateStats = (currentScripts: Script[]) => {
    const totalScripts = currentScripts.length;
    const activeScripts = currentScripts.filter(
      (script) => script.status === 'running'
    ).length;
    const failedScripts = currentScripts.filter(
      (script) => script.status === 'failed'
    ).length;
    const successRate =
      totalScripts > 0
        ? Math.round(
            (currentScripts.filter((script) => script.status === 'success').length /
              totalScripts) *
              100
          )
        : 0;

    setStats({
      totalScripts,
      activeScripts,
      failedScripts,
      successRate,
    });
  };

  return {
    scripts,
    setScripts,
    logs,
    setLogs,
    stats,
  };
}
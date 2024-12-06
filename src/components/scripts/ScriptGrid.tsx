import React from 'react';
import { ScriptCard } from './ScriptCard';
import type { Script } from '../../types';

interface ScriptGridProps {
  scripts: Script[];
  onDelete: (id: string) => void;
  onRun: (id: string) => void;
  onStop: (id: string) => void;
}

export function ScriptGrid({ scripts, onDelete, onRun, onStop }: ScriptGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {scripts.map((script) => (
        <ScriptCard
          key={script.id}
          script={script}
          onDelete={onDelete}
          onRun={onRun}
          onStop={onStop}
        />
      ))}
    </div>
  );
}
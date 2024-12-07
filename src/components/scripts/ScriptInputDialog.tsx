import { useState } from 'react';
import { X } from 'lucide-react';
import type { ScriptInput } from '../../types/script';

interface ScriptInputDialogProps {
  inputs: ScriptInput[];
  onSubmit: (values: Record<string, string>) => void;
  onCancel: () => void;
}

export function ScriptInputDialog({ inputs, onSubmit, onCancel }: ScriptInputDialogProps) {
  const [values, setValues] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Script Input Required</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {inputs.map((input) => (
            <div key={input.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {input.label || input.name}
              </label>
              <input
                type={input.type === 'password' ? 'password' : 'text'}
                required={input.required !== false}
                value={values[input.name] || ''}
                onChange={(e) => setValues({ ...values, [input.name]: e.target.value })}
                placeholder={input.placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {input.description && (
                <p className="mt-1 text-sm text-gray-500">{input.description}</p>
              )}
            </div>
          ))}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
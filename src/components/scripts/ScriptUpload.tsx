import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { scriptStorage } from '../../services/storage/scriptStorage';
import { logStorage } from '../../services/storage/logStorage';
import type { Script } from '../../types/script';

export function ScriptUpload({ onClose, onUploadComplete }: { 
  onClose: () => void;
  onUploadComplete: () => void;
}) {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'other'
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFormData(prev => ({
        ...prev,
        name: selectedFile.name.replace(/\.[^/.]+$/, '')
      }));
    }
  };

  const handleUpload = async () => {
    if (!file || !user || !formData.name) return;

    setUploading(true);
    try {
      const content = await file.text();
      const script: Script = {
        id: crypto.randomUUID(),
        name: formData.name,
        content,
        type: getScriptType(file.name),
        category: formData.category,
        status: 'idle',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        description: formData.description || `Uploaded by ${user.name}`
      };

      scriptStorage.saveScript(script);
      
      logStorage.addActivityLog(
        'script_upload',
        'info',
        `Script "${script.name}" uploaded`,
        user,
        {
          scriptId: script.id,
          scriptName: script.name,
          scriptType: script.type
        }
      );

      onUploadComplete();
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const getScriptType = (filename: string): Script['type'] => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'ps1':
        return 'powershell';
      case 'sh':
        return 'bash';
      default:
        return 'batch';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Upload Script</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Script Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter script name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Enter script description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="database">Database Management</option>
              <option value="cloud">Cloud Infrastructure</option>
              <option value="server">Server Management</option>
              <option value="security">Security & Firewall</option>
              <option value="other">Other Scripts</option>
            </select>
          </div>

          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-sm text-gray-600 mb-2">
              {file ? file.name : 'Click to select a script file'}
            </p>
            <p className="text-xs text-gray-500">
              Supports .ps1, .sh, .bat, and .cmd files
            </p>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".ps1,.sh,.bat,.cmd"
            className="hidden"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || !formData.name || uploading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload Script'}
          </button>
        </div>
      </div>
    </div>
  );
}
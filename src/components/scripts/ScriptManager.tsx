import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { ScriptList } from './ScriptList';
import { ScriptUpload } from './ScriptUpload';
import { ScriptCategories } from './ScriptCategories';
import { scriptStorage } from '../../services/storage/scriptStorage';
import { categories } from '../../config/categories';
import type { Script } from '../../types/script';

export function ScriptManager() {
  const location = useLocation();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [scripts, setScripts] = useState<Script[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const searchResults = location.state?.searchResults;

  useEffect(() => {
    if (searchResults) {
      setScripts(searchResults);
    } else {
      loadScripts();
    }
  }, [searchResults]);

  const loadScripts = () => {
    const savedScripts = scriptStorage.getScripts();
    setScripts(savedScripts);
  };

  const filteredScripts = selectedCategory === 'all'
    ? scripts
    : scripts.filter(script => script.category === selectedCategory);

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Scripts</h1>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Upload Script
          </button>
        </div>

        <div className="grid grid-cols-[280px_1fr] gap-6">
          <div className="space-y-4">
            <ScriptCategories
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
          
          <div>
            <ScriptList scripts={filteredScripts} onScriptDeleted={loadScripts} />
          </div>
        </div>
      </div>

      {isUploadOpen && (
        <ScriptUpload
          onClose={() => setIsUploadOpen(false)}
          onUploadComplete={loadScripts}
        />
      )}
    </>
  );
}
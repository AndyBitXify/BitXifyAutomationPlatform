import { Database, Cloud, Server, Shield, Folder } from 'lucide-react';
import { scriptStorage } from '../../services/storage/scriptStorage';
import { logStorage } from '../../services/storage/logStorage';
import type { Category } from '../../types/script';

interface ScriptCategoriesProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

const categoryIcons = {
  database: Database,
  cloud: Cloud,
  server: Server,
  security: Shield,
  other: Folder,
};

export function ScriptCategories({
  categories,
  selectedCategory,
  onSelectCategory,
}: ScriptCategoriesProps) {
  const scripts = scriptStorage.getScripts();
  const logs = logStorage.getLogs();
  
  const getCategoryStats = (categoryId: string) => {
    const categoryScripts = categoryId === 'all' 
      ? scripts 
      : scripts.filter(script => script.category === categoryId);

    const categoryLogs = logs.filter(log => 
      categoryId === 'all' 
        ? log.action.startsWith('script_')
        : log.details?.category === categoryId
    );
    
    return {
      total: categoryScripts.length,
      uploads: categoryLogs.filter(log => log.action === 'script_upload').length,
      runs: categoryLogs.filter(log => log.action === 'script_run').length,
    };
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
        <nav className="space-y-1">
          <button
            onClick={() => onSelectCategory('all')}
            className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Folder className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium truncate">All Scripts</span>
            </div>
            <span className="ml-2 text-sm font-medium">
              {getCategoryStats('all').total}
            </span>
          </button>

          {categories.map((category) => {
            const Icon = categoryIcons[category.icon as keyof typeof categoryIcons];
            const stats = getCategoryStats(category.id);
            
            return (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium truncate">{category.name}</span>
                </div>
                <span className="ml-2 text-sm font-medium">
                  {stats.total}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Category Activity</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Scripts</span>
            <span className="font-medium text-gray-900">
              {getCategoryStats(selectedCategory).total}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Total Uploads</span>
            <span className="font-medium text-gray-900">
              {getCategoryStats(selectedCategory).uploads}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Total Runs</span>
            <span className="font-medium text-gray-900">
              {getCategoryStats(selectedCategory).runs}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
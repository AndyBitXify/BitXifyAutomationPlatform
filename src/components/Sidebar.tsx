import React from 'react';
import { Folder, Database, Cloud, Server, Shield, Plus } from 'lucide-react';
import type { Category } from '../types';

interface SidebarProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  onUploadClick: () => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  database: <Database className="w-5 h-5" />,
  cloud: <Cloud className="w-5 h-5" />,
  server: <Server className="w-5 h-5" />,
  security: <Shield className="w-5 h-5" />,
  other: <Folder className="w-5 h-5" />,
};

export function Sidebar({ categories, selectedCategory, onSelectCategory, onUploadClick }: SidebarProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-64">
      <button
        onClick={onUploadClick}
        className="w-full mb-6 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Upload Script
      </button>

      <div className="space-y-1">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {categoryIcons[category.icon]}
            <span>{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
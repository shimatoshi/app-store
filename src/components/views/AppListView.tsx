import React from 'react';
import { AppData } from '../../types';

interface AppListViewProps {
  apps: AppData[];
  searchQuery: string;
  onAppSelect: (app: AppData) => void;
}

const AppListView: React.FC<AppListViewProps> = ({ apps, searchQuery, onAppSelect }) => {
  return (
    <section>
      <div className="flex justify-between items-end mb-4">
        <h3 className="text-xl font-bold dark:text-white">
          {searchQuery ? '検索結果' : 'おすすめ'}
        </h3>
        {!searchQuery && <button className="text-blue-500 text-sm font-medium">すべて表示</button>}
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {apps.length > 0 ? apps.map(app => (
          <div 
            key={app.id}
            onClick={() => onAppSelect(app)}
            className="flex items-center gap-4 bg-white dark:bg-gray-900 p-3 rounded-2xl border dark:border-gray-800 active:scale-95 transition-transform cursor-pointer"
          >
            <div className="text-4xl w-16 h-16 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden">
              {app.icon && (app.icon.startsWith('http') || app.icon.startsWith('/')) ? (
                <img src={app.icon} alt={app.name} className="w-full h-full object-cover" />
              ) : (
                app.icon
              )}
            </div>
            <div className="flex-1 min-w-0 border-b dark:border-gray-800 pb-3">
              <h4 className="font-bold text-gray-900 dark:text-white truncate">{app.name}</h4>
              <p className="text-sm text-gray-500 truncate">{app.description}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">
                  {app.category}
                </span>
              </div>
            </div>
            <div className="pl-2">
              <button className="bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400 px-4 py-1.5 rounded-full font-bold text-sm">
                入手
              </button>
            </div>
          </div>
        )) : (
          <p className="text-center text-gray-500 py-10">アプリが見つかりません</p>
        )}
      </div>
    </section>
  );
};

export default AppListView;

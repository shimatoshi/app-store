import React from 'react';
import { AppData } from '../types';

interface AppCardProps {
  app: AppData;
  onClick: (app: AppData) => void;
}

const AppCard: React.FC<AppCardProps> = ({ app, onClick }) => {
  const isImageUrl = app.icon && (app.icon.startsWith('http') || app.icon.startsWith('/'));
  return (
    <div 
      className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm hover:shadow-lg transition-all cursor-pointer border border-gray-100 dark:border-gray-700 group"
      onClick={() => onClick(app)}
    >
      <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-200 h-16 w-16 flex items-center justify-center overflow-hidden rounded-xl mx-auto">
        {isImageUrl ? (
          <img src={app.icon} alt={app.name} className="w-full h-full object-cover" />
        ) : (
          app.icon
        )}
      </div>
      <h3 className="font-bold text-gray-800 dark:text-gray-100 truncate mb-1 text-center">{app.name}</h3>
      <p className="text-xs text-google-gray dark:text-gray-400 mb-3 text-center">{app.category}</p>
      <div className="flex items-center justify-end">
        <button className="text-xs bg-blue-50 dark:bg-blue-900/30 text-google-blue dark:text-blue-400 px-3 py-1 rounded-full font-bold group-hover:bg-google-blue group-hover:text-white transition-colors">
          詳細
        </button>
      </div>
    </div>
  );
};

export default AppCard;

import React from 'react';
import { X, Download, ExternalLink, Code } from 'lucide-react';
import { AppData } from '../types';

interface ModalProps {
  app: AppData | null;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ app, onClose }) => {
  if (!app) return null;
  const isImageUrl = app.icon && (app.icon.startsWith('http') || app.icon.startsWith('/'));
  return (
    <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden max-h-[95vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b dark:border-gray-800 z-10">
          <span className="font-bold dark:text-white">詳細</span>
          <button onClick={onClose} className="bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-full w-8 h-8 flex items-center justify-center font-bold"><X size={18} /></button>
        </div>

        <div className="overflow-y-auto p-6">
          <div className="flex gap-5 mb-8">
            <div className="text-6xl w-24 h-24 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-inner overflow-hidden">
              {isImageUrl ? (
                <img src={app.icon} alt={app.name} className="w-full h-full object-cover" />
              ) : (
                app.icon
              )}
            </div>
            <div className="flex flex-col justify-center flex-1">
              <h2 className="text-2xl font-bold dark:text-white leading-tight mb-1">{app.name}</h2>
              <p className="text-blue-600 dark:text-blue-400 font-medium text-sm mb-3">{app.category}</p>
              <button 
                onClick={() => {
                  if (app.link) {
                    window.open(app.link, '_blank');
                  }
                }}
                className="bg-blue-600 text-white px-6 py-1.5 rounded-full font-bold text-sm self-start shadow-lg shadow-blue-500/30 active:scale-95 transition-transform"
              >
                入手
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 py-4 border-y dark:border-gray-800 mb-8">
            <div className="text-center border-r dark:border-gray-800">
              <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">年齢</p>
              <p className="text-lg font-bold dark:text-gray-200">4+</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">開発元</p>
              <p className="text-lg font-bold dark:text-gray-200 truncate px-2">
                {app.developer_name || (app.user_id ? 'User' : 'Dev')}
              </p>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-3 dark:text-white">概要</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {app.description}
            </p>
          </div>

          <div className="mb-8 bg-gray-50 dark:bg-gray-800/50 p-5 rounded-2xl border dark:border-gray-700">
            <h3 className="font-bold mb-3 text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <span>📥</span> インストール方法
            </h3>
            <ol className="space-y-3">
              {(app.install_steps || app.installSteps || []).map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-[10px]">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <a 
            href={app.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400 text-center py-4 rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors mb-4"
          >
            {app.category === 'PWA' ? '🔗 アプリを開く' : '💻 ソースを見る'}
          </a>
        </div>
      </div>
    </div>
  );
};

export default Modal;

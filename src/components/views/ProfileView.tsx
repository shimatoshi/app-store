import React from 'react';
import { User } from '@supabase/supabase-js';
import { Trash2, Edit, ChevronRight } from 'lucide-react';
import { AppData } from '../../types';
import { useAppsQuery } from '../../hooks/useAppsQuery';
import Button from '../ui/Button';

interface ProfileViewProps {
  user: User | null;
  allApps: AppData[];
  onLogout: () => void;
  onAuthClick: () => void;
  onSubmitClick: () => void;
  onAppSelect: (app: AppData) => void;
  onEditClick: (app: AppData) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, allApps, onLogout, onAuthClick, onSubmitClick, onAppSelect, onEditClick }) => {
  const { deleteApp } = useAppsQuery();

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-2xl text-white font-bold shadow-inner">
            {user?.email ? user.email[0].toUpperCase() : 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold dark:text-white">{user?.email ? user.email.split('@')[0] : 'ゲストユーザー'}</h2>
            <p className="text-gray-500 text-sm">{user?.email ? user.email : 'ログインしてアプリを出品しよう'}</p>
          </div>
        </div>
        {user ? (
          <Button 
            variant="danger"
            className="w-full"
            onClick={onLogout}
          >
            ログアウト
          </Button>
        ) : (
          <Button 
            className="w-full"
            onClick={onAuthClick}
          >
            ログイン / 新規登録
          </Button>
        )}
      </div>
      
      {user && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold dark:text-white px-2">自分の投稿</h3>
          <div className="grid grid-cols-1 gap-3">
            {allApps.filter(app => app.user_id === user?.id).length > 0 ? (
              allApps.filter(app => app.user_id === user?.id).map(app => (
                <div 
                  key={app.id} 
                  onClick={() => onAppSelect(app)}
                  className="flex items-center gap-3 bg-white dark:bg-gray-900 p-3 rounded-2xl border dark:border-gray-800 cursor-pointer active:scale-95 transition-transform"
                >
                  <div className="text-2xl w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
                    {app.icon && (app.icon.startsWith('http') || app.icon.startsWith('/')) ? (
                      <img src={app.icon} alt={app.name} className="w-full h-full object-cover" />
                    ) : (
                      app.icon
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm dark:text-white truncate">{app.name}</h4>
                    <p className="text-xs text-gray-500 truncate">{app.category}</p>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditClick(app);
                      }}
                      className="text-blue-500 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (confirm('このアプリを削除しますか？')) {
                          await deleteApp(app.id);
                        }
                      }}
                      className="text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                        <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">まだ投稿したアプリはありません</p>
            )}
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-3xl border dark:border-gray-800 overflow-hidden shadow-sm">
        <button 
          onClick={() => user ? onSubmitClick() : onAuthClick()}
          className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <span className="font-medium dark:text-white">アプリを出品する</span>
          <ChevronRight className="text-gray-400" size={18} />
        </button>
      </div>
    </div>
  );
};

export default ProfileView;

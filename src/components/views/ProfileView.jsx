import React from 'react';
import { supabase } from '../../lib/supabase';

const ProfileView = ({ user, allApps, onLogout, onAuthClick, onSubmitClick, onAppSelect, onRefresh }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-2xl text-white font-bold">
            {user ? user.email[0].toUpperCase() : 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold dark:text-white">{user ? user.email.split('@')[0] : 'ゲストユーザー'}</h2>
            <p className="text-gray-500 text-sm">{user ? user.email : 'ログインしてアプリを出品しよう'}</p>
          </div>
        </div>
        {user ? (
          <button 
            onClick={onLogout}
            className="w-full bg-gray-100 dark:bg-gray-800 text-red-500 py-3 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            ログアウト
          </button>
        ) : (
          <button 
            onClick={onAuthClick}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
          >
            ログイン / 新規登録
          </button>
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
                  <button 
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (confirm('このアプリを削除しますか？')) {
                        try {
                          const { error } = await supabase.from('apps').delete().eq('id', app.id);
                          if (error) throw error;
                          onRefresh();
                        } catch (err) {
                          alert('削除に失敗しました: ' + err.message);
                        }
                      }
                    }}
                    className="text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  >
                    🗑️
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">まだ投稿したアプリはありません</p>
            )}
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-2xl border dark:border-gray-800 overflow-hidden">
        <button 
          onClick={() => user ? onSubmitClick() : onAuthClick()}
          className="w-full px-6 py-4 text-left border-b dark:border-gray-800 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <span className="font-medium dark:text-white">アプリを出品する</span>
          <span className="text-gray-400">＞</span>
        </button>
        <button 
          onClick={() => alert('購入済み・インストール済み機能は現在準備中です')}
          className="w-full px-6 py-4 text-left border-b dark:border-gray-800 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <span className="font-medium dark:text-white">購入済み / インストール済み</span>
          <span className="text-gray-400">＞</span>
        </button>
        <button 
          onClick={() => alert('設定機能は現在準備中です')}
          className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <span className="font-medium dark:text-white">設定</span>
          <span className="text-gray-400">＞</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileView;

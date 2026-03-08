import React, { useState, useEffect } from 'react';
import { getApps, signOut, getCurrentUser, supabase } from './lib/supabase';
import AppCard from './components/AppCard';
import Modal from './components/Modal';
import AuthForm from './components/AuthForm';
import SubmitForm from './components/SubmitForm';
import NavButton from './components/NavButton';

function App() {
  const [selectedApp, setSelectedApp] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [allApps, setAllApps] = useState([]);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [user, setUser] = useState(null);
  const [showAuthForm, setShowAuthForm] = useState(false);

  useEffect(() => {
    const init = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      loadApps();
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadApps = async () => {
    try {
      const customApps = await getApps();
      setAllApps(customApps);
    } catch (err) {
      console.error('Failed to load apps:', err);
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const getFilteredApps = () => {
    let filtered = allApps;
    if (activeTab === 'pwa') filtered = allApps.filter(a => a.category === 'PWA');
    if (activeTab === 'packages') filtered = allApps.filter(a => a.category === 'Termux');
    
    if (searchQuery) {
      filtered = filtered.filter(app => 
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        app.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  };

  const filteredApps = getFilteredApps();

  const handleSuccess = async () => {
    setShowSubmitForm(false);
    await loadApps();
    setActiveTab('home');
  };

  const handleLogout = async () => {
    await signOut();
    setActiveTab('home');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300 pb-20">
      {/* Header */}
      <header className="bg-white/80 dark:bg-black/80 backdrop-blur-md border-b dark:border-gray-800 sticky top-0 z-20 px-4 py-3">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-extrabold tracking-tight dark:text-white">
            {showSubmitForm ? '出品' : showAuthForm ? '認証' : (
              <>
                {activeTab === 'home' && '見つける'}
                {activeTab === 'pwa' && 'PWAアプリ'}
                {activeTab === 'packages' && 'パッケージ'}
                {activeTab === 'search' && '検索'}
                {activeTab === 'profile' && 'アカウント'}
              </>
            )}
          </h1>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {showAuthForm ? (
          <AuthForm onAuthSuccess={() => setShowAuthForm(false)} onCancel={() => setShowAuthForm(false)} />
        ) : showSubmitForm ? (
          <SubmitForm onCancel={() => setShowSubmitForm(false)} onSuccess={handleSuccess} user={user} />
        ) : (
          <>
            {/* Search Bar */}
            {(activeTab === 'search' || activeTab === 'home') && (
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="ゲーム、App、ストーリーなど"
                    className="w-full bg-gray-200 dark:bg-gray-800 border-none rounded-xl py-2.5 px-10 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setActiveTab('search')}
                  />
                  <span className="absolute left-3 top-3 text-gray-500">🔍</span>
                </div>
              </div>
            )}

            {/* Content based on Tab */}
            {activeTab === 'profile' ? (
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
                      onClick={handleLogout}
                      className="w-full bg-gray-100 dark:bg-gray-800 text-red-500 py-3 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      ログアウト
                    </button>
                  ) : (
                    <button 
                      onClick={() => setShowAuthForm(true)}
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
                            onClick={() => setSelectedApp(app)}
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
                                    await handleSuccess();
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
                    onClick={() => user ? setShowSubmitForm(true) : setShowAuthForm(true)}
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
            ) : (
              <div className="space-y-8">
                {/* Featured Section */}
                {activeTab === 'home' && !searchQuery && allApps.length > 0 && (
                  <section>
                    <div className="bg-gradient-to-br from-indigo-600 to-blue-500 rounded-3xl p-6 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden">
                      <div className="relative z-10">
                        <p className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">注目のパッケージ</p>
                        <h2 className="text-3xl font-extrabold mb-4">{allApps[0].name}</h2>
                        <button onClick={() => setSelectedApp(allApps[0])} className="bg-white text-blue-600 px-5 py-2 rounded-full font-bold text-sm">今すぐ入手</button>
                      </div>
                      <div className="absolute right-[-20px] bottom-[-20px] opacity-20 rotate-12 select-none h-40 w-40 flex items-center justify-center" style={{fontSize: '150px'}}>
                        {allApps[0].icon && (allApps[0].icon.startsWith('http') || allApps[0].icon.startsWith('/')) ? (
                          <img src={allApps[0].icon} alt="" className="w-full h-full object-cover opacity-50" />
                        ) : (
                          allApps[0].icon
                        )}
                      </div>
                    </div>
                  </section>
                )}

                <section>
                  <div className="flex justify-between items-end mb-4">
                    <h3 className="text-xl font-bold dark:text-white">
                      {searchQuery ? '検索結果' : 'おすすめ'}
                    </h3>
                    {!searchQuery && <button className="text-blue-500 text-sm font-medium">すべて表示</button>}
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {filteredApps.length > 0 ? filteredApps.map(app => (
                      <div 
                        key={app.id}
                        onClick={() => setSelectedApp(app)}
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
              </div>
            )}
          </>
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-black/90 backdrop-blur-lg border-t dark:border-gray-800 px-6 py-2 z-30">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <NavButton active={activeTab === 'home' && !showSubmitForm && !showAuthForm} onClick={() => {setActiveTab('home'); setShowSubmitForm(false); setShowAuthForm(false);}} icon="🏠" label="ホーム" />
          <NavButton active={activeTab === 'pwa' && !showSubmitForm && !showAuthForm} onClick={() => {setActiveTab('pwa'); setShowSubmitForm(false); setShowAuthForm(false);}} icon="📱" label="PWA" />
          <NavButton active={activeTab === 'packages' && !showSubmitForm && !showAuthForm} onClick={() => {setActiveTab('packages'); setShowSubmitForm(false); setShowAuthForm(false);}} icon="📦" label="パッケージ" />
          <NavButton active={activeTab === 'search' && !showSubmitForm && !showAuthForm} onClick={() => {setActiveTab('search'); setShowSubmitForm(false); setShowAuthForm(false);}} icon="🔍" label="検索" />
          <NavButton active={activeTab === 'profile' || showSubmitForm || showAuthForm} onClick={() => setActiveTab('profile')} icon="👤" label="マイページ" />
        </div>
      </nav>

      <Modal app={selectedApp} onClose={() => setSelectedApp(null)} />
    </div>
  );
}

export default App;

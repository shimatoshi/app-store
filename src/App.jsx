import React, { useState, useEffect } from 'react';
import { apps } from './data/apps';

const AppCard = ({ app, onClick }) => (
  <div 
    className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm hover:shadow-lg transition-all cursor-pointer border border-gray-100 dark:border-gray-700 group"
    onClick={() => onClick(app)}
  >
    <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-200">{app.icon}</div>
    <h3 className="font-bold text-gray-800 dark:text-gray-100 truncate mb-1">{app.name}</h3>
    <p className="text-xs text-google-gray dark:text-gray-400 mb-3">{app.category}</p>
    <div className="flex items-center justify-between">
      <div className="flex items-center text-xs text-orange-500 font-bold">
        <span>★ {app.rating}</span>
      </div>
      <button className="text-xs bg-blue-50 dark:bg-blue-900/30 text-google-blue dark:text-blue-400 px-3 py-1 rounded-full font-bold group-hover:bg-google-blue group-hover:text-white transition-colors">
        詳細
      </button>
    </div>
  </div>
);

const Modal = ({ app, onClose }) => {
  if (!app) return null;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden max-h-[95vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b dark:border-gray-800 z-10">
          <span className="font-bold dark:text-white">詳細</span>
          <button onClick={onClose} className="bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-full w-8 h-8 flex items-center justify-center font-bold">✕</button>
        </div>

        <div className="overflow-y-auto p-6">
          <div className="flex gap-5 mb-8">
            <div className="text-6xl w-24 h-24 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-inner">
              {app.icon}
            </div>
            <div className="flex flex-col justify-center flex-1">
              <h2 className="text-2xl font-bold dark:text-white leading-tight mb-1">{app.name}</h2>
              <p className="text-blue-600 dark:text-blue-400 font-medium text-sm mb-3">{app.category}</p>
              <button className="bg-blue-600 text-white px-6 py-1.5 rounded-full font-bold text-sm self-start shadow-lg shadow-blue-500/30">
                入手
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 py-4 border-y dark:border-gray-800 mb-8">
            <div className="text-center border-r dark:border-gray-800">
              <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">評価</p>
              <p className="text-lg font-bold dark:text-gray-200">{app.rating} ★</p>
            </div>
            <div className="text-center border-r dark:border-gray-800">
              <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">年齢</p>
              <p className="text-lg font-bold dark:text-gray-200">4+</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">開発元</p>
              <p className="text-lg font-bold dark:text-gray-200">Dev</p>
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
              {app.installSteps.map((step, i) => (
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

function App() {
  const [selectedApp, setSelectedApp] = useState(null);
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'pwa', 'packages', 'search', 'profile'
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const getFilteredApps = () => {
    let filtered = apps;
    if (activeTab === 'pwa') filtered = apps.filter(a => a.category === 'PWA');
    if (activeTab === 'packages') filtered = apps.filter(a => a.category === 'Termux');
    
    if (searchQuery) {
      filtered = filtered.filter(app => 
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        app.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  };

  const filteredApps = getFilteredApps();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300 pb-20">
      {/* Header - Mobile Optimized */}
      <header className="bg-white/80 dark:bg-black/80 backdrop-blur-md border-b dark:border-gray-800 sticky top-0 z-20 px-4 py-3">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-extrabold tracking-tight dark:text-white">
            {activeTab === 'home' && '見つける'}
            {activeTab === 'pwa' && 'PWAアプリ'}
            {activeTab === 'packages' && 'パッケージ'}
            {activeTab === 'search' && '検索'}
            {activeTab === 'profile' && 'アカウント'}
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
        {/* Search Bar (Only in Search Tab or Home) */}
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
                  U
                </div>
                <div>
                  <h2 className="text-xl font-bold dark:text-white">ゲストユーザー</h2>
                  <p className="text-gray-500 text-sm">ログインしてアプリを出品しよう</p>
                </div>
              </div>
              <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
                ログイン / 新規登録
              </button>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-2xl border dark:border-gray-800 overflow-hidden">
              <button className="w-full px-6 py-4 text-left border-b dark:border-gray-800 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <span className="font-medium dark:text-white">アプリを出品する</span>
                <span className="text-gray-400">＞</span>
              </button>
              <button className="w-full px-6 py-4 text-left border-b dark:border-gray-800 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <span className="font-medium dark:text-white">購入済み / インストール済み</span>
                <span className="text-gray-400">＞</span>
              </button>
              <button className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <span className="font-medium dark:text-white">設定</span>
                <span className="text-gray-400">＞</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Featured Section (Only on Home) */}
            {activeTab === 'home' && !searchQuery && (
              <section>
                <div className="bg-gradient-to-br from-indigo-600 to-blue-500 rounded-3xl p-6 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden">
                  <div className="relative z-10">
                    <p className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">注目のパッケージ</p>
                    <h2 className="text-3xl font-extrabold mb-4">Termuxで<br/>開発環境を爆速構築</h2>
                    <button className="bg-white text-blue-600 px-5 py-2 rounded-full font-bold text-sm">今すぐ入手</button>
                  </div>
                  <div className="absolute right-[-20px] bottom-[-20px] opacity-20 rotate-12 select-none" style={{fontSize: '150px'}}>💻</div>
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
                {filteredApps.map(app => (
                  <div 
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className="flex items-center gap-4 bg-white dark:bg-gray-900 p-3 rounded-2xl border dark:border-gray-800 active:scale-95 transition-transform cursor-pointer"
                  >
                    <div className="text-4xl w-16 h-16 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-2xl">
                      {app.icon}
                    </div>
                    <div className="flex-1 min-w-0 border-b dark:border-gray-800 pb-3">
                      <h4 className="font-bold text-gray-900 dark:text-white truncate">{app.name}</h4>
                      <p className="text-sm text-gray-500 truncate">{app.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">
                          {app.category}
                        </span>
                        <span className="text-xs text-gray-400">★ {app.rating}</span>
                      </div>
                    </div>
                    <div className="pl-2">
                      <button className="bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400 px-4 py-1.5 rounded-full font-bold text-sm">
                        入手
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-black/90 backdrop-blur-lg border-t dark:border-gray-800 px-6 py-2 z-30">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon="🏠" label="ホーム" />
          <NavButton active={activeTab === 'pwa'} onClick={() => setActiveTab('pwa')} icon="📱" label="PWA" />
          <NavButton active={activeTab === 'packages'} onClick={() => setActiveTab('packages')} icon="📦" label="パッケージ" />
          <NavButton active={activeTab === 'search'} onClick={() => setActiveTab('search')} icon="🔍" label="検索" />
          <NavButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon="👤" label="マイページ" />
        </div>
      </nav>

      <Modal app={selectedApp} onClose={() => setSelectedApp(null)} />
    </div>
  );
}

const NavButton = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-blue-600' : 'text-gray-400'}`}
  >
    <span className="text-xl">{icon}</span>
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default App;

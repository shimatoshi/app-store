import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { useAppsQuery } from './hooks/useAppsQuery';

import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import ProfileView from './components/views/ProfileView';
import AppListView from './components/views/AppListView';

import Modal from './components/Modal';
import AuthForm from './components/AuthForm';
import SubmitForm from './components/SubmitForm';
import { AppData } from './types';
import { CATEGORIES } from './constants';

const App: React.FC = () => {
  const { user, handleLogout, loading: authLoading } = useAuth();
  const { apps: allApps, isLoading: appsLoading } = useAppsQuery();

  const [selectedApp, setSelectedApp] = useState<AppData | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const getFilteredAppsLocal = (tab: string, query: string) => {
    let filtered = allApps;
    if (tab === 'pwa') filtered = allApps.filter((a: any) => a.category === CATEGORIES.PWA);
    if (tab === 'packages') filtered = allApps.filter((a: any) => a.category === CATEGORIES.TERMUX);
    
    if (query) {
      filtered = filtered.filter((app: any) => 
        app.name.toLowerCase().includes(query.toLowerCase()) || 
        app.description.toLowerCase().includes(query.toLowerCase())
      );
    }
    return filtered;
  };

  const filteredApps = getFilteredAppsLocal(activeTab, searchQuery);

  const handleSuccess = () => {
    setShowSubmitForm(false);
    setActiveTab('home');
  };

  const getTitle = () => {
    if (showSubmitForm) return '出品';
    if (showAuthForm) return '認証';
    switch (activeTab) {
      case 'home': return '見つける';
      case 'pwa': return 'PWAアプリ';
      case 'packages': return 'パッケージ';
      case 'search': return '検索';
      case 'profile': return 'アカウント';
      default: return 'App Store';
    }
  };

  const isLoading = authLoading || appsLoading;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300 pb-20 font-sans">
      <Header title={getTitle()} darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="max-w-2xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium">読み込み中...</p>
          </div>
        ) : showAuthForm ? (
          <AuthForm onAuthSuccess={() => setShowAuthForm(false)} onCancel={() => setShowAuthForm(false)} />
        ) : showSubmitForm ? (
          <SubmitForm onCancel={() => setShowSubmitForm(false)} onSuccess={handleSuccess} user={user} />
        ) : (
          <>
            {(activeTab === 'search' || activeTab === 'home') && (
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="ゲーム、App、ストーリーなど"
                    className="w-full bg-gray-200 dark:bg-gray-800 border-none rounded-xl py-2.5 px-10 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setActiveTab('search')}
                  />
                  <Search className="absolute left-3 top-3 text-gray-500" size={18} />
                </div>
              </div>
            )}

            {activeTab === 'profile' ? (
              <ProfileView 
                user={user} 
                allApps={allApps} 
                onLogout={handleLogout}
                onAuthClick={() => setShowAuthForm(true)}
                onSubmitClick={() => setShowSubmitForm(true)}
                onAppSelect={setSelectedApp}
              />
            ) : (
              <div className="space-y-8 animate-in fade-in duration-500">
                {activeTab === 'home' && !searchQuery && allApps.length > 0 && (
                  <section>
                    <div className="bg-gradient-to-br from-indigo-600 to-blue-500 rounded-3xl p-6 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden">
                      <div className="relative z-10">
                        <p className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">注目のパッケージ</p>
                        <h2 className="text-3xl font-extrabold mb-4">{allApps[0].name}</h2>
                        <button onClick={() => setSelectedApp(allApps[0])} className="bg-white text-blue-600 px-5 py-2 rounded-full font-bold text-sm active:scale-95 transition-transform">今すぐ入手</button>
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
                <AppListView apps={filteredApps} searchQuery={searchQuery} onAppSelect={setSelectedApp} />
              </div>
            )}
          </>
        )}
      </main>

      <BottomNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        showSubmitForm={showSubmitForm} 
        showAuthForm={showAuthForm} 
      />

      <Modal app={selectedApp} onClose={() => setSelectedApp(null)} />
    </div>
  );
}

export default App;

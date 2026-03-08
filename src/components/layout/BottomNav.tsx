import React from 'react';
import { Home, Smartphone, Package, Search, User } from 'lucide-react';
import NavButton from '../NavButton';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showSubmitForm: boolean;
  showAuthForm: boolean;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, showSubmitForm, showAuthForm }) => {
  const isProfileActive = activeTab === 'profile' || showSubmitForm || showAuthForm;
  const isOtherActive = (tab: string) => activeTab === tab && !showSubmitForm && !showAuthForm;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-black/90 backdrop-blur-lg border-t dark:border-gray-800 px-6 py-2 z-30">
      <div className="max-w-2xl mx-auto flex justify-between items-center">
        <NavButton active={isOtherActive('home')} onClick={() => setActiveTab('home')} icon={Home} label="ホーム" />
        <NavButton active={isOtherActive('pwa')} onClick={() => setActiveTab('pwa')} icon={Smartphone} label="PWA" />
        <NavButton active={isOtherActive('packages')} onClick={() => setActiveTab('packages')} icon={Package} label="パッケージ" />
        <NavButton active={isOtherActive('search')} onClick={() => setActiveTab('search')} icon={Search} label="検索" />
        <NavButton active={isProfileActive} onClick={() => setActiveTab('profile')} icon={User} label="マイページ" />
      </div>
    </nav>
  );
};

export default BottomNav;

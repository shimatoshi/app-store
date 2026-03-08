import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface HeaderProps {
  title: string;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ title, darkMode, setDarkMode }) => (
  <header className="bg-white/80 dark:bg-black/80 backdrop-blur-md border-b dark:border-gray-800 sticky top-0 z-20 px-4 py-3">
    <div className="max-w-2xl mx-auto flex justify-between items-center">
      <h1 className="text-2xl font-extrabold tracking-tight dark:text-white">
        {title}
      </h1>
      <button 
        onClick={() => setDarkMode(!darkMode)}
        className={cn(
          "p-2 rounded-full transition-all active:scale-90",
          "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
        )}
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </div>
  </header>
);

export default Header;

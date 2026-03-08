import React from 'react';

const Header = ({ title, darkMode, setDarkMode }) => (
  <header className="bg-white/80 dark:bg-black/80 backdrop-blur-md border-b dark:border-gray-800 sticky top-0 z-20 px-4 py-3">
    <div className="max-w-2xl mx-auto flex justify-between items-center">
      <h1 className="text-2xl font-extrabold tracking-tight dark:text-white">
        {title}
      </h1>
      <button 
        onClick={() => setDarkMode(!darkMode)}
        className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
      >
        {darkMode ? '☀️' : '🌙'}
      </button>
    </div>
  </header>
);

export default Header;

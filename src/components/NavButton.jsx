import React from 'react';

const NavButton = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-blue-600' : 'text-gray-400'}`}
  >
    <span className="text-xl">{icon}</span>
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default NavButton;

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  error?: string;
  isTextArea?: boolean;
}

const Input: React.FC<InputProps> = ({ label, error, isTextArea, className = '', ...props }) => {
  const baseStyles = 'w-full bg-gray-100 dark:bg-gray-800 border-none rounded-xl py-3 px-4 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all';
  
  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-bold dark:text-gray-300">{label}</label>}
      {isTextArea ? (
        <textarea 
          className={`${baseStyles} h-24 ${className}`}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input 
          className={`${baseStyles} ${className}`}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default Input;

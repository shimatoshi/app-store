import React, { useState } from 'react';
import { submitApp } from '../lib/supabase';

import { CATEGORIES, APP_CONFIG } from '../constants';

const SubmitForm = ({ onCancel, onSuccess, user }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: CATEGORIES.PWA,
    description: '',
    icon: APP_CONFIG.DEFAULT_ICON,
    link: '',
    installSteps: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const appToSubmit = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        icon: formData.icon,
        link: formData.link,
        install_steps: formData.installSteps.split('\n').filter(s => s.trim() !== '')
      };
      await submitApp(appToSubmit);
      onSuccess();
    } catch (err) {
      alert('エラーが発生しました: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-xl border dark:border-gray-800 animate-in fade-in zoom-in duration-300">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">アプリを出品する</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold mb-1 dark:text-gray-300">アプリ名</label>
          <input 
            required
            className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-xl py-3 px-4 dark:text-white"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            placeholder="例: お天気アプリ"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-1 dark:text-gray-300">カテゴリ</label>
            <select 
              className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-xl py-3 px-4 dark:text-white"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option value={CATEGORIES.PWA}>{CATEGORIES.PWA}</option>
              <option value={CATEGORIES.TERMUX}>{CATEGORIES.TERMUX}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1 dark:text-gray-300">アイコン (絵文字 または 画像URL)</label>
            <input 
              className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-xl py-3 px-4 dark:text-white"
              value={formData.icon}
              onChange={e => setFormData({...formData, icon: e.target.value})}
              placeholder="🚀 または https://..."
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold mb-1 dark:text-gray-300">説明</label>
          <textarea 
            required
            className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-xl py-3 px-4 dark:text-white h-24"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            placeholder="アプリの魅力を伝えましょう"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1 dark:text-gray-300">リンク (URL / GitHub)</label>
          <input 
            required
            type="url"
            className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-xl py-3 px-4 dark:text-white"
            value={formData.link}
            onChange={e => setFormData({...formData, link: e.target.value})}
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1 dark:text-gray-300">インストール手順 (1行ずつ)</label>
          <textarea 
            className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-xl py-3 px-4 dark:text-white h-24"
            value={formData.installSteps}
            onChange={e => setFormData({...formData, installSteps: e.target.value})}
            placeholder="例: ブラウザで開く&#10;ホーム画面に追加"
          />
        </div>
        <div className="flex gap-3 pt-4">
          <button 
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 py-4 rounded-2xl font-bold"
          >
            キャンセル
          </button>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-500/30 disabled:opacity-50"
          >
            {isSubmitting ? '送信中...' : '出品する'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmitForm;

import React, { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useAppsQuery } from '../hooks/useAppsQuery';
import { CATEGORIES, APP_CONFIG } from '../constants';
import Button from './ui/Button';
import Input from './ui/Input';

interface SubmitFormProps {
  onCancel: () => void;
  onSuccess: () => void;
  user: User | null;
}

const SubmitForm: React.FC<SubmitFormProps> = ({ onCancel, onSuccess, user }) => {
  const { submitApp, isSubmitting } = useAppsQuery();
  const [formData, setFormData] = useState({
    name: '',
    category: CATEGORIES.PWA,
    description: '',
    icon: APP_CONFIG.DEFAULT_ICON,
    link: '',
    installSteps: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const appToSubmit = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        icon: formData.icon,
        link: formData.link,
        developer_name: user?.email ? user.email.split('@')[0] : 'Unknown',
        install_steps: formData.installSteps.split('\n').filter(s => s.trim() !== '')
      };
      await submitApp(appToSubmit);
      onSuccess();
    } catch (err: any) {
      // Error is handled by useAppsQuery mutation
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-xl border dark:border-gray-800 animate-in fade-in zoom-in duration-300">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">アプリを出品する</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
          label="アプリ名"
          required
          value={formData.name}
          onChange={e => setFormData({...formData, name: e.target.value})}
          placeholder="例: お天気アプリ"
        />
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-1 dark:text-gray-300">カテゴリ</label>
            <select 
              className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-xl py-3 px-4 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option value={CATEGORIES.PWA}>{CATEGORIES.PWA}</option>
              <option value={CATEGORIES.TERMUX}>{CATEGORIES.TERMUX}</option>
            </select>
          </div>
          <Input 
            label="アイコン (絵文字/URL)"
            value={formData.icon}
            onChange={e => setFormData({...formData, icon: e.target.value})}
            placeholder="🚀 または https://..."
          />
        </div>

        <Input 
          label="説明"
          isTextArea
          required
          value={formData.description}
          onChange={e => setFormData({...formData, description: e.target.value})}
          placeholder="アプリの魅力を伝えましょう"
        />

        <Input 
          label="リンク (URL / GitHub)"
          required
          type="url"
          value={formData.link}
          onChange={e => setFormData({...formData, link: e.target.value})}
          placeholder="https://..."
        />

        <Input 
          label="インストール手順 (1行ずつ)"
          isTextArea
          value={formData.installSteps}
          onChange={e => setFormData({...formData, installSteps: e.target.value})}
          placeholder="例: ブラウザで開く&#10;ホーム画面に追加"
        />

        <div className="flex gap-3 pt-4">
          <Button 
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={onCancel}
          >
            キャンセル
          </Button>
          <Button 
            type="submit"
            className="flex-1"
            isLoading={isSubmitting}
          >
            出品する
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SubmitForm;

import React, { useState, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { Upload, X } from 'lucide-react';
import { useAppsQuery } from '../hooks/useAppsQuery';
import { uploadIcon } from '../lib/supabase';
import { CATEGORIES, APP_CONFIG } from '../constants';
import Button from './ui/Button';
import Input from './ui/Input';
import toast from 'react-hot-toast';

import { AppData } from '../types';

interface SubmitFormProps {
  onCancel: () => void;
  onSuccess: () => void;
  user: User | null;
  appToEdit?: AppData | null;
}

const SubmitForm: React.FC<SubmitFormProps> = ({ onCancel, onSuccess, user, appToEdit }) => {
  const { submitApp, updateApp, isSubmitting } = useAppsQuery();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: appToEdit?.name || '',
    category: appToEdit?.category || CATEGORIES.PWA,
    description: appToEdit?.description || '',
    icon: appToEdit?.icon || APP_CONFIG.DEFAULT_ICON,
    link: appToEdit?.link || '',
    installSteps: (appToEdit?.install_steps || appToEdit?.installSteps || []).join('\n')
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast.error('画像ファイルを選択してください');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('ファイルサイズは2MB以下にしてください');
      return;
    }

    setIsUploading(true);
    try {
      const publicUrl = await uploadIcon(file);
      setFormData({ ...formData, icon: publicUrl });
      toast.success('アイコンをアップロードしました');
    } catch (err: any) {
      console.error('Upload error:', err);
      toast.error('アップロードに失敗しました。ストレージの設定を確認してください。');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading) return;
    
    try {
      const appData = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        icon: formData.icon,
        link: formData.link,
        developer_name: user?.email ? user.email.split('@')[0] : 'Unknown',
        install_steps: formData.installSteps.split('\n').filter(s => s.trim() !== '')
      };

      if (appToEdit) {
        await updateApp({ id: appToEdit.id, app: appData });
      } else {
        await submitApp(appData);
      }
      onSuccess();
    } catch (err: any) {
      // Error is handled by useAppsQuery mutation
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-xl border dark:border-gray-800 animate-in fade-in zoom-in duration-300">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">
        {appToEdit ? 'アプリを編集する' : 'アプリを出品する'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
          label="アプリ名"
          required
          value={formData.name}
          onChange={e => setFormData({...formData, name: e.target.value})}
          placeholder="例: お天気アプリ"
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          
          <div>
            <label className="block text-sm font-bold mb-1 dark:text-gray-300">アイコン</label>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center overflow-hidden border dark:border-gray-700">
                {formData.icon.startsWith('http') ? (
                  <img src={formData.icon} alt="icon" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl">{formData.icon}</span>
                )}
              </div>
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
              <Button 
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                isLoading={isUploading}
                className="flex-1"
              >
                <Upload size={16} className="mr-2" />
                画像を選択
              </Button>
            </div>
          </div>
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
            isLoading={isSubmitting || isUploading}
          >
            {appToEdit ? '更新する' : '出品する'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SubmitForm;

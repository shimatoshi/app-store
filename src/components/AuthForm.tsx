import React, { useState } from 'react';
import { signIn, signUp } from '../lib/supabase';

interface AuthFormProps {
  onAuthSuccess: () => void;
  onCancel: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess, onCancel }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
        alert('確認メールを送信しました（設定によっては不要です）。ログインしてください。');
        setIsLogin(true);
        return;
      }
      onAuthSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-xl border dark:border-gray-800 animate-in fade-in zoom-in duration-300">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">{isLogin ? 'ログイン' : '新規登録'}</h2>
      {error && <p className="text-red-500 text-sm mb-4 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold mb-1 dark:text-gray-300">メールアドレス</label>
          <input 
            required
            type="email"
            className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-xl py-3 px-4 dark:text-white"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="example@mail.com"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1 dark:text-gray-300">パスワード</label>
          <input 
            required
            type="password"
            className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-xl py-3 px-4 dark:text-white"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-500/30 disabled:opacity-50 mt-4"
        >
          {loading ? '処理中...' : (isLogin ? 'ログイン' : '登録する')}
        </button>
        <button 
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="w-full text-blue-600 dark:text-blue-400 text-sm font-bold py-2"
        >
          {isLogin ? 'アカウントをお持ちでない方はこちら' : 'すでにアカウントをお持ちの方はこちら'}
        </button>
        <button 
          type="button"
          onClick={onCancel}
          className="w-full text-gray-500 text-sm font-medium py-2"
        >
          キャンセル
        </button>
      </form>
    </div>
  );
};

export default AuthForm;

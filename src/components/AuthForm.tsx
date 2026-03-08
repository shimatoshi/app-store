import React, { useState } from 'react';
import { signIn, signUp } from '../lib/supabase';
import Button from './ui/Button';
import Input from './ui/Input';
import toast from 'react-hot-toast';

interface AuthFormProps {
  onAuthSuccess: () => void;
  onCancel: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess, onCancel }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
        toast.success('ログインしました');
      } else {
        await signUp(email, password);
        toast.success('確認メールを送信しました');
        setIsLogin(true);
        return;
      }
      onAuthSuccess();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-xl border dark:border-gray-800 animate-in fade-in zoom-in duration-300">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">{isLogin ? 'ログイン' : '新規登録'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
          label="メールアドレス"
          required
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="example@mail.com"
        />
        <Input 
          label="パスワード"
          required
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
        />
        
        <Button 
          type="submit"
          className="w-full mt-4"
          isLoading={loading}
        >
          {isLogin ? 'ログイン' : '登録する'}
        </Button>

        <Button 
          type="button"
          variant="ghost"
          className="w-full text-sm"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'アカウントをお持ちでない方はこちら' : 'すでにアカウントをお持ちの方はこちら'}
        </Button>
        
        <Button 
          type="button"
          variant="secondary"
          className="w-full text-sm"
          onClick={onCancel}
        >
          キャンセル
        </Button>
      </form>
    </div>
  );
};

export default AuthForm;

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getApps, submitApp, supabase } from '../lib/supabase';
import { AppData } from '../types';
import toast from 'react-hot-toast';

export const useAppsQuery = () => {
  const queryClient = useQueryClient();

  const appsQuery = useQuery({
    queryKey: ['apps'],
    queryFn: getApps,
  });

  const submitMutation = useMutation({
    mutationFn: (newApp: Partial<AppData>) => submitApp(newApp),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apps'] });
      toast.success('アプリを出品しました！');
    },
    onError: (error: any) => {
      toast.error('出品に失敗しました: ' + error.message);
    },
  });

    const deleteMutation = useMutation({
      mutationFn: async (appId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('ログインが必要です');

        // まず削除対象が存在するか、自分のものか確認（デバッグ用も兼ねて）
        const { data: existingApp, error: fetchError } = await supabase
          .from('apps')
          .select('id, user_id')
          .eq('id', appId)
          .single();

        if (fetchError) throw new Error('アプリの確認に失敗しました');
        if (existingApp.user_id !== user.id) throw new Error('自分の投稿以外は削除できません');

        const { error } = await supabase
          .from('apps')
          .delete()
          .eq('id', appId);
        
        if (error) throw error;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['apps'] });
        toast.success('アプリを削除しました');
      },
      onError: (error: any) => {
        console.error('Delete error:', error);
        toast.error('削除に失敗しました: ' + (error.message || '不明なエラー'));
      },
    });

  return {
    apps: appsQuery.data || [],
    isLoading: appsQuery.isLoading,
    isError: appsQuery.isError,
    error: appsQuery.error,
    submitApp: submitMutation.mutateAsync,
    isSubmitting: submitMutation.isPending,
    deleteApp: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};

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
      const { error } = await supabase.from('apps').delete().eq('id', appId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apps'] });
      toast.success('アプリを削除しました');
    },
    onError: (error: any) => {
      toast.error('削除に失敗しました: ' + error.message);
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

import { createClient } from '@supabase/supabase-js'

// これらの値は Supabase のプロジェクト設定から取得します
// 現在はプレースホルダーですが、後でユーザーが自分のキーを入れられるようにします
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// デモ用に、Supabaseが未設定の場合は localStorage を使うフォールバック
export const getApps = async () => {
  if (supabaseUrl === 'https://your-project-url.supabase.co') {
    const localApps = localStorage.getItem('my_apps')
    return localApps ? JSON.parse(localApps) : []
  }
  
  const { data, error } = await supabase
    .from('apps')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const submitApp = async (appData) => {
  if (supabaseUrl === 'https://your-project-url.supabase.co') {
    const localApps = JSON.parse(localStorage.getItem('my_apps') || '[]')
    const newApp = { ...appData, id: Date.now().toString(), rating: 5.0, created_at: new Date().toISOString() }
    localStorage.setItem('my_apps', JSON.stringify([newApp, ...localApps]))
    return newApp
  }

  const { data, error } = await supabase
    .from('apps')
    .insert([appData])
    .select()
  
  if (error) throw error
  return data[0]
}

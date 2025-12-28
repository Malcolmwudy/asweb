/**
 * Supabase 客户端（浏览器端使用）
 * 对应 Android 的 SupabaseConfig.kt
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// 延迟初始化，避免构建时检查环境变量
let supabaseClient: SupabaseClient | null = null

function getSupabaseClient(): SupabaseClient {
  if (supabaseClient) {
    return supabaseClient
  }

  // 在 Next.js 中，NEXT_PUBLIC_ 前缀的环境变量会在构建时内联到客户端代码
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables')
    console.error('URL:', supabaseUrl ? 'present' : 'missing')
    console.error('Key:', supabaseAnonKey ? 'present' : 'missing')
    console.error('Please check Vercel environment variables configuration')
    throw new Error('配置错误：缺少 Supabase 配置。请联系管理员。')
  }

  supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  return supabaseClient
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return getSupabaseClient()[prop as keyof SupabaseClient]
  },
}) as SupabaseClient

// Edge Functions 基础 URL（对应 Android 的 EDGE_FUNCTIONS_BASE_URL）
// 使用函数而不是常量，避免构建时立即执行
export function getEdgeFunctionsBaseUrl(): string {
  // 在 Next.js 中，NEXT_PUBLIC_ 前缀的环境变量会在构建时内联到客户端代码
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    
  if (!supabaseUrl) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL')
    console.error('Please check Vercel environment variables configuration')
    throw new Error('配置错误：缺少 Supabase URL。请联系管理员。')
  }
  return `${supabaseUrl}/functions/v1/`
}


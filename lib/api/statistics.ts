/**
 * 统计相关 API
 * 对应 Android 的 StatisticsService
 */
import { getEdgeFunctionsBaseUrl } from '../supabase/client'

// 延迟获取，避免构建时立即检查
function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!key) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY. Please check your environment variables.')
  }
  return key
}

/**
 * 记录用户注册统计
 * 对应 Android 的 StatisticsService.recordRegistration
 */
export async function recordRegistration(
  email: string,
  channelCode: string = 'channelA'
): Promise<{ success: boolean; error?: string }> {
  try {
    const anonKey = getSupabaseAnonKey()
    const response = await fetch(`${getEdgeFunctionsBaseUrl()}statistics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${anonKey}`,
        'apikey': anonKey,
      },
      body: JSON.stringify({
        action: 'register',
        email,
        channel_code: channelCode,
      }),
    })

    if (response.ok) {
      return { success: true }
    } else {
      // 获取错误详情用于调试
      const errorText = await response.text().catch(() => '无法读取错误信息')
      console.warn('Record registration failed:', response.status, errorText)
      return {
        success: false,
        error: '记录注册统计失败',
      }
    }
  } catch (error: any) {
    // 静默处理错误，不影响主流程
    console.warn('Record registration error (不影响主流程):', error)
    return {
      success: false,
      error: error.message || '记录注册统计失败',
    }
  }
}

/**
 * 开始会话统计
 * 对应 Android 的 StatisticsService.startSession
 */
export async function startSession(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const anonKey = getSupabaseAnonKey()
    const response = await fetch(`${getEdgeFunctionsBaseUrl()}statistics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${anonKey}`,
        'apikey': anonKey,
      },
      body: JSON.stringify({
        action: 'start_session',
        email,
      }),
    })

    if (response.ok) {
      return { success: true }
    } else {
      // 获取错误详情用于调试
      const errorText = await response.text().catch(() => '无法读取错误信息')
      console.warn('Start session failed:', response.status, errorText)
      return {
        success: false,
        error: '开始会话统计失败',
      }
    }
  } catch (error: any) {
    // 静默处理错误，不影响主流程
    console.warn('Start session error (不影响主流程):', error)
    return {
      success: false,
      error: error.message || '开始会话统计失败',
    }
  }
}

/**
 * 结束会话统计
 * 对应 Android 的 StatisticsService.endSession
 */
export async function endSession(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const anonKey = getSupabaseAnonKey()
    const response = await fetch(`${getEdgeFunctionsBaseUrl()}statistics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${anonKey}`,
        'apikey': anonKey,
      },
      body: JSON.stringify({
        action: 'end_session',
        email,
      }),
    })

    if (response.ok) {
      return { success: true }
    } else {
      // 获取错误详情用于调试
      const errorText = await response.text().catch(() => '无法读取错误信息')
      console.warn('End session failed:', response.status, errorText)
      return {
        success: false,
        error: '结束会话统计失败',
      }
    }
  } catch (error: any) {
    // 静默处理错误，不影响主流程
    console.warn('End session error (不影响主流程):', error)
    return {
      success: false,
      error: error.message || '结束会话统计失败',
    }
  }
}


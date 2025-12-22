/**
 * 菜单 API
 * 从 Supabase 获取菜单项，支持渠道过滤
 * 对应 Android 的 MenuApiService
 */

import { getCurrentChannel, type ChannelCode } from '@/lib/channel'

// 延迟获取，避免构建时立即检查
function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL. Please check your environment variables.')
  }
  return url
}

function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!key) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY. Please check your environment variables.')
  }
  return key
}

// 延迟到使用时才获取，避免构建时立即执行
function getSupabaseConfig() {
  return {
    url: getSupabaseUrl(),
    key: getSupabaseAnonKey(),
  }
}

export interface MenuItem {
  id: string
  title: string
  url: string
  icon?: string
  order_index: number
  is_active: boolean
  is_channel_specific: boolean
  channel_code?: string
}

/**
 * 获取菜单项
 * @param channelCode 渠道代码，如果不提供则使用当前渠道
 * @returns 菜单项列表，包括：
 *   - is_channel_specific = false 的菜单项（不区分版本，所有渠道统一显示）
 *   - is_channel_specific = true 且 channel_code 匹配指定渠道的菜单项（区分版本，当前渠道专属）
 */
export async function getMenuItems(channelCode?: ChannelCode): Promise<{
  success: boolean
  data?: MenuItem[]
  error?: string
}> {
  try {
    const currentChannel = channelCode || getCurrentChannel()
    
    // 获取所有激活的菜单项
    const config = getSupabaseConfig()
    const url = `${config.url}/rest/v1/menu_items?select=*&is_active=eq.true&order=order_index.asc`
    const response = await fetch(url, {
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
      },
    })

    if (response.status === 200) {
      const allItems: MenuItem[] = await response.json()
      
      // 过滤菜单项：
      // 1. 显示不区分版本的菜单（is_channel_specific = false）
      // 2. 显示匹配当前渠道的菜单（is_channel_specific = true 且 channel_code 匹配）
      const filteredItems = allItems.filter((item) => {
        if (!item.is_channel_specific) {
          // 不区分版本，所有渠道都显示
          return true
        }
        // 区分版本，只显示匹配当前渠道的
        return item.channel_code === currentChannel
      })

      return {
        success: true,
        data: filteredItems,
      }
    } else {
      return {
        success: false,
        error: `获取菜单项失败，状态码: ${response.status}`,
      }
    }
  } catch (error: any) {
    console.error('Get menu items error:', error)
    return {
      success: false,
      error: error.message || '获取菜单项失败',
    }
  }
}


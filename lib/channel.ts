/**
 * 渠道管理工具
 * 支持通过 URL 参数或 localStorage 设置和获取渠道代码
 * 对应 Android 的 BuildConfig.CHANNEL_NAME
 */

export type ChannelCode = 'channelA' | 'channelB' | 'channelC'

const CHANNEL_STORAGE_KEY = 'axiselect_channel_code'
const DEFAULT_CHANNEL: ChannelCode = 'channelA'

/**
 * 从 URL 参数获取渠道代码
 * 支持格式：?axiselectweba、?axiselectwebb 或 ?axiselectwebc
 */
export function getChannelFromUrl(): ChannelCode | null {
  if (typeof window === 'undefined') return null
  
  const params = new URLSearchParams(window.location.search)
  
  // 检查新的参数格式
  if (params.has('axiselectweba')) {
    return 'channelA'
  }
  if (params.has('axiselectwebb')) {
    return 'channelB'
  }
  if (params.has('axiselectwebc')) {
    return 'channelC'
  }
  
  // 兼容旧的格式（向后兼容）
  const channel = params.get('channel')
  if (channel === 'channelA' || channel === 'channelB' || channel === 'channelC') {
    return channel as ChannelCode
  }
  
  return null
}

/**
 * 从 localStorage 获取渠道代码
 */
export function getChannelFromStorage(): ChannelCode | null {
  if (typeof window === 'undefined') return null
  
  const stored = localStorage.getItem(CHANNEL_STORAGE_KEY)
  if (stored === 'channelA' || stored === 'channelB' || stored === 'channelC') {
    return stored as ChannelCode
  }
  
  return null
}

/**
 * 保存渠道代码到 localStorage
 */
export function saveChannelToStorage(channel: ChannelCode): void {
  if (typeof window === 'undefined') return
  
  localStorage.setItem(CHANNEL_STORAGE_KEY, channel)
}

/**
 * 获取当前渠道代码
 * 优先级：URL 参数 > localStorage > 环境变量 > 默认值
 */
export function getCurrentChannel(): ChannelCode {
  // 1. 优先从 URL 参数获取
  const urlChannel = getChannelFromUrl()
  if (urlChannel) {
    // 保存到 localStorage，下次使用
    saveChannelToStorage(urlChannel)
    return urlChannel
  }
  
  // 2. 从 localStorage 获取
  const storedChannel = getChannelFromStorage()
  if (storedChannel) {
    return storedChannel
  }
  
  // 3. 从环境变量获取
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_CHANNEL_NAME) {
    const envChannel = process.env.NEXT_PUBLIC_CHANNEL_NAME
    if (envChannel === 'channelA' || envChannel === 'channelB' || envChannel === 'channelC') {
      saveChannelToStorage(envChannel as ChannelCode)
      return envChannel as ChannelCode
    }
  }
  
  // 4. 返回默认值
  return DEFAULT_CHANNEL
}

/**
 * 设置渠道代码
 * 会保存到 localStorage 并刷新页面（可选）
 */
export function setChannel(channel: ChannelCode, reload: boolean = false): void {
  saveChannelToStorage(channel)
  
  if (reload && typeof window !== 'undefined') {
    // 更新 URL 参数并刷新（使用新格式）
    const url = new URL(window.location.href)
    // 清除旧的参数
    url.searchParams.delete('channel')
    url.searchParams.delete('axiselectweba')
    url.searchParams.delete('axiselectwebb')
    url.searchParams.delete('axiselectwebc')
    // 设置新参数
    if (channel === 'channelA') {
      url.searchParams.set('axiselectweba', '')
    } else if (channel === 'channelB') {
      url.searchParams.set('axiselectwebb', '')
    } else if (channel === 'channelC') {
      url.searchParams.set('axiselectwebc', '')
    }
    window.location.href = url.toString()
  }
}

/**
 * 清除渠道代码
 */
export function clearChannel(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(CHANNEL_STORAGE_KEY)
}

/**
 * 获取版本号
 * 格式与 Android APP 一致：A1.1.3、B1.1.3 或 C1.1.3
 */
export function getVersionName(channel: ChannelCode): string {
  const versionNumber = '1.1.3' // 与 Android build.gradle.kts 中的 appVersionNumber 保持一致
  switch (channel) {
    case 'channelA':
      return `A${versionNumber}`
    case 'channelB':
      return `B${versionNumber}`
    case 'channelC':
      return `C${versionNumber}`
    default:
      return `A${versionNumber}`
  }
}


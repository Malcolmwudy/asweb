/**
 * 加入我们相关 API
 * 获取加入链接（对应 Android 的 BuildConfig.JOIN_URL）
 */

import { getCurrentChannel, type ChannelCode } from '@/lib/channel'

/**
 * 获取加入链接
 * 对应 Android 的 BuildConfig.JOIN_URL
 * @param channel 渠道代码，如果不提供则使用当前渠道
 */
export function getJoinUrl(channel?: ChannelCode): string {
  const channelCode = channel || getCurrentChannel()
  
  // 根据渠道代码返回对应的加入链接
  if (channelCode === 'channelA') {
    return 'https://click.connectforedge.com/cn/live-account-v1?promocode=8843040'
  } else if (channelCode === 'channelB') {
    return 'https://click.connectforedge.com/cn/live-account-v1?promocode=8853438'
  }
  
  // 默认返回 channelA 的链接
  return 'https://click.connectforedge.com/cn/live-account-v1?promocode=8843040'
}


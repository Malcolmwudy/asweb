/**
 * 版本管理工具
 * 获取当前版本信息，格式与 Android APP 一致
 */

import { getCurrentChannel, getVersionName, type ChannelCode } from './channel'

/**
 * 获取当前版本号
 * 格式：A1.1.3、B1.1.3 或 C1.1.3（与 Android APP 一致）
 * 根据当前渠道自动返回对应的版本号
 */
export function getCurrentVersionName(): string {
  const channel = getCurrentChannel()
  return getVersionName(channel)
}

/**
 * 获取版本号（指定渠道）
 */
export function getVersionNameForChannel(channel: ChannelCode): string {
  return getVersionName(channel)
}


'use client'

/**
 * 渠道选择页面
 * 允许用户选择不同的渠道（channelA、channelB 或 channelC）
 */
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  getCurrentChannel,
  setChannel,
  type ChannelCode,
} from '@/lib/channel'

export default function ChannelPage() {
  const router = useRouter()
  const [currentChannel, setCurrentChannelState] = useState<ChannelCode>('channelA')
  const [isChanging, setIsChanging] = useState(false)

  useEffect(() => {
    setCurrentChannelState(getCurrentChannel())
  }, [])

  const handleChannelChange = (channel: ChannelCode) => {
    if (channel === currentChannel) {
      return // 已经是当前渠道，无需切换
    }

    setIsChanging(true)
    setChannel(channel, true) // 设置渠道并刷新页面
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          选择版本
        </h1>

        <div className="space-y-4 mb-6">
          <div
            onClick={() => handleChannelChange('channelA')}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              currentChannel === 'channelA'
                ? 'border-red-600 bg-red-50'
                : 'border-gray-300 hover:border-red-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-gray-800">
                  版本 A
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  推广码: 8843040
                </p>
              </div>
              {currentChannel === 'channelA' && (
                <div className="text-red-600 text-xl">✓</div>
              )}
            </div>
          </div>

          <div
            onClick={() => handleChannelChange('channelB')}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              currentChannel === 'channelB'
                ? 'border-red-600 bg-red-50'
                : 'border-gray-300 hover:border-red-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-gray-800">
                  版本 B
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  推广码: 8853438
                </p>
              </div>
              {currentChannel === 'channelB' && (
                <div className="text-red-600 text-xl">✓</div>
              )}
            </div>
          </div>

          <div
            onClick={() => handleChannelChange('channelC')}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              currentChannel === 'channelC'
                ? 'border-red-600 bg-red-50'
                : 'border-gray-300 hover:border-red-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-gray-800">
                  版本 C
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  渠道 C
                </p>
              </div>
              {currentChannel === 'channelC' && (
                <div className="text-red-600 text-xl">✓</div>
              )}
            </div>
          </div>
        </div>

        {isChanging && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-2"></div>
            <p className="text-gray-600">正在切换版本...</p>
          </div>
        )}

        <div className="text-center text-sm text-gray-500 mt-6">
          <p className="mt-2">
            切换版本后，页面将自动刷新并加载对应版本的资源
          </p>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-red-600 hover:text-red-700 text-sm"
          >
            返回首页
          </button>
        </div>
      </div>
    </div>
  )
}


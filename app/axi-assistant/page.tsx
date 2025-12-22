'use client'

/**
 * Axi Assistant 页面
 * 显示菜单项，支持渠道过滤
 * 对应 Android 的 AxiAssistantScreen
 */
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getMenuItems, type MenuItem } from '@/lib/api/menu'
import { getCurrentChannel } from '@/lib/channel'

export default function AxiAssistantPage() {
  const router = useRouter()
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentChannel, setCurrentChannel] = useState(getCurrentChannel())

  useEffect(() => {
    loadMenuItems()
    
    // 监听渠道变化
    const updateChannel = () => {
      const channel = getCurrentChannel()
      setCurrentChannel(channel)
      loadMenuItems(channel)
    }
    
    window.addEventListener('storage', updateChannel)
    const interval = setInterval(() => {
      const channel = getCurrentChannel()
      if (channel !== currentChannel) {
        updateChannel()
      }
    }, 1000)
    
    return () => {
      window.removeEventListener('storage', updateChannel)
      clearInterval(interval)
    }
  }, [])

  const loadMenuItems = async (channel?: string) => {
    setIsLoading(true)
    setError(null)
    
    const result = await getMenuItems(channel as any)
    
    if (result.success && result.data) {
      setMenuItems(result.data)
    } else {
      setError(result.error || '加载菜单项失败')
    }
    
    setIsLoading(false)
  }

  const handleItemClick = (item: MenuItem) => {
    if (item.url) {
      // 在新窗口打开链接
      window.open(item.url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部导航栏 */}
      <header className="bg-red-600 text-white p-4 fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 px-3 py-2 bg-white/20 rounded-lg hover:bg-white/30 text-sm font-medium"
          >
            <span>←</span>
            <span>返回</span>
          </button>
          <h1 className="text-2xl font-bold">Axi助手</h1>
          <div className="w-20"></div> {/* 占位，保持居中 */}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 pt-16">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => loadMenuItems(currentChannel)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              重试
            </button>
          </div>
        ) : menuItems.length > 0 ? (
          <div className="space-y-3">
            {menuItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className="bg-white rounded-lg shadow-md p-4 flex items-center gap-3 cursor-pointer hover:shadow-lg transition-shadow"
              >
                {item.icon && (
                  <div className="text-2xl">{item.icon}</div>
                )}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{item.title}</h3>
                </div>
                <div className="text-red-600 text-xl">→</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
            暂无菜单项
          </div>
        )}

      </main>
    </div>
  )
}


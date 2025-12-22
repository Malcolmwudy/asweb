'use client'

/**
 * 联系支持页面
 * 对应 Android 的 ContactScreen
 */
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { getRiskWarning, type RiskWarning } from '@/lib/api/content'
import ProtectedRoute from '@/components/ProtectedRoute'
import { getCurrentVersionName } from '@/lib/version'

export default function ContactPage() {
  const [riskWarning, setRiskWarning] = useState<RiskWarning | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [versionName, setVersionName] = useState(getCurrentVersionName())

  useEffect(() => {
    setIsLoading(true)
    getRiskWarning().then((result) => {
      setIsLoading(false)
      if (result.success && result.data) {
        setRiskWarning(result.data)
      }
    })
  }, [])

  // 监听渠道变化，更新版本号
  // getCurrentVersionName() 内部会调用 getCurrentChannel() 获取当前渠道
  // 然后根据渠道返回对应的版本号（A1.1.2、B1.1.2 或 C1.1.2）
  useEffect(() => {
    const updateVersion = () => {
      setVersionName(getCurrentVersionName())
    }
    
    // 立即更新一次
    updateVersion()
    
    // 监听 localStorage 变化（跨标签页）
    window.addEventListener('storage', updateVersion)
    
    // 定期检查渠道变化（因为 storage 事件只在其他标签页触发）
    const interval = setInterval(updateVersion, 1000)
    
    return () => {
      window.removeEventListener('storage', updateVersion)
      clearInterval(interval)
    }
  }, [])

  const copyEmail = () => {
    const email = 'service.cn@axi.com'
    navigator.clipboard.writeText(email).then(() => {
      alert('邮箱地址已复制')
    })
  }

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">联系支持</h1>
        <div className="space-y-4">
          {/* 联系信息卡片 */}
          <div className="bg-white rounded-lg shadow-md p-6 relative">
            <div className="absolute top-4 left-4 bg-red-50 text-red-600 px-2 py-1 rounded text-sm font-medium">
              版本号 {versionName}
            </div>
            <div className="text-center pt-8">
              <div className="text-4xl mb-2">📧</div>
              <h2 className="text-xl font-bold mb-1">Axi Service Team</h2>
              <p className="text-gray-600 mb-4">支持团队</p>
              <div className="bg-gray-100 rounded-lg p-3 flex items-center justify-center gap-2">
                <span className="font-medium">service.cn@axi.com</span>
                <button
                  onClick={copyEmail}
                  className="text-red-600 hover:text-red-700"
                  title="复制邮箱"
                >
                  📋
                </button>
              </div>
            </div>
          </div>

          {/* 风险提示卡片 */}
          <div className="bg-white rounded-lg shadow-md p-4">
            {isLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
              </div>
            ) : riskWarning ? (
              <>
                <h3 className="font-bold mb-2">{riskWarning.title}</h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {riskWarning.content}
                </p>
              </>
            ) : (
              <p className="text-gray-500 text-center">
                请打开网络后再尝试
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
    </ProtectedRoute>
  )
}


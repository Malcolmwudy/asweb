'use client'

/**
 * 联系支持页面
 * 对应 Android 的 ContactScreen
 */
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { getSupportTeams, getMoreTips, type SupportTeam, type MoreTip } from '@/lib/api/content'
import ProtectedRoute from '@/components/ProtectedRoute'
import { getCurrentVersionName } from '@/lib/version'

export default function ContactPage() {
  const [supportTeams, setSupportTeams] = useState<SupportTeam[]>([])
  const [moreTips, setMoreTips] = useState<MoreTip[]>([])
  const [isLoadingSupportTeams, setIsLoadingSupportTeams] = useState(false)
  const [isLoadingMoreTips, setIsLoadingMoreTips] = useState(false)
  const [versionName, setVersionName] = useState(getCurrentVersionName())
  
  // 刷新键，用于强制刷新数据
  const [refreshKey, setRefreshKey] = useState(0)

  // 每次进入界面时自动刷新
  useEffect(() => {
    setRefreshKey((prev) => prev + 1)
  }, [])

  // 加载支持团队列表（每次进入界面时自动刷新）
  useEffect(() => {
    setIsLoadingSupportTeams(true)
    getSupportTeams().then((result) => {
      setIsLoadingSupportTeams(false)
      if (result.success && result.data) {
        setSupportTeams(result.data)
      } else {
        setSupportTeams([])
      }
    })
  }, [refreshKey])

  // 加载更多提示列表（每次进入界面时自动刷新）
  useEffect(() => {
    setIsLoadingMoreTips(true)
    getMoreTips().then((result) => {
      setIsLoadingMoreTips(false)
      if (result.success && result.data) {
        setMoreTips(result.data)
      } else {
        setMoreTips([])
      }
    })
  }, [refreshKey])

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

  const copyEmail = (email: string) => {
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
          {/* 版本号显示（顶部） */}
          <div className="bg-red-50 rounded-lg p-3">
            <p className="text-red-600 text-sm font-medium text-center">
              版本号 {versionName}
            </p>
          </div>

          {/* 显示所有支持团队（每个团队一个卡片） */}
          {isLoadingSupportTeams ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
              </div>
            </div>
          ) : supportTeams.length > 0 ? (
            supportTeams.map((team) => (
              <div key={team.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="text-center">
                  <div className="text-4xl mb-2">📧</div>
                  <h2 className="text-xl font-bold mb-1">{team.team_name_en}</h2>
                  <p className="text-gray-600 mb-4">{team.team_name_cn}</p>
                  <div className="bg-gray-100 rounded-lg p-3 flex items-center justify-center gap-2">
                    <span className="font-medium">{team.email}</span>
                    <button
                      onClick={() => copyEmail(team.email)}
                      className="text-red-600 hover:text-red-700"
                      title="复制邮箱"
                    >
                      📋
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-500 text-center">
                请打开网络后再尝试
              </p>
            </div>
          )}

          {/* 显示更多提示（包含风险提示和其他提示） */}
          {isLoadingMoreTips ? (
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
              </div>
            </div>
          ) : moreTips.length > 0 ? (
            moreTips.map((tip) => {
              const title = tip.title.trim()
              const content = tip.content.trim()
              
              // 确保标题和内容都不为空才显示
              if (title.length === 0 && content.length === 0) {
                return null
              }
              
              return (
                <div key={tip.id} className="bg-white rounded-lg shadow-md p-4">
                  {title.length > 0 && (
                    <h3 className="font-bold mb-2">{title}</h3>
                  )}
                  {content.length > 0 ? (
                    <p className="text-gray-700 whitespace-pre-line">
                      {content}
                    </p>
                  ) : (
                    <p className="text-gray-500 text-center">
                      暂无内容
                    </p>
                  )}
                </div>
              )
            })
          ) : null}
        </div>
      </main>
    </div>
    </ProtectedRoute>
  )
}


'use client'

/**
 * 全局顶部导航栏组件
 * 包含 "Axi Select" 标题和 "加入我们" 按钮
 * 在所有页面保持固定
 * 未注册时不显示"加入我们"按钮
 */
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { getJoinUrl } from '@/lib/api/join'
import { getCurrentChannel } from '@/lib/channel'
import { getRegisteredEmail, needsReVerification } from '@/lib/api/auth'

export default function Header() {
  const pathname = usePathname()
  const [joinUrl, setJoinUrl] = useState('')
  const [isRegistered, setIsRegistered] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    // 标记组件已挂载（客户端），避免 Hydration 错误
    setIsMounted(true)
    
    // 在 axi-assistant 页面不需要更新 joinUrl
    if (pathname === '/axi-assistant') {
      return
    }

    // 检查是否已注册
    const checkRegistration = () => {
      const registeredEmail = getRegisteredEmail()
      const needsReVerify = needsReVerification()
      setIsRegistered(!!registeredEmail && !needsReVerify)
    }

    checkRegistration()

    const channel = getCurrentChannel()
    setJoinUrl(getJoinUrl(channel))
    
    // 监听渠道变化和注册状态变化
    const updateJoinUrl = () => {
      const channel = getCurrentChannel()
      setJoinUrl(getJoinUrl(channel))
      checkRegistration()
    }
    
    window.addEventListener('storage', updateJoinUrl)
    const interval = setInterval(updateJoinUrl, 1000)
    
    return () => {
      window.removeEventListener('storage', updateJoinUrl)
      clearInterval(interval)
    }
  }, [pathname])

  // 在 axi-assistant 页面不显示此 header（它有自己的 header）
  if (pathname === '/axi-assistant') {
    return null
  }

  // 在服务器端或未挂载时，不渲染任何内容（避免 Hydration 错误）
  if (!isMounted) {
    return null
  }

  // 在首页时，需要检查用户是否已注册
  // 如果未注册，不显示 header（显示注册表单）
  // 如果已注册，显示 header（显示内容页面）
  if (pathname === '/') {
    // 如果未注册，不显示 header
    if (!isRegistered) {
      return null
    }
    // 如果已注册，显示 header（继续执行下面的 return）
  }

  return (
    <header className="bg-red-600 text-white p-4 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold">Axi Select</h1>
        {/* 只有已注册用户才显示"加入我们"按钮 */}
        {isRegistered && (
          <a
            href="/axi-assistant"
            className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 text-sm font-medium"
          >
            加入我们
          </a>
        )}
      </div>
    </header>
  )
}


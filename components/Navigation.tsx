'use client'

/**
 * 底部导航栏组件
 * 对应 Android 的 NavigationBar
 */
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { getRegisteredEmail, needsReVerification } from '@/lib/api/auth'

const navItems = [
  { path: '/', label: '首页', icon: '🏠' },
  { path: '/program', label: '计划介绍', icon: 'ℹ️' },
  { path: '/getting-started', label: '启动流程', icon: '▶️' },
  { path: '/rules', label: '违规说明', icon: '📋' },
  { path: '/faq', label: '常见问题', icon: '❓' },
  { path: '/contact', label: '联系支持', icon: '📧' },
]

export default function Navigation() {
  const pathname = usePathname()
  const [isRegistered, setIsRegistered] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // 标记组件已挂载（客户端），避免 Hydration 错误
    setIsMounted(true)
    
    // 检查注册状态
    const checkRegistration = () => {
      const registeredEmail = getRegisteredEmail()
      const needsReVerif = needsReVerification()
      setIsRegistered(!needsReVerif && !!registeredEmail)
    }

    checkRegistration()

    // 监听 localStorage 变化（当用户注册时）
    const handleStorageChange = () => {
      checkRegistration()
    }

    window.addEventListener('storage', handleStorageChange)
    
    // 定期检查（因为 storage 事件只在其他标签页触发）
    const interval = setInterval(checkRegistration, 1000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  // 在服务器端或未挂载时，不渲染任何内容（避免 Hydration 错误）
  if (!isMounted) {
    return null
  }

  // 如果未注册，不显示导航栏
  if (!isRegistered) {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="container mx-auto">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const isActive = pathname === item.path
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex flex-col items-center justify-center py-2 px-3 ${
                  isActive ? 'text-red-600' : 'text-gray-600'
                }`}
              >
                <span className="text-xl mb-1">{item.icon}</span>
                <span className="text-xs">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}


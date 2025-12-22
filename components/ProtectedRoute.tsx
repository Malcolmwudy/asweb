'use client'

/**
 * 路由保护组件
 * 对应 Android 的注册检查逻辑
 * 未注册时重定向到首页（注册页面）
 */
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getRegisteredEmail, needsReVerification } from '@/lib/api/auth'

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // 检查是否已注册
    const checkRegistration = () => {
      if (needsReVerification() || !getRegisteredEmail()) {
        // 未注册或需要重新验证，重定向到首页（注册页面）
        router.push('/')
        setIsAuthorized(false)
      } else {
        // 已注册，允许访问
        setIsAuthorized(true)
      }
      setIsChecking(false)
    }

    checkRegistration()
  }, [router])

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (!isAuthorized) {
    // 重定向中，不显示内容
    return null
  }

  return <>{children}</>
}


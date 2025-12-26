'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getRegisteredEmail, needsReVerification } from '@/lib/api/auth'

export default function PageWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [needsPadding, setNeedsPadding] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    // 标记组件已挂载（客户端），避免 Hydration 错误
    setIsMounted(true)
    
    // 计算 padding 状态的函数（只在客户端执行）
    const calculateNeedsPadding = () => {
      // axi-assistant 页面不需要 padding（它有自己的 header）
      if (pathname === '/axi-assistant') {
        return false
      }
      
      // 首页需要根据注册状态判断
      if (pathname === '/') {
        const registeredEmail = getRegisteredEmail()
        const needsReVerify = needsReVerification()
        const isRegistered = !!registeredEmail && !needsReVerify
        
        // 如果已注册，需要 padding（显示 Header）
        // 如果未注册，不需要 padding（显示注册表单）
        return isRegistered
      }
      
      // 其他页面都需要 padding（显示 Header）
      return true
    }
    
    // 初始化 padding 状态
    const newNeedsPadding = calculateNeedsPadding()
    setNeedsPadding(newNeedsPadding)
    
    // 监听注册状态变化（通过监听 storage 事件）
    const handleStorageChange = () => {
      const updatedNeedsPadding = calculateNeedsPadding()
      setNeedsPadding(updatedNeedsPadding)
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // 定期检查注册状态变化（因为 storage 事件只在其他标签页触发）
    const interval = setInterval(() => {
      const updatedNeedsPadding = calculateNeedsPadding()
      setNeedsPadding((prev) => {
        // 只在值真正变化时更新，避免不必要的重渲染
        if (updatedNeedsPadding !== prev) {
          return updatedNeedsPadding
        }
        return prev
      })
    }, 500) // 更频繁地检查，确保及时更新
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [pathname])
  
  // 在服务器端或未挂载时，默认不添加 padding（避免 Hydration 错误）
  // 客户端挂载后会自动更新
  return (
    <div className={isMounted && needsPadding ? 'pt-16' : ''}>
      {children}
    </div>
  )
}


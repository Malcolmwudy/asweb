'use client'

/**
 * 注册表单组件
 * 对应 Android 的 RegistrationScreen
 */
import { useState, useEffect } from 'react'
import {
  sendVerificationCode,
  verifyCode,
  saveRegistration,
  getRegisteredEmail,
  needsReVerification,
} from '@/lib/api/auth'
import { recordRegistration, startSession } from '@/lib/api/statistics'
import { getCurrentChannel } from '@/lib/channel'

export default function RegistrationForm({
  onSuccess,
}: {
  onSuccess: () => void
}) {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [countdown, setCountdown] = useState(0)

  // 检查是否已注册
  useEffect(() => {
    if (!needsReVerification() && getRegisteredEmail()) {
      const registeredEmail = getRegisteredEmail()
      if (registeredEmail) {
        // 开始会话统计（静默处理，不影响主流程）
        startSession(registeredEmail).catch((err) => {
          console.warn('开始会话统计失败（不影响主流程）:', err)
        })
      }
      onSuccess()
    }
  }, [onSuccess])

  // 倒计时
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // 应用关闭时结束会话
  useEffect(() => {
    return () => {
      const registeredEmail = getRegisteredEmail()
      if (registeredEmail) {
        // 注意：在浏览器中，页面关闭时可能无法可靠地发送请求
        // 可以考虑使用 navigator.sendBeacon 或 beforeunload 事件
      }
    }
  }, [])

  const handleSendCode = async () => {
    if (!email) {
      setError('请输入邮箱地址')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('请输入有效的邮箱地址')
      return
    }

    setIsLoading(true)
    setError('')
    setSuccessMessage('')

    const channelCode = getCurrentChannel()
    const result = await sendVerificationCode(email, channelCode)
    setIsLoading(false)

    if (result.success) {
      setSuccessMessage(
        result.data?.message ||
          '验证码已发送到您的邮箱，请查收。验证码有效期为10分钟，请及时输入。'
      )
      setCountdown(60)
    } else {
      setError(result.error || '发送验证码失败，请检查网络连接或稍后重试')
    }
  }

  const handleSubmit = async () => {
    if (!email) {
      setError('请输入邮箱地址')
      return
    }

    if (!code) {
      setError('验证码错误')
      return
    }

    if (code.length !== 6) {
      setError('验证码错误')
      return
    }

    setIsLoading(true)
    setError('')

    const result = await verifyCode(email, code)
    setIsLoading(false)

    if (result.success) {
      // 验证成功，保存注册信息
      saveRegistration(email)

      // 记录用户注册统计（静默处理，不影响主流程）
      const channelCode = getCurrentChannel()
      recordRegistration(email, channelCode).catch((err) => {
        console.warn('记录注册统计失败（不影响主流程）:', err)
      })

      // 开始会话统计（静默处理，不影响主流程）
      startSession(email).catch((err) => {
        console.warn('开始会话统计失败（不影响主流程）:', err)
      })

      onSuccess()
    } else {
      setError(result.error || '验证码错误')
    }
  }

  return (
    <div className="min-h-screen bg-red-600 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-white mb-4 text-center">
          考核助手
        </h1>
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          欢迎注册
        </h2>

        <div className="space-y-4">
          {/* 邮箱输入 */}
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError('')
            }}
            placeholder="邮箱"
            className="w-full px-4 py-3 rounded-lg border-2 border-white bg-transparent text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
            disabled={isLoading}
          />

          {/* 验证码输入和发送按钮 */}
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                setError('')
              }}
              placeholder="验证码"
              maxLength={6}
              className="flex-1 px-4 py-3 rounded-lg border-2 border-white bg-transparent text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
              disabled={isLoading}
            />
            <button
              onClick={handleSendCode}
              disabled={isLoading || countdown > 0}
              className="px-6 py-3 bg-white text-red-600 rounded-lg font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {countdown > 0 ? `${countdown}秒` : '获取验证码'}
            </button>
          </div>

          {/* 错误/成功消息 */}
          {error && <div className="text-red-200 text-sm">{error}</div>}
          {successMessage && (
            <div className="text-white/80 text-sm">{successMessage}</div>
          )}

          {/* 提交按钮 */}
          <button
            onClick={handleSubmit}
            disabled={isLoading || !email || code.length !== 6}
            className="w-full py-3 bg-white text-red-600 rounded-lg font-bold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                处理中...
              </>
            ) : (
              '提交'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}


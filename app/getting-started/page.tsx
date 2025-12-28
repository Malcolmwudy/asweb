'use client'

/**
 * 启动流程页面
 * 对应 Android 的 GettingStartedScreen
 */
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import {
  getGettingStartedSteps,
  type GettingStartedStep,
} from '@/lib/api/content'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function GettingStartedPage() {
  const [steps, setSteps] = useState<GettingStartedStep[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    getGettingStartedSteps().then((result) => {
      setIsLoading(false)
      if (result.success && result.data) {
        setSteps(result.data)
      }
    })
  }, [])

  const getIcon = (iconName: string | null) => {
    switch (iconName) {
      case 'Flag':
        return '🚩'
      case 'Star':
        return '⭐'
      case 'PlayCircle':
        return '▶️'
      case 'Warning':
        return '⚠️'
      default:
        return 'ℹ️'
    }
  }

  const parseLinks = (linksJson: string | null): Record<string, string> => {
    if (!linksJson) return {}
    try {
      return JSON.parse(linksJson)
    } catch {
      return {}
    }
  }

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">启动流程</h1>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        ) : steps.length > 0 ? (
          <div className="space-y-4">
            {steps.map((step) => {
              const links = parseLinks(step.links)
              const isWarning = step.icon_name === 'Warning'

              return (
                <div
                  key={step.id}
                  className="bg-white rounded-lg shadow-md p-4"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl">{getIcon(step.icon_name)}</span>
                    <h3
                      className={`text-lg font-bold flex-1 ${
                        isWarning ? 'text-red-600' : 'text-red-600'
                      }`}
                    >
                      {step.title}
                    </h3>
                  </div>
                  {Object.keys(links).length > 0 ? (
                    <div className="text-gray-700">
                      {step.detail.split(/(\s+)/).map((part, index) => {
                        const linkText = Object.keys(links).find((key) =>
                          part.includes(key)
                        )
                        if (linkText) {
                          return (
                            <a
                              key={index}
                              href={links[linkText]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-red-600 underline"
                            >
                              {linkText}
                            </a>
                          )
                        }
                        return <span key={index}>{part}</span>
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-700">{step.detail}</p>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-4 text-center text-gray-500">
            请打开网络后再尝试
          </div>
        )}
      </main>
    </div>
    </ProtectedRoute>
  )
}


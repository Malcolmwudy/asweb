'use client'

/**
 * 常见问题页面
 * 对应 Android 的 FaqScreen
 */
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import {
  getFaqItems,
  type FaqItem,
} from '@/lib/api/content'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function FaqPage() {
  const [faqItems, setFaqItems] = useState<FaqItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    getFaqItems().then((result) => {
      setIsLoading(false)
      if (result.success && result.data) {
        setFaqItems(result.data)
      }
    })
  }, [])

  const formatAnswer = (answer: string) => {
    const lines = answer.split('\n')
    return lines.map((line, index) => {
      const trimmedLine = line.trim()
      if (!trimmedLine) {
        return <br key={index} />
      }
      // 判断是否是要点
      const isBulletPoint =
        /^[\u4e00-\u9fa5]+\s*\([A-Za-z]+\)/.test(trimmedLine) ||
        /^第[一二三四五六七八九十]+次[\u4e00-\u9fa5]*：?/.test(trimmedLine) ||
        /^注意\d+：/.test(trimmedLine)

      if (isBulletPoint) {
        return (
          <div key={index} className="flex gap-2 mb-2">
            <span className="text-red-600 font-bold">•</span>
            <span className="flex-1">{trimmedLine}</span>
          </div>
        )
      }
      return (
        <p key={index} className="mb-2">
          {trimmedLine}
        </p>
      )
    })
  }

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">常见问题</h1>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        ) : faqItems.length > 0 ? (
          <div className="space-y-4">
            {faqItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-red-600 text-xl">❓</span>
                  <h3 className="text-lg font-bold text-red-600">
                    {item.question}
                  </h3>
                </div>
                <div className="text-gray-700">{formatAnswer(item.answer)}</div>
              </div>
            ))}
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


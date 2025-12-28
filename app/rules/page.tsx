'use client'

/**
 * 违规说明页面
 * 对应 Android 的 RulesScreen
 */
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import {
  getViolationRules,
  type ViolationRule,
} from '@/lib/api/content'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function RulesPage() {
  const [rules, setRules] = useState<ViolationRule[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    getViolationRules().then((result) => {
      setIsLoading(false)
      if (result.success && result.data) {
        setRules(result.data)
      }
    })
  }, [])

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">违规说明</h1>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        ) : rules.length > 0 ? (
          <div className="space-y-4">
            {rules.map((rule) => (
              <div key={rule.id} className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-bold text-red-600 mb-3">
                  {rule.title}
                </h3>
                <div className="border-t border-gray-200 pt-3 mb-3">
                  <h4 className="text-sm font-bold text-gray-600 mb-2">
                    如何定义：
                  </h4>
                  <p className="text-gray-700">{rule.definition}</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-red-600 mb-2">
                    处理结果：
                  </h4>
                  <p className="text-red-600">{rule.consequence}</p>
                </div>
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


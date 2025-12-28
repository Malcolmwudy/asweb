'use client'

/**
 * 计划介绍页面
 * 对应 Android 的 ProgramScreen
 */
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import {
  getProgramContent,
  type ProgramContent,
} from '@/lib/api/content'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function ProgramPage() {
  const router = useRouter()
  const [programContent, setProgramContent] = useState<ProgramContent[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    getProgramContent().then((result) => {
      setIsLoading(false)
      if (result.success && result.data) {
        setProgramContent(result.data)
      }
    })
  }, [])

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">计划介绍</h1>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        ) : programContent.length > 0 ? (
          <div className="space-y-4">
            {programContent.map((content) => (
              <div key={content.id}>
                {content.section_type === 'intro' && content.title && (
                  <div className="mb-4">
                    <h2 className="text-xl font-bold mb-2">{content.title}</h2>
                    {content.content && <p className="text-gray-700 whitespace-pre-line">{content.content}</p>}
                  </div>
                )}

                {content.section_type === 'how_to_join' && content.content && (
                  <div className="mb-4">
                    <h2 className="text-xl font-bold mb-2">{content.content}</h2>
                  </div>
                )}

                {content.section_type === 'stages_title' && (
                  <div className="mb-4">
                    {content.title && (
                      <h2 className="text-xl font-bold mb-2">{content.title}</h2>
                    )}
                    {content.content && (
                      <p className="text-red-600 font-bold mb-2">{content.content}</p>
                    )}
                  </div>
                )}

                {content.section_type === 'stage' && content.stage_name && (
                  <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                    <h3 className="text-lg font-bold text-red-600 mb-3">
                      {content.stage_name}
                    </h3>
                    <div className="space-y-2">
                      {content.min_equity && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">最低净值</span>
                          <span className="font-bold text-red-600">{content.min_equity}</span>
                        </div>
                      )}
                      {content.edge_score && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Edge分数</span>
                          <span className="font-bold text-red-600">{content.edge_score}</span>
                        </div>
                      )}
                      {content.max_multiplier && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">最大倍数</span>
                          <span className="font-bold text-red-600">{content.max_multiplier}</span>
                        </div>
                      )}
                      {content.max_capital && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">最大资金</span>
                          <span className="font-bold text-red-600">{content.max_capital}</span>
                        </div>
                      )}
                      {content.profit_share && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">你的利润分成</span>
                          <span className="font-bold text-red-600">{content.profit_share}</span>
                        </div>
                      )}
                      {content.profit_target && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">利润目标</span>
                          <span className="font-bold text-red-600">{content.profit_target}</span>
                        </div>
                      )}
                      {content.stage_duration && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">阶段时长</span>
                          <span className="font-bold text-red-600">{content.stage_duration}</span>
                        </div>
                      )}
                      {content.trades_per_stage && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">每阶段交易数</span>
                          <span className="font-bold text-red-600">{content.trades_per_stage}</span>
                        </div>
                      )}
                      {content.leverage && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">杠杆</span>
                          <span className="font-bold text-red-600">{content.leverage}</span>
                        </div>
                      )}
                      {content.max_loss && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">最大亏损</span>
                          <span className="font-bold text-red-600">{content.max_loss}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {content.section_type === 'keyword_title' && content.title && (
                  <div className="mb-4">
                    <h2 className="text-xl font-bold mb-3">{content.title}</h2>
                  </div>
                )}

                {content.section_type === 'keyword' && content.keyword && (
                  <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                    <h3 className="text-lg font-bold text-red-600 mb-2">
                      {content.keyword}：
                    </h3>
                    <p className="text-gray-700 mb-2">{content.definition}</p>
                    {content.link_text && content.link_target && (
                      <div className="mt-2">
                        {content.link_target === 'FAQ' ? (
                          <button
                            onClick={() => router.push('/faq')}
                            className="text-red-600 hover:text-red-700 underline"
                          >
                            {content.link_text}
                          </button>
                        ) : (
                          <a
                            href={content.link_target}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-600 hover:text-red-700 underline"
                          >
                            {content.link_text}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {content.section_type === 'notice' && content.content && (
                  <div className="bg-gray-100 rounded-lg shadow-md p-4 mb-4">
                    {content.title && (
                      <h3 className="text-lg font-bold text-red-600 mb-2">
                        {content.title}
                      </h3>
                    )}
                    <p className="text-gray-700 whitespace-pre-line">{content.content}</p>
                  </div>
                )}
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


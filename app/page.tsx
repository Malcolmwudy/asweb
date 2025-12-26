'use client'

/**
 * 首页
 * 对应 Android 的 WelcomeScreen
 */
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import RegistrationForm from '@/components/RegistrationForm'
import {
  getHighlights,
  getCaseStudies,
  getFinanceLiveStreams,
  type Highlight,
  type CaseStudy,
  type FinanceLiveStream,
} from '@/lib/api/content'
import VideoPlayer from '@/components/VideoPlayer'
import LiveStreamPlayer from '@/components/LiveStreamPlayer'
import { getRegisteredEmail, needsReVerification } from '@/lib/api/auth'
import { getJoinUrl } from '@/lib/api/join'
import { getCurrentChannel } from '@/lib/channel'

export default function Home() {
  const [showRegistration, setShowRegistration] = useState(true)
  const [isChecking, setIsChecking] = useState(true)
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([])
  const [financeLiveStreams, setFinanceLiveStreams] = useState<
    FinanceLiveStream[]
  >([])
  const [isLoadingHighlights, setIsLoadingHighlights] = useState(false)
  const [isLoadingCaseStudies, setIsLoadingCaseStudies] = useState(false)
  const [isLoadingFinanceStreams, setIsLoadingFinanceStreams] = useState(false)
  const [showVideoPlayer, setShowVideoPlayer] = useState(false)
  const [currentVideoUrl, setCurrentVideoUrl] = useState('')
  const [showLiveStreamPlayer, setShowLiveStreamPlayer] = useState(false)
  const [currentLiveStreamUrl, setCurrentLiveStreamUrl] = useState('')
  const [currentLiveStreamName, setCurrentLiveStreamName] = useState('')
  const [showMoreInfo, setShowMoreInfo] = useState(false)
  // 使用默认值初始化，避免服务器端和客户端不一致
  const [currentChannel, setCurrentChannel] = useState<'channelA' | 'channelB' | 'channelC'>('channelA')
  const [joinUrl, setJoinUrl] = useState('')

  // 检查是否需要注册
  useEffect(() => {
    const checkRegistration = () => {
      const registeredEmail = getRegisteredEmail()
      
      if (needsReVerification() || !registeredEmail) {
        // 未注册或需要重新验证，显示注册页面
        setShowRegistration(true)
      } else {
        // 已注册，显示首页内容
        setShowRegistration(false)
      }
      setIsChecking(false)
    }

    checkRegistration()
    
    // 监听渠道变化（只在客户端执行）
    const updateChannel = () => {
      const channel = getCurrentChannel()
      setCurrentChannel(channel)
      setJoinUrl(getJoinUrl(channel))
    }
    
    updateChannel()
    
    // 监听 storage 变化（跨标签页同步）
    window.addEventListener('storage', updateChannel)
    
    // 定期检查渠道变化（URL 参数变化）
    const interval = setInterval(updateChannel, 1000)
    
    return () => {
      window.removeEventListener('storage', updateChannel)
      clearInterval(interval)
    }
  }, [])

  // 加载核心亮点
  useEffect(() => {
    if (!showRegistration) {
      setIsLoadingHighlights(true)
      getHighlights().then((result) => {
        setIsLoadingHighlights(false)
        if (result.success && result.data) {
          setHighlights(result.data)
        }
      })
    }
  }, [showRegistration])

  // 加载案例分享
  useEffect(() => {
    if (!showRegistration) {
      setIsLoadingCaseStudies(true)
      getCaseStudies().then((result) => {
        setIsLoadingCaseStudies(false)
        if (result.success && result.data) {
          setCaseStudies(result.data)
        }
      })
    }
  }, [showRegistration])

  // 加载财经直播
  useEffect(() => {
    if (!showRegistration) {
      setIsLoadingFinanceStreams(true)
      getFinanceLiveStreams().then((result) => {
        setIsLoadingFinanceStreams(false)
        if (result.success && result.data) {
          setFinanceLiveStreams(result.data)
        }
      })
    }
  }, [showRegistration])

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (showRegistration) {
    return (
      <RegistrationForm
        onSuccess={() => setShowRegistration(false)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 pt-8 pb-8">
        {/* 主卡片 */}
        <div className="bg-red-600 text-white rounded-lg shadow-md p-6 mb-6 mt-4">
          <h2 className="text-2xl font-bold mb-2">Axi Select 计划</h2>
          <p className="text-white/90 mb-4">
            最高百万美元资金分配 · 免费加入 · 利润分成
          </p>
          <div className="flex gap-3">
            <a
              href="/axi-assistant"
              className="px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-gray-100 font-medium"
            >
              立即加入
            </a>
            <button
              onClick={() => setShowMoreInfo(!showMoreInfo)}
              className="px-4 py-2 border-2 border-white text-white rounded-lg hover:bg-white/10 font-medium"
            >
              了解更多
            </button>
          </div>
        </div>

        {/* 了解更多卡片 */}
        {showMoreInfo && (
          <div className="bg-white rounded-lg shadow-md p-5 mb-6">
            <h3 className="text-xl font-bold mb-3">了解更多</h3>
            <p className="text-gray-700 mb-2">请发送邮件到官方专员邮箱：</p>
            <p className="text-lg font-bold text-red-600 mb-2">
              malcolm.liu@axi.com
            </p>
            <p className="text-gray-700">索要微信号添加好友</p>
          </div>
        )}

        {/* 核心亮点 */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">核心亮点</h3>
          {isLoadingHighlights ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          ) : highlights.length > 0 ? (
            <div className="space-y-3">
              {highlights.map((highlight) => (
                <div
                  key={highlight.id}
                  className="bg-white rounded-lg shadow-md p-4 flex items-start gap-3"
                >
                  <div className="text-red-600 text-2xl">⭐</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-red-600 mb-1">
                      {highlight.title}
                    </h4>
                    <p className="text-gray-600 text-sm">{highlight.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-4 text-center text-gray-500">
              请打开网络后再尝试
            </div>
          )}
        </div>

        {/* 案例分享 */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">案例分享</h3>
          {isLoadingCaseStudies ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          ) : caseStudies.length > 0 ? (
            <div className="space-y-3">
              {caseStudies.map((caseStudy) => (
                <div
                  key={caseStudy.id}
                  onClick={() => {
                    if (caseStudy.video_url) {
                      setCurrentVideoUrl(caseStudy.video_url)
                      setShowVideoPlayer(true)
                    }
                  }}
                  className="bg-white rounded-lg shadow-md p-4 flex items-center gap-3 cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="text-red-600 text-2xl">📹</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-red-600">
                      {caseStudy.name || '未命名案例'}
                    </h4>
                  </div>
                  <div className="text-red-600 text-2xl">▶</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-4 text-center text-gray-500">
              暂无案例分享
            </div>
          )}
        </div>

        {/* 财经直播 */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">财经直播</h3>
          {isLoadingFinanceStreams ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          ) : financeLiveStreams.length > 0 ? (
            <div className="space-y-3">
              {financeLiveStreams.map((stream) => (
                <div
                  key={stream.id}
                  onClick={() => {
                    if (stream.stream_url) {
                      setCurrentLiveStreamUrl(stream.stream_url)
                      setCurrentLiveStreamName(stream.name || '未命名直播')
                      setShowLiveStreamPlayer(true)
                    }
                  }}
                  className="bg-white rounded-lg shadow-md p-4 flex items-center gap-3 cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="text-red-600 text-2xl">📺</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-red-600">
                      {stream.name || '未命名直播'}
                    </h4>
                  </div>
                  <div className="text-red-600 text-2xl">▶</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-4 text-center text-gray-500">
              暂无财经直播
            </div>
          )}
        </div>
      </main>

      {/* 视频播放器对话框 */}
      {showVideoPlayer && currentVideoUrl && (
        <VideoPlayer
          videoUrl={currentVideoUrl}
          onClose={() => {
            setShowVideoPlayer(false)
            setCurrentVideoUrl('')
          }}
        />
      )}

      {/* 直播流播放器对话框 */}
      {showLiveStreamPlayer && currentLiveStreamUrl && (
        <LiveStreamPlayer
          streamUrl={currentLiveStreamUrl}
          streamName={currentLiveStreamName}
          onClose={() => {
            setShowLiveStreamPlayer(false)
            setCurrentLiveStreamUrl('')
            setCurrentLiveStreamName('')
          }}
        />
      )}
    </div>
  )
}


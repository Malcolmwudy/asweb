'use client'

/**
 * 直播流播放器组件
 * 对应 Android 的 LiveStreamPlayer
 */
import { useEffect, useRef } from 'react'
import videojs from 'video.js'
import Hls from 'hls.js'
import 'video.js/dist/video-js.css'

interface LiveStreamPlayerProps {
  streamUrl: string
  streamName: string
  onClose: () => void
}

export default function LiveStreamPlayer({
  streamUrl,
  streamName,
  onClose,
}: LiveStreamPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const playerRef = useRef<any>(null)
  const hlsRef = useRef<Hls | null>(null)

  useEffect(() => {
    if (!videoRef.current) return

    // 初始化 video.js 播放器
    if (!playerRef.current) {
      playerRef.current = videojs(videoRef.current, {
        controls: true,
        responsive: true,
        fluid: true,
        liveui: true,
      })
    }

    // 检查是否支持 HLS
    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      })
      hlsRef.current = hls

      hls.loadSource(streamUrl)
      hls.attachMedia(videoRef.current)

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (videoRef.current) {
          videoRef.current.play().catch((error) => {
            console.error('播放失败:', error)
          })
        }
      })

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS 错误:', data)
      })
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari 原生支持 HLS
      videoRef.current.src = streamUrl
      videoRef.current.play().catch((error) => {
        console.error('播放失败:', error)
      })
    } else {
      console.error('浏览器不支持 HLS 播放')
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
      if (playerRef.current) {
        playerRef.current.dispose()
        playerRef.current = null
      }
    }
  }, [streamUrl])

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl relative">
        <div className="absolute -top-10 left-0 right-0 flex justify-between items-center">
          <h3 className="text-white text-lg font-medium">{streamName}</h3>
          <button
            onClick={onClose}
            className="text-white text-2xl hover:text-gray-300"
          >
            ✕ 关闭
          </button>
        </div>
        <video
          ref={videoRef}
          className="video-js vjs-big-play-centered"
          playsInline
        />
      </div>
    </div>
  )
}


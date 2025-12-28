'use client'

/**
 * 视频播放器组件
 * 对应 Android 的 VideoPlayer
 */
import { useEffect, useRef, useState } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

interface VideoPlayerProps {
  videoUrl: string
  onClose: () => void
}

export default function VideoPlayer({ videoUrl, onClose }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const playerRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  // 初始化播放器（只执行一次）
  useEffect(() => {
    if (!videoRef.current || playerRef.current) return

    // 确保 DOM 完全挂载
    setIsMounted(true)
    
    // 延迟初始化，确保 DOM 完全准备好
    const initTimer = setTimeout(() => {
      if (!videoRef.current) return

      try {
        playerRef.current = videojs(videoRef.current, {
          controls: true,
          responsive: true,
          fluid: true,
          playbackRates: [0.5, 1, 1.5, 2],
          preload: 'auto',
          autoplay: true, // 自动播放（尝试有声音）
          muted: false, // 不静音
          html5: {
            vhs: {
              overrideNative: true,
            },
            nativeVideoTracks: false,
            nativeAudioTracks: false,
            nativeTextTracks: false,
          },
        })

        // 监听播放器事件
        playerRef.current.on('loadstart', () => {
          setIsLoading(true)
          setError(null)
        })

        playerRef.current.on('loadedmetadata', () => {
          setIsLoading(false)
          setError(null)
        })

        playerRef.current.on('loadeddata', () => {
          setIsLoading(false)
          setError(null)
        })

        playerRef.current.on('canplay', () => {
          setIsLoading(false)
          setError(null)
        })

        playerRef.current.on('canplaythrough', () => {
          setIsLoading(false)
          setError(null)
          // 尝试自动播放（有声音）
          if (playerRef.current && !playerRef.current.paused()) {
            // 已经在播放，不需要操作
            return
          }
          // 确保不静音
          if (playerRef.current) {
            playerRef.current.muted(false)
          }
          playerRef.current?.play().catch((err: any) => {
            console.log('有声音自动播放被阻止，降级为静音播放:', err)
            // 如果有声音自动播放失败，降级为静音播放
            if (playerRef.current) {
              playerRef.current.muted(true)
              playerRef.current.play().catch((err2: any) => {
                console.log('静音自动播放也被阻止，用户需要手动播放:', err2)
                // 如果还是失败，让用户手动播放
                playerRef.current.muted(false) // 恢复声音，让用户手动播放时有声音
              })
            }
          })
        })

        playerRef.current.on('error', () => {
          setIsLoading(false)
          const error = playerRef.current?.error()
          console.error('Video player error:', error)
          if (error) {
            if (error.code === 4) {
              setError('视频格式不支持或文件损坏')
            } else if (error.code === 2) {
              setError('网络错误，请检查网络连接')
            } else if (error.code === 3) {
              setError('视频解码失败')
            } else {
              setError('视频加载失败，请检查网络连接或稍后重试')
            }
          } else {
            setError('视频加载失败，请检查网络连接或稍后重试')
          }
        })

        // 设置视频源
        if (videoUrl) {
          playerRef.current.src({
            src: videoUrl,
            type: 'video/mp4',
            crossOrigin: 'anonymous',
          })
          playerRef.current.load()
          // 确保不静音
          playerRef.current.muted(false)
          // 尝试立即播放（有声音）
          playerRef.current.ready(() => {
            playerRef.current?.play().catch((err: any) => {
              console.log('初始有声音自动播放被阻止，降级为静音:', err)
              // 降级为静音播放
              if (playerRef.current) {
                playerRef.current.muted(true)
                playerRef.current.play().catch((err2: any) => {
                  console.log('静音自动播放也被阻止:', err2)
                  playerRef.current.muted(false) // 恢复声音
                })
              }
            })
          })
        }
      } catch (err) {
        console.error('Failed to initialize video player:', err)
        setError('视频播放器初始化失败')
      }
    }, 100)

    return () => {
      clearTimeout(initTimer)
    }
  }, []) // 只在组件挂载时执行一次

  // 当 videoUrl 改变时更新视频源
  useEffect(() => {
    if (playerRef.current && videoUrl && isMounted) {
      setIsLoading(true)
      setError(null)
      
      // 使用 setTimeout 确保播放器已完全初始化
      const updateTimer = setTimeout(() => {
        if (playerRef.current) {
          try {
            playerRef.current.src({
              src: videoUrl,
              type: 'video/mp4',
              crossOrigin: 'anonymous',
            })
            playerRef.current.load()
            // 确保不静音
            playerRef.current.muted(false)
            // 视频加载后自动播放（有声音）
            playerRef.current.ready(() => {
              playerRef.current?.play().catch((err: any) => {
                console.log('视频源更新后有声音自动播放被阻止，降级为静音:', err)
                // 如果有声音自动播放失败，降级为静音播放
                if (playerRef.current) {
                  playerRef.current.muted(true)
                  playerRef.current.play().catch((err2: any) => {
                    console.log('静音自动播放也被阻止:', err2)
                    playerRef.current.muted(false) // 恢复声音
                  })
                }
              })
            })
          } catch (err) {
            console.error('Failed to update video source:', err)
            setError('视频源更新失败')
          }
        }
      }, 200)

      return () => clearTimeout(updateTimer)
    }
  }, [videoUrl, isMounted])

  // 清理
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.dispose()
        } catch (err) {
          console.error('Error disposing video player:', err)
        }
        playerRef.current = null
      }
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl relative" ref={containerRef}>
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white text-2xl hover:text-gray-300 z-10"
        >
          ✕ 关闭
        </button>
        <div data-vjs-player>
          <video
            ref={videoRef}
            className="video-js vjs-big-play-centered"
            playsInline
            crossOrigin="anonymous"
            preload="auto"
          >
            <p className="vjs-no-js">
              您的浏览器不支持视频播放。
              <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                点击这里下载视频
              </a>
            </p>
          </video>
        </div>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>加载中...</p>
            </div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-white text-center p-4">
              <p className="mb-4">{error}</p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                关闭
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


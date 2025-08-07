"use client"

import { useEffect, useRef, useState } from 'react'
import { VIDEO_URLS, VideoKey } from '@/lib/video-config'

interface OptimizedVideoProps {
  videoKey: VideoKey  // Use video key instead of src
  className?: string
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  playsInline?: boolean
  preload?: 'none' | 'metadata' | 'auto'
  priority?: boolean
  onLoadStart?: () => void
  onCanPlay?: () => void
  onError?: () => void
}

export default function OptimizedVideo({
  videoKey,  // Use videoKey instead of src
  className = '',
  autoPlay = true,
  muted = true,
  loop = true,
  playsInline = true,
  preload = 'metadata',  // Default to metadata for GitHub hosting
  priority = false,
  onLoadStart,
  onCanPlay,
  onError,
}: OptimizedVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  // Get GitHub URL from videoKey
  const src = VIDEO_URLS[videoKey]

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Optimize video loading
    video.setAttribute('webkit-playsinline', 'true')
    video.setAttribute('x-webkit-airplay', 'allow')
    
    // Force hardware acceleration
    video.style.transform = 'translateZ(0)'
    video.style.willChange = 'transform'
    video.style.backfaceVisibility = 'hidden'

    // Preload hint for priority videos
    if (priority && preload === 'auto') {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'video'
      link.href = src
      document.head.appendChild(link)
    }

    const handleLoadStart = () => {
      onLoadStart?.()
    }

    const handleCanPlay = () => {
      setIsLoaded(true)
      onCanPlay?.()
      
      // Ensure smooth playback
      if (autoPlay && video.paused) {
        video.play().catch(console.warn)
      }
    }

    const handleError = () => {
      setHasError(true)
      onError?.()
      console.warn(`S3 video failed to load: ${videoKey} (${src})`)
    }

    const handleLoadedData = () => {
      // Optimize for mobile
      if (window.innerWidth < 768) {
        video.playbackRate = 1
        video.currentTime = 0
      }
    }

    video.addEventListener('loadstart', handleLoadStart)
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('error', handleError)
    video.addEventListener('loadeddata', handleLoadedData)

    return () => {
      video.removeEventListener('loadstart', handleLoadStart)
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('error', handleError)
      video.removeEventListener('loadeddata', handleLoadedData)
    }
  }, [src, videoKey, autoPlay, priority, preload, onLoadStart, onCanPlay, onError])

  if (hasError) {
    return (
      <div className={`bg-black/50 flex items-center justify-center ${className}`}>
        <span className="text-white/50 text-sm">S3 video unavailable: {videoKey}</span>
      </div>
    )
  }

  return (
    <video
      ref={videoRef}
      className={`s3-video ${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      playsInline={playsInline}
      preload={preload}
      crossOrigin="anonymous"
    >
      <source src={src} type="video/mp4" />
      S3 video not supported in your browser.
    </video>
  )
}

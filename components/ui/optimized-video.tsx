"use client"

import { useEffect, useRef, useState } from 'react'

interface OptimizedVideoProps {
  src: string
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
  src,
  className = '',
  autoPlay = true,
  muted = true,
  loop = true,
  playsInline = true,
  preload = 'auto',
  priority = false,
  onLoadStart,
  onCanPlay,
  onError,
}: OptimizedVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

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
      console.warn(`Video failed to load: ${src}`)
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
  }, [src, autoPlay, priority, preload, onLoadStart, onCanPlay, onError])

  if (hasError) {
    return (
      <div className={`bg-black/50 flex items-center justify-center ${className}`}>
        <span className="text-white/50 text-sm">Video unavailable</span>
      </div>
    )
  }

  return (
    <video
      ref={videoRef}
      className={`optimized-video ${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      playsInline={playsInline}
      preload={preload}
      crossOrigin="anonymous"
    >
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  )
}

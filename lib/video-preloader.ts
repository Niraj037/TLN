"use client"

// Video preloading service for optimized loading
class VideoPreloader {
  private static instance: VideoPreloader
  private preloadedVideos: Map<string, HTMLVideoElement> = new Map()
  private loadingPromises: Map<string, Promise<HTMLVideoElement>> = new Map()
  private observers: Map<string, IntersectionObserver> = new Map()

  static getInstance(): VideoPreloader {
    if (!VideoPreloader.instance) {
      VideoPreloader.instance = new VideoPreloader()
    }
    return VideoPreloader.instance
  }

  // Preload critical videos during app initialization
  async preloadCriticalVideos(videoSources: string[]): Promise<void> {
    const criticalVideos = [
      '/vids/drumkit-optimized-v2.mp4', // Hero video - highest priority
      '/vids/drumcym-optimized.mp4',    // First story video
    ]

    const videosToPreload = videoSources.length ? videoSources : criticalVideos

    try {
      await Promise.allSettled(
        videosToPreload.map(src => this.preloadVideo(src, true))
      )
      console.log('Critical videos preloaded successfully')
    } catch (error) {
      console.warn('Some critical videos failed to preload:', error)
    }
  }

  // Preload individual video with caching
  async preloadVideo(src: string, priority = false): Promise<HTMLVideoElement> {
    if (this.preloadedVideos.has(src)) {
      return this.preloadedVideos.get(src)!
    }

    if (this.loadingPromises.has(src)) {
      return this.loadingPromises.get(src)!
    }

    const loadPromise = new Promise<HTMLVideoElement>((resolve, reject) => {
      const video = document.createElement('video')
      
      // Optimize video element
      video.preload = priority ? 'auto' : 'metadata'
      video.muted = true
      video.playsInline = true
      video.crossOrigin = 'anonymous'
      
      // Performance optimizations
      video.style.transform = 'translateZ(0)'
      video.style.willChange = 'transform'
      video.style.backfaceVisibility = 'hidden'
      
      // Mobile optimizations
      if (window.innerWidth < 768) {
        video.preload = 'metadata' // Conserve bandwidth on mobile
      }

      let resolved = false

      const onCanPlay = () => {
        if (!resolved) {
          resolved = true
          this.preloadedVideos.set(src, video)
          resolve(video)
          cleanup()
        }
      }

      const onError = () => {
        if (!resolved) {
          resolved = true
          reject(new Error(`Failed to preload video: ${src}`))
          cleanup()
        }
      }

      const cleanup = () => {
        video.removeEventListener('canplay', onCanPlay)
        video.removeEventListener('error', onError)
        this.loadingPromises.delete(src)
      }

      video.addEventListener('canplay', onCanPlay)
      video.addEventListener('error', onError)

      video.src = src
      video.load()

      // Timeout for slow connections
      setTimeout(() => {
        if (!resolved) {
          console.warn(`Video preload timeout: ${src}`)
          onError()
        }
      }, priority ? 5000 : 3000)
    })

    this.loadingPromises.set(src, loadPromise)
    return loadPromise
  }

  // Get preloaded video or create new one
  getVideo(src: string): HTMLVideoElement | null {
    return this.preloadedVideos.get(src) || null
  }

  // Lazy load videos based on viewport intersection
  setupLazyLoading(videoElement: HTMLVideoElement, src: string): void {
    if (this.observers.has(src)) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
            this.preloadVideo(src).then(() => {
              console.log(`Lazy loaded: ${src}`)
            }).catch(console.warn)
            
            observer.unobserve(videoElement)
            this.observers.delete(src)
          }
        })
      },
      {
        rootMargin: '50px',
        threshold: [0.1, 0.25, 0.5]
      }
    )

    observer.observe(videoElement)
    this.observers.set(src, observer)
  }

  // Prefetch next videos based on scroll position
  prefetchUpcoming(currentVideoIndex: number, allVideoSources: string[]): void {
    const prefetchCount = window.innerWidth < 768 ? 1 : 2
    const startIndex = currentVideoIndex + 1
    const endIndex = Math.min(startIndex + prefetchCount, allVideoSources.length)

    for (let i = startIndex; i < endIndex; i++) {
      this.preloadVideo(allVideoSources[i]).catch(console.warn)
    }
  }

  // Clean up resources
  cleanup(): void {
    this.preloadedVideos.forEach(video => {
      video.src = ''
      video.load()
    })
    this.preloadedVideos.clear()
    this.loadingPromises.clear()
    
    this.observers.forEach(observer => observer.disconnect())
    this.observers.clear()
  }

  // Get preload statistics
  getStats(): { preloaded: number; loading: number; total: number } {
    return {
      preloaded: this.preloadedVideos.size,
      loading: this.loadingPromises.size,
      total: this.preloadedVideos.size + this.loadingPromises.size
    }
  }
}

// Hook for using video preloader
import { useEffect, useCallback } from 'react'

export function useVideoPreloader() {
  const preloader = VideoPreloader.getInstance()

  const preloadCritical = useCallback(async (videos?: string[]) => {
    await preloader.preloadCriticalVideos(videos || [])
  }, [preloader])

  const preloadVideo = useCallback(async (src: string, priority = false) => {
    return preloader.preloadVideo(src, priority)
  }, [preloader])

  const setupLazyLoading = useCallback((element: HTMLVideoElement, src: string) => {
    preloader.setupLazyLoading(element, src)
  }, [preloader])

  const getStats = useCallback(() => {
    return preloader.getStats()
  }, [preloader])

  useEffect(() => {
    return () => {
      // Cleanup on component unmount
      preloader.cleanup()
    }
  }, [preloader])

  return {
    preloadCritical,
    preloadVideo,
    setupLazyLoading,
    getStats,
    getPreloadedVideo: (src: string) => preloader.getVideo(src)
  }
}

export default VideoPreloader

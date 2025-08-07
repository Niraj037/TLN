"use client"

import { VIDEO_URLS, VideoKey, VIDEO_METADATA } from './video-config';

// Video preloading service optimized for GitHub Releases hosting
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

  // Preload critical videos from AWS S3 during app initialization
  async preloadCriticalVideos(videoKeys?: VideoKey[]): Promise<void> {
    const criticalVideos: VideoKey[] = videoKeys || ['hero', 'drumcym'] // Hero + first story

    try {
      console.log('🎬 Starting AWS S3 video preload...')
      
      // Preload hero video with full priority, others with metadata only
      await Promise.allSettled(
        criticalVideos.map(async (key, index) => {
          const priority = index === 0 // Only hero gets full preload
          const url = VIDEO_URLS[key]
          console.log(`⏳ Preloading ${key}: ${VIDEO_METADATA[key].size}`)
          return this.preloadVideoMetadata(url, priority)
        })
      )
      
      console.log('✅ AWS S3 video preload complete!')
    } catch (error) {
      console.warn('⚠️ Some S3 videos failed to preload:', error)
    }
  }

  // Lightweight metadata preloading for AWS S3
  async preloadVideoMetadata(src: string, priority = false): Promise<HTMLVideoElement> {
    if (this.preloadedVideos.has(src)) {
      return this.preloadedVideos.get(src)!
    }

    if (this.loadingPromises.has(src)) {
      return this.loadingPromises.get(src)!
    }

    const loadPromise = new Promise<HTMLVideoElement>((resolve, reject) => {
      const video = document.createElement('video')
      
      // Optimize for AWS S3 hosting
      video.preload = priority ? 'auto' : 'metadata' // Only hero gets full preload
      video.muted = true
      video.playsInline = true
      video.crossOrigin = 'anonymous'
      
      // Performance optimizations
      video.style.position = 'absolute'
      video.style.visibility = 'hidden'
      video.style.width = '1px'
      video.style.height = '1px'
      video.style.opacity = '0'
      
      let resolved = false

      const onLoadedMetadata = () => {
        if (!resolved) {
          resolved = true
          this.preloadedVideos.set(src, video)
          console.log(`✅ S3 video loaded: ${src.split('/').pop()}`)
          resolve(video)
          cleanup()
        }
      }

      const onCanPlay = () => {
        if (!resolved && priority) {
          resolved = true
          this.preloadedVideos.set(src, video)
          console.log(`🎯 S3 hero video ready: ${src.split('/').pop()}`)
          resolve(video)
          cleanup()
        }
      }

      const onError = () => {
        if (!resolved) {
          resolved = true
          console.error(`❌ S3 video failed: ${src.split('/').pop()}`)
          reject(new Error(`Failed to preload S3 video: ${src}`))
          cleanup()
        }
      }

      const cleanup = () => {
        video.removeEventListener('loadedmetadata', onLoadedMetadata)
        video.removeEventListener('canplay', onCanPlay)
        video.removeEventListener('error', onError)
        this.loadingPromises.delete(src)
      }

      video.addEventListener('loadedmetadata', onLoadedMetadata)
      if (priority) video.addEventListener('canplay', onCanPlay)
      video.addEventListener('error', onError)

      video.src = src
      video.load()

      // Timeout for AWS S3 CDN
      setTimeout(() => {
        if (!resolved) {
          console.warn(`⏰ S3 video timeout: ${src.split('/').pop()}`)
          onError()
        }
      }, priority ? 5000 : 3000) // Good timeout for S3
    })

    this.loadingPromises.set(src, loadPromise)
    return loadPromise
  }

  // Get preloaded video or create new one
  getVideo(src: string): HTMLVideoElement | null {
    return this.preloadedVideos.get(src) || null
  }

  // Lazy load videos based on viewport intersection - Vercel optimized
  setupLazyLoading(videoElement: HTMLVideoElement, src: string): void {
    if (this.observers.has(src)) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
            // For Vercel, just prepare metadata instead of full preload
            this.preloadVideoMetadata(src).then(() => {
              console.log(`Lazy loaded metadata: ${src}`)
            }).catch(console.warn)
            
            observer.unobserve(videoElement)
            this.observers.delete(src)
          }
        })
      },
      {
        rootMargin: '100px', // Increased margin for Vercel
        threshold: [0.1]
      }
    )

    observer.observe(videoElement)
    this.observers.set(src, observer)
  }

  // Prefetch next videos based on scroll position - Vercel optimized
  prefetchUpcoming(currentVideoIndex: number, allVideoSources: string[]): void {
    const prefetchCount = 1 // Reduced for Vercel hosting
    const startIndex = currentVideoIndex + 1
    const endIndex = Math.min(startIndex + prefetchCount, allVideoSources.length)

    for (let i = startIndex; i < endIndex; i++) {
      // Only prefetch metadata on Vercel
      this.preloadVideoMetadata(allVideoSources[i]).catch(console.warn)
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

  const preloadCritical = useCallback(async (videos?: VideoKey[]) => {
    await preloader.preloadCriticalVideos(videos)
  }, [preloader])

  const preloadVideo = useCallback(async (src: string, priority = false) => {
    return preloader.preloadVideoMetadata(src, priority)
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

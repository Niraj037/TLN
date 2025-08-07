"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import OptimizedVideo from '@/components/ui/optimized-video'
import VideoPreloader from '@/components/ui/video-preloader'
import { useVideoPreloader } from '@/lib/video-preloader'
import { VIDEO_URLS, VIDEO_METADATA, VideoKey } from '@/lib/video-config'

export default function VideoDemo() {
  const [showPreloader, setShowPreloader] = useState(true)
  const [currentVideo, setCurrentVideo] = useState<VideoKey>('hero')
  const [loadingProgress, setLoadingProgress] = useState(0)
  const { preloadCritical, getStats } = useVideoPreloader()

  useEffect(() => {
    // Start preloading videos from GitHub
    const startPreload = async () => {
      console.log('🚀 Starting AWS S3 video demo...')
      
      // Simulate progress for demo
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval)
            setTimeout(() => setShowPreloader(false), 500)
            return 100
          }
          return prev + Math.random() * 15
        })
      }, 200)

      try {
        await preloadCritical(['hero', 'guitar', 'vinyl1'])
        setLoadingProgress(100)
      } catch (error) {
        console.error('S3 preload error:', error)
        setLoadingProgress(100)
      }
    }

    startPreload()
  }, [preloadCritical])

  const videoKeys: VideoKey[] = ['hero', 'guitar', 'vinyl1', 'vinyl2', 'drumcym']

  if (showPreloader) {
    return <VideoPreloader progress={Math.round(loadingProgress)} />
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <motion.div 
        className="p-8 text-center border-b border-white/20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold mb-2">🎬 AWS S3 Video Demo</h1>
        <p className="text-white/60">Videos hosted on AWS S3 CDN</p>
        <div className="mt-4 text-sm text-white/40">
          Current: <span className="text-green-400">{currentVideo}</span> | 
          Size: <span className="text-blue-400">{VIDEO_METADATA[currentVideo].size}</span>
        </div>
      </motion.div>

      {/* Video Display */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <OptimizedVideo
          videoKey={currentVideo}
          className="w-full h-full object-cover"
          priority={currentVideo === 'hero'}
          onLoadStart={() => console.log(`🎬 Loading ${currentVideo}...`)}
          onCanPlay={() => console.log(`✅ ${currentVideo} ready!`)}
          onError={() => console.error(`❌ ${currentVideo} failed!`)}
        />
        
        {/* Video Info Overlay */}
        <motion.div 
          className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="font-bold mb-1">📺 {currentVideo.toUpperCase()}</h3>
          <p className="text-sm text-white/70">Size: {VIDEO_METADATA[currentVideo].size}</p>
          <p className="text-xs text-white/50 mt-1">
            Source: AWS S3
          </p>
        </motion.div>
      </div>

      {/* Video Selector */}
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Select Video</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {videoKeys.map((key) => (
            <motion.button
              key={key}
              className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                currentVideo === key
                  ? 'border-green-400 bg-green-400/20 text-green-400'
                  : 'border-white/30 bg-white/5 text-white hover:border-white/50'
              }`}
              onClick={() => setCurrentVideo(key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-lg font-bold mb-1">🎵</div>
              <div className="text-sm font-medium">{key}</div>
              <div className="text-xs text-white/60 mt-1">
                {VIDEO_METADATA[key].size}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* GitHub Info */}
      <motion.div 
        className="p-8 bg-white/5 border-t border-white/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <h3 className="text-xl font-bold mb-4">📊 AWS S3 Hosting Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-green-400 font-medium mb-2">✅ Fast & Reliable</h4>
            <p className="text-sm text-white/70">Enterprise-grade AWS infrastructure</p>
          </div>
          <div>
            <h4 className="text-blue-400 font-medium mb-2">🌍 Global CDN</h4>
            <p className="text-sm text-white/70">CloudFront integration for worldwide delivery</p>
          </div>
          <div>
            <h4 className="text-purple-400 font-medium mb-2">🚀 Scalable</h4>
            <p className="text-sm text-white/70">Handles high traffic and large files easily</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-black/30 rounded-lg">
          <h4 className="font-medium mb-2">📂 Video URLs:</h4>
          <div className="space-y-1 text-xs text-white/60 font-mono">
            {Object.entries(VIDEO_URLS).map(([key, url]) => (
              <div key={key}>
                <span className="text-white/80">{key}:</span> {url}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

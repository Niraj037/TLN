"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Music } from 'lucide-react'
import { useVideoPreloader } from '../../lib/video-preloader'

interface VideoPreloaderProps {
  onComplete: () => void
  minDisplayTime?: number
}

export default function VideoPreloader({ onComplete, minDisplayTime = 3000 }: VideoPreloaderProps) {
  const [progress, setProgress] = useState(0)
  const [loadingStage, setLoadingStage] = useState<'initializing' | 'preloading' | 'optimizing' | 'complete'>('initializing')
  const [videoStats, setVideoStats] = useState({ preloaded: 0, total: 5 })
  const { preloadCritical, getStats } = useVideoPreloader()

  useEffect(() => {
    let startTime = Date.now()

    const criticalVideos = [
      '/vids/drumkit-optimized-v2.mp4',  // Hero video - highest priority
      '/vids/drumcym-optimized.mp4',     // First story video
      '/vids/guitar-optimized.mp4',      // Second story video
      '/vids/vinyl1-optimized.mp4',      // Third story video
      '/vids/vinyl2-optimized-v2.mp4',   // Fourth story video
    ]

    async function initializePreloader() {
      try {
        // Stage 1: Initialization
        setLoadingStage('initializing')
        setProgress(5)

        await new Promise(resolve => setTimeout(resolve, 500))

        // Stage 2: Start preloading critical videos
        setLoadingStage('preloading')
        setProgress(15)

        // Preload videos with progress tracking
        const preloadPromises = criticalVideos.map(async (video, index) => {
          try {
            await preloadCritical([video])
            const newProgress = 15 + ((index + 1) / criticalVideos.length) * 65
            setProgress(Math.min(newProgress, 80))
            
            const stats = getStats()
            setVideoStats(stats)
          } catch (error) {
            console.warn(`Failed to preload ${video}:`, error)
          }
        })

        await Promise.allSettled(preloadPromises)

        // Stage 3: Optimization
        setLoadingStage('optimizing')
        setProgress(85)

        // Simulate final optimizations
        await new Promise(resolve => setTimeout(resolve, 300))
        setProgress(95)

        // Ensure minimum display time
        const elapsed = Date.now() - startTime
        const remainingTime = Math.max(0, minDisplayTime - elapsed)
        
        if (remainingTime > 0) {
          await new Promise(resolve => setTimeout(resolve, remainingTime))
        }

        // Stage 4: Complete
        setLoadingStage('complete')
        setProgress(100)

        // Small delay before calling onComplete
        setTimeout(onComplete, 200)

      } catch (error) {
        console.error('Preloader error:', error)
        // Still complete even if there are errors
        setProgress(100)
        setTimeout(onComplete, 500)
      }
    }

    initializePreloader()
  }, [preloadCritical, getStats, onComplete, minDisplayTime])

  const getStageText = () => {
    const criticalVideos = [
      '/vids/drumkit-optimized-v2.mp4',
      '/vids/drumcym-optimized.mp4',
      '/vids/guitar-optimized.mp4',
      '/vids/vinyl1-optimized.mp4',
      '/vids/vinyl2-optimized-v2.mp4',
    ]

    switch (loadingStage) {
      case 'initializing':
        return 'Initializing...'
      case 'preloading':
        return `Preloading videos... (${videoStats.preloaded}/${criticalVideos.length})`
      case 'optimizing':
        return 'Optimizing performance...'
      case 'complete':
        return 'Ready to rock!'
      default:
        return 'Loading...'
    }
  }

  const criticalVideos = [
    '/vids/drumkit-optimized-v2.mp4',
    '/vids/drumcym-optimized.mp4',
    '/vids/guitar-optimized.mp4',
    '/vids/vinyl1-optimized.mp4',
    '/vids/vinyl2-optimized-v2.mp4',
  ]

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {/* Enhanced Music Icon with pulse */}
        <motion.div
          className="mb-8 relative"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <Music className="w-16 h-16 md:w-20 md:h-20 text-white relative z-10" />
          
          {/* Pulsing background */}
          <motion.div
            className="absolute inset-0 bg-white/10 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Quote */}
        <motion.div
          className="text-center max-w-md px-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          <p className="text-lg md:text-xl font-light italic mb-4 font-inter text-white/90">
            "Everything I'm not makes me everything I am."
          </p>
          <p className="text-sm text-amber-200/60 font-inter">— YE (Kanye West)</p>
        </motion.div>

        {/* Enhanced Progress Bar */}
        <motion.div
          className="w-80 max-w-xs mx-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {/* Progress container */}
          <div className="relative mb-4">
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-full relative"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: [-100, 100] }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            </div>
            
            {/* Percentage */}
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-white/70 font-mono">{Math.round(progress)}%</span>
              <span className="text-sm text-white/70 font-mono">{getStageText()}</span>
            </div>
          </div>
        </motion.div>

        {/* Video preload indicators */}
        <motion.div
          className="flex space-x-2 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          {criticalVideos.map((_, i) => (
            <motion.div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-500 ${
                i < videoStats.preloaded ? 'bg-green-400' : 'bg-white/20'
              }`}
              animate={{
                scale: i < videoStats.preloaded ? [1, 1.2, 1] : 1,
              }}
              transition={{
                duration: 0.5,
                delay: i * 0.1,
              }}
            />
          ))}
        </motion.div>

        {/* Performance tip */}
        <motion.div
          className="absolute bottom-8 text-center text-xs text-white/40 font-mono max-w-md px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <p>Optimizing videos for your device...</p>
          <p className="mt-1">Total video size: 59.18 MB</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

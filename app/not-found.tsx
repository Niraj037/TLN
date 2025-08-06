"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, Home, Music, X } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null)
  const [showNotification, setShowNotification] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !audioRef) return

    // Start music after page renders
    const timer = setTimeout(() => {
      audioRef.play().catch(console.log)

      // Show notification after music starts
      setTimeout(() => {
        setShowNotification(true)
      }, 1000)

      // Auto-hide notification
      setTimeout(() => {
        setShowNotification(false)
      }, 8000)
    }, 1500)

    return () => clearTimeout(timer)
  }, [mounted, audioRef])

  const closeNotification = () => {
    setShowNotification(false)
  }

  if (!mounted) {
    return (
      <div className="bg-black text-white font-manrope min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-8xl font-bold mb-4">404</h1>
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black text-white font-manrope min-h-screen">
      {/* Hidden Audio */}
      <audio ref={(audio) => setAudioRef(audio)} className="hidden" loop>
        <source src="/runaway.mp3" type="audio/mpeg" />
      </audio>

      {/* Simple Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <Music className="w-5 h-5 text-white" />
                <div className="flex-1">
                  <p className="text-white text-sm">
                    Kanye West - one of the greatest hip-hop artists. Let's celebrate his music.
                  </p>
                </div>
                <button onClick={closeNotification} className="text-white/70 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="w-full">
        {/* Simple 404 Section */}
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <AlertTriangle className="w-20 h-20 mb-8 text-white mx-auto" />
            <h1 className="text-8xl md:text-9xl font-bold mb-6">404</h1>
            <p className="text-xl md:text-2xl mb-8 text-white/80">This page could not be found.</p>

            <div className="flex gap-4 flex-wrap justify-center">
              <Link
                href="/"
                className="bg-white text-black px-8 py-4 rounded-sm font-semibold hover:bg-white/90 transition-all"
              >
                <Home className="w-4 h-4 mr-2 inline-block" />
                Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap');
        
        .font-manrope {
          font-family: 'Manrope', sans-serif;
        }
        
        html, body {
          font-family: 'Manrope', sans-serif;
          background-color: #000;
          color: #fff;
          overflow-x: hidden;
        }
        
        ::-webkit-scrollbar {
          width: 2px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 1px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </div>
  )
}

"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { X, Play, Music, Download, Instagram, Twitter, Youtube, Users } from "lucide-react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import VideoPreloader from "../components/ui/video-preloader"
import OptimizedVideo from "../components/ui/optimized-video"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function TheLastNote() {
  const [jamNightsOpen, setJamNightsOpen] = useState(false)
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
  const [storyProgress, setStoryProgress] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  const heroRef = useRef<HTMLDivElement>(null)
  const storyContainerRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()

  const heroParallax = useTransform(scrollYProgress, [0, 1], [0, isMobile ? -200 : -500])
  const textParallax = useTransform(scrollYProgress, [0, 1], [0, isMobile ? -100 : -200])

  // Mobile detection and optimization
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Enhanced preloader with video optimization
  useEffect(() => {
    // The VideoPreloader component will handle all video preloading
    // and call setIsLoading(false) when ready
  }, [])

  // Mouse tracking for interactive light effect (disabled on mobile)
  useEffect(() => {
    if (isMobile) return

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [isMobile])

  const stories = [
    {
      title: "Title",
      subtitle: "subtitle",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate.",
      video: "/vids/drumcym-optimized.mp4",
      year: "2019",
      color: "#ff6b6b",
    },
    {
      title: "Title",
      subtitle: "subtitle",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate.",
      video: "/vids/guitar-optimized.mp4",
      year: "2020",
      color: "#4ecdc4",
    },
    {
      title: "Title",
      subtitle: "subtitle",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate.",   
      video: "/vids/vinyl1-optimized.mp4",
      year: "2021",
      color: "#45b7d1",
    },
    {
      title: "Title",
      subtitle: "subtitle",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate.",
      video: "/vids/vinyl2-optimized-v2.mp4",
      year: "2024",
      color: "#f7b731",
    },
  ]

  const releases = [
    {
      title: "lorem",
      type: "Album",
      date: "2024",
      cover: "/placeholder.svg?height=400&width=400&text=Echoes+Album+Cover+Dark+Minimalist",
      tracks: 12,
    },
    {
      title: "Lorem",
      type: "EP",
      date: "2023",
      cover: "/placeholder.svg?height=400&width=400&text=Midnight+EP+Cover+Moody+Black",
      tracks: 6,
    },
    {
      title: "lorem",
      type: "Single",
      date: "2023",
      cover: "/placeholder.svg?height=400&width=400&text=Single+Cover+Art+Minimalist+Dark",
      tracks: 1,
    },
  ]

  useGSAP(() => {
    const initAnimations = () => {
      // Clear any existing ScrollTriggers first
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())

      // Performance optimization: Reduce animations on mobile
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

      if (reducedMotion) {
        // Skip heavy animations for users who prefer reduced motion
        return
      }

      // Set will-change property for better performance
      gsap.set([".hero-title", ".hero-subtitle", ".story-panel", ".release-card"], {
        willChange: "transform, opacity",
      })

      // Enhanced Hero animations with parallax
      const heroTl = gsap.timeline({ delay: 0.5 }) // Add delay after preloader
      heroTl
        .set(".hero-title", { opacity: 0, y: isMobile ? 50 : 100, scale: 0.8 })
        .set(".hero-subtitle", { opacity: 0, y: isMobile ? 25 : 50 })
        .to(".hero-title", {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: isMobile ? 1.5 : 2,
          ease: "easeOut",
        })
        .to(
          ".hero-subtitle",
          {
            opacity: 1,
            y: 0,
            duration: isMobile ? 1 : 1.5,
            ease: "easeOut",
          },
          "-=1",
        )

      // Enhanced parallax for hero elements
      gsap.to(".hero-title", {
        y: isMobile ? -50 : -100,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      })

      gsap.to(".hero-subtitle", {
        y: isMobile ? -30 : -60,
        opacity: 0.3,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      })

      // Enhanced Story Section animations - Fixed timing
      if (storyContainerRef.current) {
        const storyPanels = gsap.utils.toArray(".story-panel")

        // Master timeline for story progress
        const masterTl = gsap.timeline({
          scrollTrigger: {
            trigger: storyContainerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            pin: false,
            onUpdate: (self) => {
              const progress = self.progress
              setStoryProgress(progress)
              const currentIndex = Math.floor(progress * stories.length)
              setCurrentStoryIndex(Math.min(currentIndex, stories.length - 1))
            },
          },
        })

        storyPanels.forEach((panel: any, index) => {
          // Set initial states immediately
          gsap.set(panel.querySelector(".story-year"), {
            opacity: 0,
            x: isMobile ? -100 : -200,
            scale: isMobile ? 0.5 : 0.3,
            rotationY: isMobile ? 0 : -90,
            transformPerspective: isMobile ? 0 : 1000,
          })
          gsap.set(panel.querySelector(".story-title"), {
            opacity: 0,
            y: isMobile ? 50 : 150,
            scale: isMobile ? 0.9 : 0.8,
            rotationX: isMobile ? 0 : 45,
            transformPerspective: isMobile ? 0 : 1000,
          })
          gsap.set(panel.querySelector(".story-subtitle"), {
            opacity: 0,
            y: isMobile ? 30 : 50,
            scale: 0.9,
            rotationX: isMobile ? 0 : 20,
          })
          gsap.set(panel.querySelectorAll(".story-text-word"), {
            opacity: 0,
            y: isMobile ? 20 : 30,
            rotationX: isMobile ? 0 : 45,
            transformPerspective: isMobile ? 0 : 1000,
          })

          // Main story animation timeline
          const storyTl = gsap.timeline({
            scrollTrigger: {
              trigger: panel,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse",
              markers: false,
            },
          })

          // Enhanced animations based on device
          if (isMobile) {
            // Mobile-optimized animations
            storyTl
              .to(panel.querySelector(".story-year"), {
                opacity: 0.1,
                x: 0,
                scale: 1,
                duration: 1,
                ease: "easeOut",
              })
              .to(
                panel.querySelector(".story-title"),
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  duration: 1.2,
                  ease: "easeOut",
                },
                "-=0.8",
              )
              .to(
                panel.querySelector(".story-subtitle"),
                {
                  opacity: 0.7,
                  y: 0,
                  duration: 1,
                  ease: "easeOut",
                },
                "-=1",
              )
              .to(
                panel.querySelectorAll(".story-text-word"),
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.6,
                  stagger: 0.01,
                  ease: "easeOut",
                },
                "-=0.6",
              )
          } else {
            // Desktop enhanced animations
            storyTl
              .to(panel.querySelector(".story-year"), {
                opacity: 0.1,
                x: 0,
                rotationY: 0,
                scale: 1,
                duration: 1.5,
                ease: "easeOut",
              })
              .to(
                panel.querySelector(".story-title"),
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  rotationX: 0,
                  duration: 2,
                  ease: "easeOut",
                },
                "-=1",
              )
              .to(
                panel.querySelector(".story-subtitle"),
                {
                  opacity: 0.7,
                  y: 0,
                  scale: 1,
                  rotationX: 0,
                  duration: 1.2,
                  ease: "easeOut",
                },
                "-=1.5",
              )
              .to(
                panel.querySelectorAll(".story-text-word"),
                {
                  opacity: 1,
                  y: 0,
                  rotationX: 0,
                  duration: 0.8,
                  stagger: 0.02,
                  ease: "easeOut",
                },
                "-=0.8",
              )
          }

          // Enhanced background video parallax
          gsap.fromTo(
            panel.querySelector(".story-bg-video"),
            {
              scale: isMobile ? 1.1 : 1.3,
              rotationY: isMobile ? 0 : -5,
              transformPerspective: isMobile ? 0 : 1000,
            },
            {
              scale: isMobile ? 1.05 : 1.1,
              rotationY: isMobile ? 0 : 5,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                start: "top bottom",
                end: "bottom top",
                scrub: isMobile ? 1 : 2,
              },
            },
          )

          // Enhanced color overlay animation
          gsap.fromTo(
            panel.querySelector(".story-color-overlay"),
            {
              opacity: 0,
              scale: 0.5,
              rotation: isMobile ? 0 : -10,
            },
            {
              opacity: 0.1,
              scale: 1.5,
              rotation: isMobile ? 0 : 10,
              duration: 2,
              ease: "easeOut",
              scrollTrigger: {
                trigger: panel,
                start: "top 60%",
                toggleActions: "play none none reverse",
              },
            },
          )

          // Story navigation dots animation
          gsap.fromTo(
            panel.querySelectorAll(".story-nav-dot"),
            {
              scale: 0,
              opacity: 0,
            },
            {
              scale: 1,
              opacity: 1,
              duration: 0.6,
              stagger: 0.1,
              ease: "[0.34, 1.56, 0.64, 1]",
              scrollTrigger: {
                trigger: panel,
                start: "top 70%",
                toggleActions: "play none none reverse",
              },
            },
          )
        })

        // Enhanced progress line animation
        gsap.fromTo(
          ".story-progress-line",
          {
            scaleX: 0,
            transformOrigin: "left center",
          },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: storyContainerRef.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 1,
            },
          },
        )
      }

      // Rest of animations remain the same...
      // New Releases Section Animations
      gsap.utils.toArray(".release-card").forEach((card: any, index) => {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 100,
            scale: 0.8,
            rotationY: isMobile ? 0 : -15,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationY: 0,
            duration: 1.2,
            ease: "easeOut",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse",
            },
          },
        )

        // Hover animations for desktop
        if (!isMobile) {
          card.addEventListener("mouseenter", () => {
            gsap.to(card, {
              y: -20,
              scale: 1.05,
              rotationY: 5,
              duration: 0.6,
              ease: "easeOut",
            })
          })

          card.addEventListener("mouseleave", () => {
            gsap.to(card, {
              y: 0,
              scale: 1,
              rotationY: 0,
              duration: 0.6,
              ease: "easeOut",
            })
          })
        }
      })

      // Band Image Section with advanced parallax
      gsap.fromTo(
        ".band-image",
        {
          scale: 1.2,
          y: 100,
          opacity: 0,
        },
        {
          scale: 1,
          y: 0,
          opacity: 1,
          duration: 2,
          ease: "easeOut",
          scrollTrigger: {
            trigger: ".band-image",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        },
      )

      // Parallax effect for band image
      gsap.to(".band-image", {
        y: isMobile ? -30 : -80,
        ease: "none",
        scrollTrigger: {
          trigger: ".band-image",
          start: "top bottom",
          end: "bottom top",
          scrub: 2,
        },
      })

      // Enhanced Footer animations
      gsap.fromTo(
        ".footer-signature",
        {
          scale: 0.2,
          opacity: 0,
          rotation: -15,
          transformPerspective: 1000,
          rotationY: 45,
        },
        {
          scale: 1,
          opacity: 0.25,
          rotation: 0,
          rotationY: 0,
          duration: 3,
          ease: "elastic.out(1, 0.4)",
          scrollTrigger: {
            trigger: ".footer-signature",
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        },
      )

      // Footer navigation items stagger animation
      gsap.fromTo(
        ".footer-nav-item",
        {
          opacity: 0,
          x: -50,
          y: 20,
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "easeOut",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      )

      // Status indicators animation
      gsap.fromTo(
        ".status-item",
        {
          opacity: 0,
          scale: 0.8,
          y: 20,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.2,
          ease: "[0.34, 1.56, 0.64, 1]",
          scrollTrigger: {
            trigger: ".status-bar",
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        },
      )

      // Floating particles enhanced animation
      gsap.utils.toArray(".floating-particle").forEach((particle: any, index) => {
        gsap.to(particle, {
          y: "random(-100, 100)",
          x: "random(-50, 50)",
          rotation: "random(-180, 180)",
          duration: "random(8, 15)",
          repeat: -1,
          yoyo: true,
          ease: "easeInOut",
          delay: index * 0.1,
        })
      })
    }

    // Initialize animations after a short delay to ensure DOM is ready
    const timer = setTimeout(initAnimations, 100)

    return () => {
      clearTimeout(timer)
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [isMobile, isLoading])

  // Simple Preloader Component
  const PreloaderComponent = () => (
    <motion.div
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: isLoading ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      style={{ pointerEvents: isLoading ? "all" : "none" }}
    >
      {/* Simple Music Icon */}
      <motion.div
        className="mb-8"
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
        <Music className="w-16 h-16 md:w-20 md:h-20 text-white" />
      </motion.div>

      {/* Quote */}
      <motion.div
        className="text-center max-w-md px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1 }}
      >
        <p className="text-lg md:text-xl font-light italic mb-4 font-inter text-white/90">
          "Everything I’m not makes me everything I am."
        </p>
        <p className="text-sm text-amber-200/60 font-inter">— YE (Kanye West)</p>
      </motion.div>

      {/* Loading dots */}
      <motion.div
        className="flex space-x-2 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-white/40 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  )

  if (isLoading) {
    return <VideoPreloader onComplete={() => setIsLoading(false)} minDisplayTime={2500} />
  }

  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden font-inter">
      {/* Mouse-following light effect (desktop only) */}
      {!isMobile && (
        <motion.div
          className="fixed w-80 h-80 pointer-events-none z-10 mix-blend-screen"
          style={{
            left: mousePosition.x - 160,
            top: mousePosition.y - 160,
            background:
              "radial-gradient(circle, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.005) 50%, transparent 100%)",
            willChange: "transform",
          }}
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center"
        style={{ y: heroParallax }}
      >
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="hero-video w-full h-full object-cover opacity-40"
            style={{
              willChange: "transform",
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
            }}
          >
            <source src="/vids/drumkit-optimized-v2.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90" />
        </div>

        <motion.div className="relative z-10 text-center px-4 sm:px-6 md:px-8" style={{ y: textParallax }}>
          <h1 className="hero-title text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] 2xl:text-[14rem] font-bold tracking-[0.02em] sm:tracking-[0.05em] md:tracking-[0.08em] lg:tracking-[0.1em] mb-4 sm:mb-6 md:mb-8 leading-[0.8] sm:leading-[0.85] md:leading-[0.9] font-anton uppercase">
            The <span className="text-amber-400 font-righteous">Last</span> Note
          </h1>
          <p className="hero-subtitle text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-light tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.25em] lg:tracking-[0.3em] opacity-60 font-inter max-w-6xl mx-auto">
            Lorem ipsum dolor sit amet.
          </p>
        </motion.div>

        {/* Jam Nights Portal Button */}
        <motion.div
          className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8 z-20"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 3, duration: 1.5, ease: "easeOut" }}
        >
          <button
            onClick={() => setJamNightsOpen(true)}
            className="group relative px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 border border-white/10 hover:border-white/30 transition-all duration-1000 bg-black/60 backdrop-blur-sm overflow-hidden rounded-sm"
          >
            <div className="flex items-center space-x-2 sm:space-x-2.5 md:space-x-3 relative z-10">
              <Music className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 group-hover:text-white transition-colors duration-700" />
              <span className="text-xs sm:text-sm md:text-base tracking-[0.15em] sm:tracking-[0.2em] font-jetbrains group-hover:text-white transition-colors duration-700">
                JAM NIGHTS
              </span>
            </div>
            <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-1000 ease-out" />
          </button>
        </motion.div>

        {/* Story Progress Indicator (desktop only) */}
      </motion.section>

      {/* Story Section */}
      <section ref={storyContainerRef} className="relative">
        {stories.map((story, index) => (
          <div
            key={index}
            className="story-panel relative min-h-screen flex items-center justify-center py-16 md:py-32"
          >
            {/* Background Video */}
            <div className="absolute inset-0 overflow-hidden">
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="story-bg-video w-full h-full object-cover"
                style={{
                  willChange: "transform",
                  transform: "translateZ(0)",
                  backfaceVisibility: "hidden",
                }}
              >
                <source src={story.video} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-black/80" />
              <div
                className="story-color-overlay absolute inset-0 mix-blend-overlay"
                style={{ backgroundColor: story.color }}
              />
            </div>

            {/* Year Display */}
            <div className="story-year absolute top-4 sm:top-6 md:top-8 lg:top-16 left-2 sm:left-4 md:left-8 lg:left-16">
              <span className="text-[4rem] sm:text-[6rem] md:text-[10rem] lg:text-[15rem] xl:text-[20rem] font-bold opacity-5 font-anton leading-none select-none">
                {story.year}
              </span>
            </div>

            {/* Story Content */}
            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 md:px-8 text-center">
              <motion.h2
                className="story-title text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold mb-3 sm:mb-4 md:mb-6 tracking-wide font-oswald leading-tight uppercase"
                style={{ perspective: isMobile ? "none" : "1000px" }}
              >
                {story.title}
              </motion.h2>

              <motion.p
                className="story-subtitle text-base sm:text-lg md:text-xl lg:text-2xl font-light mb-6 sm:mb-8 md:mb-16 opacity-70 font-inter tracking-wider max-w-4xl mx-auto"
                style={{ perspective: isMobile ? "none" : "1000px" }}
              >
                {story.subtitle}
              </motion.p>

              <div className="story-text-container max-w-5xl mx-auto mb-8 sm:mb-12 md:mb-20 px-2 sm:px-4">
                <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-light leading-relaxed sm:leading-loose font-inter">
                  {story.text.split(" ").map((word, wordIndex) => (
                    <span
                      key={wordIndex}
                      className="story-text-word inline-block mr-1 sm:mr-2"
                      style={{ perspective: isMobile ? "none" : "1000px" }}
                    >
                      {word}
                    </span>
                  ))}
                </p>
              </div>

              {/* Story Navigation */}
              <div className="flex justify-center space-x-1.5 sm:space-x-2 md:space-x-3 lg:space-x-4">
                {stories.map((_, dotIndex) => (
                  <button
                    key={dotIndex}
                    className={`story-nav-dot relative w-0.5 h-0.5 xs:w-1 xs:h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-700 group ${
                      dotIndex === index ? "bg-white scale-125" : "bg-white/20 hover:bg-white/50 hover:scale-110"
                    }`}
                    onClick={() => {
                      const targetPanel = document.querySelectorAll(".story-panel")[dotIndex]
                      targetPanel?.scrollIntoView({ behavior: "smooth" })
                    }}
                  >
                    {dotIndex === index && (
                      <motion.div
                        className="absolute inset-0 rounded-full border border-white"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [1, 0, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 lg:bottom-16 right-2 sm:right-4 md:right-8 lg:right-16 opacity-10">
              <div className="text-2xl sm:text-4xl md:text-6xl lg:text-8xl xl:text-9xl font-bold font-anton">
                {String(index + 1).padStart(2, "0")}
              </div>
            </div>

            {/* Scroll Indicator */}
            {index === stories.length - 1 && (
              <motion.div
                className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2"
                animate={{
                  y: [0, 10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <div className="w-px h-8 md:h-16 bg-white/30"></div>
                <div className="text-xs tracking-widest font-inter text-white/50 mt-2">CONTINUE</div>
              </motion.div>
            )}
          </div>
        ))}
      </section>

      {/* New Releases Section */}
      <section className="py-16 md:py-32 px-4 md:px-8 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12 md:mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold mb-4 md:mb-6 tracking-wide font-bebas uppercase">
              NEW RELEASES
            </h2>
            <p className="text-base sm:text-lg md:text-xl font-light opacity-70 max-w-3xl mx-auto font-inter">
              Our latest musical journeys, crafted in the shadows and brought to light.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {releases.map((release, index) => (
              <motion.div
                key={index}
                className="group relative release-card"
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="relative overflow-hidden rounded-lg mb-6">
                  <Image
                    src={release.cover || "/images/album-cover-1.png"}
                    alt={release.title}
                    width={400}
                    height={400}
                    className="w-full h-auto transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex space-x-4">
                      <button 
                        className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                        aria-label={`Play ${release.title}`}
                        title={`Play ${release.title}`}
                      >
                        <Play className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </button>
                      <button 
                        className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                        aria-label={`Download ${release.title}`}
                        title={`Download ${release.title}`}
                      >
                        <Download className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 font-inter group-hover:text-amber-200 transition-colors">
                    {release.title}
                  </h3>
                  <p className="text-amber-200/80 mb-2 font-inter text-sm sm:text-base">
                    {release.type} • {release.date}
                  </p>
                  <p className="text-xs sm:text-sm opacity-60 font-inter">{release.tracks} tracks</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Band Image Section */}
      <section className="py-16 md:py-32 px-4 md:px-8">
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="relative overflow-hidden rounded-lg cursor-pointer group"
            whileHover={{ scale: isMobile ? 1 : 1.02 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Image
              src="/images/band-photo.png?height=800&width=1200"
              alt="The Last Note band members"
              width={1200}
              height={800}
              className="w-full h-auto transition-all duration-700 grayscale group-hover:grayscale-0 band-image"
            />
            <motion.div
              className="absolute inset-0 bg-black/20"
              initial={{ opacity: 1 }}
              whileHover={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
            />
          </motion.div>
        </motion.div>
      </section>

    
      <footer
        ref={footerRef}
        className="relative py-16 md:py-32 px-4 md:px-8 border-t border-white/10 overflow-hidden min-h-screen flex items-center"
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="footer-signature select-none whitespace-nowrap transform -rotate-12"
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.8 },
            }}
          >
           Last Note
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <div className="grid md:grid-cols-3 gap-8 md:gap-16 mb-12 md:mb-20">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 font-bebas uppercase">Navigate</h3>
              <nav className="space-y-3 md:space-y-4">
                {[
          { label: "About", href: "/about" },
          { label: "Music", href: "/music" },
          { label: "Tour", href: "/tour" },
          { label: "Contact", href: "/contact" },
          { label: "Press", href: "/press" },
        ].map((item, index) => (
          <motion.a
            key={item.label}
            href={item.href}
                    className="footer-nav-item block text-base md:text-lg font-light tracking-wider hover:text-amber-200 transition-colors duration-300 font-inter relative group"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    {item.label}
                    <motion.div
                      className="absolute -bottom-1 left-0 w-0 h-px bg-amber-200"
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.a>
                ))}
              </nav>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 font-bebas uppercase">Connect</h3>
              <div className="space-y-3 md:space-y-4">
             {[
      {
        name: "Instagram",
        icon: Instagram,
        url: "https://instagram.com/thelastnote",
      },
      {
        name: "Twitter",
        icon: Twitter,
        url: "https://twitter.com/thelastnote",
      },
      {
        name: "YouTube",
        icon: Youtube,
        url: "https://youtube.com/@thelastnote",
      },
    ].map(({ name, icon: Icon, url }, index) => (
      <motion.a
        key={name}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
                    className="flex items-center space-x-2 md:space-x-3 text-base md:text-lg font-light hover:text-amber-200 transition-colors duration-300 font-inter group"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    viewport={{ once: true }}
                    whileHover={{ x: isMobile ? 0 : 10 }}
                  >
                    <Icon className="w-4 h-4 md:w-5 md:h-5 group-hover:text-amber-200 transition-colors" />
                    <span>{name}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 font-bebas uppercase">Reach Out</h3>
              <div className="space-y-3 md:space-y-4 text-base md:text-lg font-light font-inter">
                <p>
  <a href="mailto:booking@thelastnote.com?subject=Booking Inquiry" className="text-white hover:text-amber-200 hover:underline hover:underline-offset-2 transition-colors duration-300">
    booking@thelastnote.com
  </a>
</p>
<p>
  <a href="mailto:press@thelastnote.com" className="text-white hover:text-amber-200 hover:underline hover:underline-offset-2 transition-colors duration-300">
    press@thelastnote.com
  </a>
</p>
<p>
  <a href="tel:+1234567890"
  className="text-white hover:text-amber-200 hover:underline hover:underline-offset-2 transition-colors duration-300">
  +919572222201
</a> </p>
              </div>
            </motion.div>
          </div>

          <div className="status-bar text-center mb-8 md:mb-12">
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-xs md:text-sm font-mono font-jetbrains">
              {[
                { status: "All systems operational", color: "bg-green-400" },
                { status: "API operational", color: "bg-green-400" },
                { status: "Ticketing Form", color: "bg-red-600" },
              ].map((item, index) => (
                <motion.span
                  key={index}
                  className="status-item flex items-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    className={`w-2 h-2 ${item.color} rounded-full mr-2`}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  />
                  {item.status}
                  {index < 2 && <span className="ml-3 md:ml-6 opacity-50">•</span>}
                </motion.span>
              ))}
            </div>
          </div>

          <motion.div
            className="text-center text-xs sm:text-sm md:text-base opacity-60 max-w-2xl mx-auto font-inter footer-credits"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.6 }}
            transition={{ delay: 1, duration: 1 }}
            viewport={{ once: true }}
          >
            <p className="mb-2">
            Made with an *unhealthy* amount of love, wildly unnecessary perfectionism, and a long list of questionable life choices.
            </p>
            <p className="mb-2">
            Proudly brought to you by  — <span className="text-amber-200 font-semibold">Niraj</span>.
            </p>
            <p className="text-amber-200 font-bold">
              © {new Date().getFullYear()} The Last Note. All rights reserved.
            </p>
          </motion.div>
        </div>

        <div className="absolute inset-0 opacity-5 pointer-events-none">
          {[...Array(isMobile ? 4 : 8)].map((_, i) => (
            <motion.div
              key={i}
              className="floating-particle absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                willChange: "transform",
              }}
              animate={{
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0],
                y: [-20, 20, -20],
                x: [-8, 8, -8],
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 6,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </footer>

      <AnimatePresence>
        {jamNightsOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{ overflow: "hidden" }}
          >
       
            <motion.button
              onClick={() => setJamNightsOpen(false)}
              className="fixed top-4 md:top-8 right-4 md:right-8 w-10 h-10 md:w-12 md:h-12 border border-white/20 rounded-sm flex items-center justify-center hover:border-white/40 hover:bg-white/5 transition-all duration-300 z-50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <X className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </motion.button>

        
            <div
              className="h-full w-full overflow-y-auto overflow-x-hidden jam-nights-no-scroll"
              style={{
                height: "100vh",
                overflowY: "auto",
                WebkitOverflowScrolling: "touch",
              }}
            >
              <div className="min-h-screen bg-black">
          
                <section className="min-h-screen flex items-center justify-center px-4 md:px-8 relative bg-black">
                  <motion.div
                    className="text-center max-w-6xl"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
                  >
                    <motion.h1
                      className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold mb-4 sm:mb-6 md:mb-8 tracking-wider font-bebas text-white uppercase"
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
                    >
                      Jam Nights
                    </motion.h1>
                    <motion.p
                      className="text-base sm:text-lg md:text-xl lg:text-2xl font-light opacity-70 mb-8 sm:mb-12 md:mb-16 font-inter text-white max-w-4xl mx-auto"
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
                    >
                     Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rerum consequuntur, odio quas nemo beatae qui ipsa officiis sed non nihil?
                    </motion.p>
                    <motion.div
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
                    >
                      <div className="w-px h-8 sm:h-12 md:h-16 bg-white/20 mx-auto mb-4"></div>
                      <p className="text-xs sm:text-sm tracking-widest font-inter text-white/60">SCROLL TO EXPLORE</p>
                    </motion.div>
                  </motion.div>
                </section>

                <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-8 bg-black">
                  <div className="max-w-5xl mx-auto text-center">
                    <motion.h2
                      className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 sm:mb-12 md:mb-16 font-bebas text-white uppercase"
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1 }}
                      viewport={{ once: true }}
                    >
                      lorem5  
                    </motion.h2>
                    <motion.div
                      className="space-y-6 sm:space-y-8 text-base sm:text-lg md:text-xl font-light leading-relaxed font-inter text-white/80"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 1 }}
                      viewport={{ once: true }}
                    >
                      <p>
                      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aspernatur voluptatibus ipsam laborum sint hic repellat assumenda illum maxime, iure autem!
                      </p>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque, in maxime sequi quo inventore dolor sunt voluptate obcaecati fugit nulla.
                      </p>
                      <motion.div
                        className="pt-8"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 1 }}
                        viewport={{ once: true }}
                      >
                        <div className="inline-block px-6 py-2 border border-white/20 rounded-sm">
                          <span className="text-lg font-inter text-white">
                           Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque molestiae id sed veritatis atque sequi blanditiis officia fugit consectetur?
                          </span>
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>
                </section>

                {/* Registration Forms - Glass Theme */}
                <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-8 bg-black border-t border-white/10">
                  <div className="max-w-7xl mx-auto">
                    <motion.h2
                      className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-12 sm:mb-16 md:mb-20 font-bebas text-white uppercase"
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1 }}
                      viewport={{ once: true }}
                    >
                      Join the Circle
                    </motion.h2>

                    <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12">
                      {/* Performer Registration */}
                      <motion.div
                        className="relative group"
                        initial={{ x: -100, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                      >
                        <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 overflow-hidden hover:bg-white/10 transition-all duration-500">
                          
                          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                          <div className="relative z-10">
                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-white font-inter flex items-center group-hover:text-amber-200 transition-colors duration-300">
                              <Music className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 mr-3 sm:mr-4" />
                              Performer
                            </h3>
                            <p className="text-base sm:text-lg md:text-xl opacity-70 mb-8 sm:mb-10 md:mb-12 font-inter text-white leading-relaxed">
                             Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsam illum corrupti deserunt beatae non amet cupiditate harum ut inventore saepe!
                            </p>

                            <div className="space-y-6 sm:space-y-8">
                              <div className="text-center">
                                <h4 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4 font-inter text-white">
                                  Apply to Perform
                                </h4>
                                <p className="text-white/60 mb-6 sm:mb-8 font-inter text-sm sm:text-base">
                                  Fill out our application form to be considered for upcoming sessions.
                                </p>
                                <motion.a
                                  href="#"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block w-full backdrop-blur-sm bg-white/20 hover:bg-white/30 border border-white/30 hover:border-white/40 text-white py-4 px-8 text-lg font-semibold rounded-xl transition-all duration-300 font-inter"
                                  whileHover={{ scale: 1.02, y: -2 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  Open Application Form
                                </motion.a>
                              </div>

                              <div className="pt-8 border-t border-white/20">
                                <h5 className="text-lg font-semibold mb-4 font-inter text-white">What to expect:</h5>
                                <ul className="space-y-3 text-white/70 font-inter">
                                  <li className="flex items-center">
                                    <div className="w-2 h-2 bg-amber-400 rounded-full mr-3"></div>
                                      Lorem ipsum dolor sit amet.
                                  </li>
                                  <li className="flex items-center">
                                    <div className="w-2 h-2 bg-amber-400 rounded-full mr-3"></div>
                                      Lorem ipsum dolor sit amet.
                                  </li>
                                  <li className="flex items-center">
                                    <div className="w-2 h-2 bg-amber-400 rounded-full mr-3"></div>
                                   Lorem ipsum dolor sit amet.
                                  </li>
                                  <li className="flex items-center">
                                    <div className="w-2 h-2 bg-amber-400 rounded-full mr-3"></div>
                                      Lorem ipsum dolor sit amet.
                                  </li>
                                  <li className="flex items-center">
                                    <div className="w-2 h-2 bg-amber-400 rounded-full mr-3"></div>
                                     Lorem ipsum dolor sit amet.
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>

                         
                          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-transparent to-amber-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />
                        </div>
                      </motion.div>

                      {/* Audience Registration  */}
                      <motion.div
                        className="relative group"
                        initial={{ x: 100, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                      >
                        <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 overflow-hidden hover:bg-white/10 transition-all duration-500">
                          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                          <div className="relative z-10">
                            <h3 className="text-4xl font-bold mb-8 text-white font-inter flex items-center group-hover:text-blue-200 transition-colors duration-300">
                              <Users className="w-10 h-10 mr-4" />
                              Audience
                            </h3>
                            <p className="text-xl opacity-70 mb-12 font-inter text-white leading-relaxed">
                             Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus nostrum ullam obcaecati placeat rerum alias error odit qui illum praesentium!
                            </p>

                            <div className="space-y-8">
                              <div className="text-center">
                                <h4 className="text-2xl font-semibold mb-4 font-inter text-white">
                                  Request Invitation
                                </h4>
                                <p className="text-white/60 mb-8 font-inter">
                                  Join our exclusive audience for an unforgettable musical experience.
                                </p>
                                <motion.a
                                  href="https://forms.gle/sjakakaaaaaaaa"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block w-full backdrop-blur-sm bg-white/20 hover:bg-white/30 border border-white/30 hover:border-white/40 text-white py-4 px-8 text-lg font-semibold rounded-xl transition-all duration-300 font-inter"
                                  whileHover={{ scale: 1.02, y: -2 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  Request Invitation
                                </motion.a>
                              </div>

                              <div className="pt-8 border-t border-white/20">
                                <h5 className="text-lg font-semibold mb-4 font-inter text-white">
                                  Experience includes:
                                </h5>
                                <ul className="space-y-3 text-white/70 font-inter">
                                  <li className="flex items-center">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                                      Lorem ipsum dolor sit amet.
                                  </li>
                                  <li className="flex items-center">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                                     Lorem ipsum dolor sit amet.
                                  </li>
                                  <li className="flex items-center">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                                      Lorem ipsum dolor sit amet.
                                  </li>
                                  <li className="flex items-center">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                                     Lorem ipsum dolor sit amet.
                                  </li>
                                  <li className="flex items-center">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                                      Lorem ipsum dolor sit amet.
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>

                       
                          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-transparent to-blue-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </section>

                {/* Calendar  Section */}
                <section className="py-32 px-8 bg-black border-t border-white/10">
                  <div className="max-w-6xl mx-auto">
                    <motion.h2
                      className="text-6xl font-bold text-center mb-20 font-inter text-white"
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1 }}
                      viewport={{ once: true }}
                    >
                      Next Jam Nights
                    </motion.h2>

                    {/* Upcoming Sessions */}
                    <div className="grid md:grid-cols-2 gap-8 mb-20">
                      {[
                        {
                          date: "2025-03-01",
                          time: "15:00",
                          title: "Lorem ipsum dolor sit amet.",
                          description: " Lorem ipsum dolor sit amet.",
                        },
                        {
                          date: "2025-03-08",
                          time: "15:00",
                          title: " Lorem ipsum dolor sit amet.",
                          description: " Lorem ipsum dolor sit amet.",
                        },
                      ].map((session, index) => {
                        const sessionDate = new Date(`${session.date}T${session.time}:00`)
                        const formattedDate = sessionDate.toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                        const formattedTime = sessionDate.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })

                        // Calendar URLs
                        const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(session.title)}&dates=${session.date.replace(/-/g, "")}T${session.time.replace(":", "")}00/${session.date.replace(/-/g, "")}T${(Number.parseInt(session.time.split(":")[0]) + 2).toString().padStart(2, "0")}${session.time.split(":")[1]}00&details=${encodeURIComponent(session.description)}&location=${encodeURIComponent("The Last Note Underground Studio")}`

                        const appleCalendarUrl = `data:text/calendar;charset=utf8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
URL:${window.location.href}
DTSTART:${session.date.replace(/-/g, "")}T${session.time.replace(":", "")}00
DTEND:${session.date.replace(/-/g, "")}T${(Number.parseInt(session.time.split(":")[0]) + 2).toString().padStart(2, "0")}${session.time.split(":")[1]}00
SUMMARY:${session.title}
DESCRIPTION:${session.description}
LOCATION:The Last Note Underground Studio
END:VEVENT
END:VCALENDAR`

                        return (
                          <motion.div
                            key={index}
                            className="relative group"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2, duration: 1 }}
                            viewport={{ once: true }}
                          >
                           
                            <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 overflow-hidden hover:bg-white/10 transition-all duration-500">
                            
                              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                             
                              <div className="absolute top-6 right-6 backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl px-4 py-2">
                                <div className="text-2xl font-bold text-white font-inter">
                                  {sessionDate.getDate()}
                                </div>
                                <div className="text-xs text-white/70 font-inter uppercase text-center">
                                  {sessionDate.toLocaleDateString("en-US", { month: "short" })}
                                </div>
                              </div>

                              
                              <div className="relative z-10">
                                <h3 className="text-3xl font-bold mb-3 font-inter text-white group-hover:text-amber-200 transition-colors duration-300">
                                  {session.title}
                                </h3>
                                <p className="text-white/70 mb-6 font-inter leading-relaxed">{session.description}</p>

                                
                                <div className="space-y-2 mb-8">
                                  <div className="flex items-center text-white/90 font-inter">
                                    <div className="w-2 h-2 bg-amber-400 rounded-full mr-3"></div>
                                    {formattedDate}
                                  </div>
                                  <div className="flex items-center text-white/90 font-inter">
                                    <div className="w-2 h-2 bg-amber-400 rounded-full mr-3"></div>
                                    {formattedTime}
                                  </div>
                                </div>

                                
                                <div className="flex gap-3">
                                  <motion.a
                                    href={googleCalendarUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center px-4 py-3 backdrop-blur-sm bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-xl text-white font-inter text-sm font-medium transition-all duration-300"
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    <span className="mr-2">📅</span>
                                    Google Calendar
                                  </motion.a>
                                  <motion.a
                                    href={appleCalendarUrl}
                                    download={`${session.title.replace(/\s+/g, "_")}.ics`}
                                    className="flex-1 flex items-center justify-center px-4 py-3 backdrop-blur-sm bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-xl text-white font-inter text-sm font-medium transition-all duration-300"
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    <span className="mr-2">📅</span>
                                    Apple Calendar
                                  </motion.a>
                                </div>
                              </div>

                              
                              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-transparent to-amber-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>

                    {/* Schedule Info  */}
                    <motion.div
                      className="text-center relative"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 1 }}
                      viewport={{ once: true }}
                    >
                      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 relative overflow-hidden group hover:bg-white/10 transition-all duration-500">
                      
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative z-10">
                          <h3 className="text-3xl font-bold mb-4 font-inter text-white">Regular Schedule</h3>
                          <p className="text-xl text-white/80 mb-8 font-inter">
                           Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam facere eum autem fugiat amet sapiente rem odit nihil doloribus nostrum, cum consectetur natus consequuntur fuga!
                          </p>
                          <div className="flex flex-wrap justify-center gap-4">
                            {["WEEKLY", "INTIMATE", "CURATED", "UNFORGETTABLE"].map((tag, index) => (
                              <div
                                key={tag}
                                className="px-6 py-2 backdrop-blur-sm bg-white/10 border border-white/20 rounded-full text-sm tracking-wider font-inter text-white/80 hover:bg-white/20 hover:text-white transition-all duration-300"
                              >
                                {tag}
                              </div>
                            ))}
                          </div>
                        </div>

                     
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 via-transparent to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />
                      </div>
                    </motion.div>
                  </div>
                </section>

                {/* Previous Glimpses */}
                <section className="py-32 px-8 bg-black border-t border-white/10">
                  <div className="max-w-7xl mx-auto">
                    <motion.h2
                      className="text-6xl font-bold text-center mb-20 font-inter text-white"
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1 }}
                      viewport={{ once: true }}
                    >
                      Previous Glimpses
                    </motion.h2>

                    <div className="grid md:grid-cols-3 gap-8">
                      {[
                        {
                          title: "  Lorem ipsum dolor sit amet.",
                          date: "Feb 23, 2025",
                          image: "/placeholder.svg?height=400&width=600&text=Acoustic+Session+Underground+Moody",
                          description: "  Lorem ipsum dolor sit amet.",
                        },
                        {
                          title: "  Lorem ipsum dolor sit amet.",
                          date: "Feb 16, 2025",
                          image: "/placeholder.svg?height=400&width=600&text=Electric+Performance+Dark+Atmospheric",
                          description: "E Lorem ipsum dolor sit amet.",
                        },
                        {
                          title: "  Lorem ipsum dolor sit amet.",
                          date: "Feb 9, 2026",
                          image: "/images/jazz-night.png",
                          description: "  Lorem ipsum dolor sit amet.",
                        },
                      ].map((session, index) => (
                        <motion.div
                          key={index}
                          className="group relative overflow-hidden rounded-sm border border-white/10"
                          initial={{ opacity: 0, y: 50 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.2, duration: 1 }}
                          viewport={{ once: true }}
                          whileHover={{ y: -5 }}
                        >
                          <Image
                            src={session.image || "/placeholder.svg"}
                            alt={session.title}
                            width={600}
                            height={400}
                            className="w-full h-64 object-cover transition-all duration-700 grayscale group-hover:grayscale-0"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-6">
                            <h3 className="text-2xl font-bold mb-2 font-inter text-white">{session.title}</h3>
                            <p className="text-white/60 mb-2 font-inter">{session.date}</p>
                            <p className="text-white/80 font-inter text-sm">{session.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Anton&family=Bebas+Neue&family=Oswald:wght@200..700&family=Righteous&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Creepster&family=Nosifer&family=Metal+Mania&family=Kalam:wght@300;400;700&family=Caveat:wght@400;500;600;700&family=Permanent+Marker&display=swap');
        
        .font-inter {
          font-family: 'Inter', sans-serif;
        }
        
        .font-anton {
          font-family: 'Anton', sans-serif;
        }
        
        .font-bebas {
          font-family: 'Bebas Neue', cursive;
        }
        
        .font-oswald {
          font-family: 'Oswald', sans-serif;
        }
        
        .font-righteous {
          font-family: 'Righteous', cursive;
        }
        
        .font-jetbrains {
          font-family: 'JetBrains Mono', monospace;
        }
        
        .font-metal {
          font-family: 'Metal Mania', cursive;
        }
        
        html {
          scroll-behavior: smooth;
        }
        
        body {
          font-family: 'Inter', sans-serif;
          overflow-x: hidden;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
          background: rgba(0, 0, 0, 0.8);
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.5) !important;
          border: none !important;
          box-shadow: none !important;
          -webkit-appearance: none;
        }
        
        ::-webkit-scrollbar-track-piece {
          background: rgba(0, 0, 0, 0.5) !important;
          border: none !important;
          box-shadow: none !important;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(245, 158, 11, 0.8), rgba(217, 119, 6, 1));
          border-radius: 3px;
          border: none !important;
          box-shadow: 0 0 6px rgba(245, 158, 11, 0.4), 0 0 12px rgba(245, 158, 11, 0.2);
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(245, 158, 11, 1), rgba(217, 119, 6, 1));
          box-shadow: 0 0 8px rgba(245, 158, 11, 0.6), 0 0 16px rgba(245, 158, 11, 0.3);
        }

        ::-webkit-scrollbar-corner {
          background: rgba(0, 0, 0, 0.8);
        }

        /* Jam Nights - NO scrollbar */
        .jam-nights-no-scroll::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
        
        .jam-nights-no-scroll::-webkit-scrollbar-track {
          background: transparent !important;
        }
        
        .jam-nights-no-scroll::-webkit-scrollbar-thumb {
          background: transparent !important;
        }

        /* Firefox scrollbar */
        html {
          scrollbar-width: thin;
          scrollbar-color: rgba(245, 158, 11, 0.8) rgba(0, 0, 0, 0.5);
        }

        /* Firefox - no scrollbar for jam nights */
        .jam-nights-no-scroll {
          scrollbar-width: none;
        }

        /* Video optimizations */
        video {
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        /* Reduce video quality on mobile for performance */
        @media (max-width: 768px) {
          video {
            filter: brightness(0.9) contrast(1.1);
          }
        }

        /* Optimize video rendering */
        .story-bg-video,
        .hero-video {
          object-fit: cover;
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          z-index: -1;
        }

        /* Preload and optimize video performance */
        video[preload="metadata"] {
          transform: translateZ(0);
        }

        /* Mobile-first responsive design */
        @media (max-width: 640px) {
          .hero-title {
            font-size: clamp(3.5rem, 18vw, 6rem) !important;
            line-height: 0.8 !important;
            letter-spacing: 0.02em !important;
          }
          
          .hero-subtitle {
            font-size: clamp(1rem, 5vw, 1.5rem) !important;
            letter-spacing: 0.1em !important;
          }
          
          .story-title {
            font-size: clamp(1.75rem, 10vw, 3rem) !important;
          }
          
          .story-subtitle {
            font-size: clamp(1rem, 5vw, 1.5rem) !important;
          }
          
          .story-text-container p {
            font-size: clamp(0.875rem, 4vw, 1.125rem) !important;
            line-height: 1.6 !important;
          }
          
          .story-year span {
            font-size: clamp(3rem, 20vw, 6rem) !important;
          }
          
          /* Ultra small story navigation dots for mobile */
          .story-nav-dot {
            width: 0.375rem !important;
            height: 0.375rem !important;
            min-width: 0.375rem !important;
            min-height: 0.375rem !important;
          }
        }

        /* Extra small screens */
        @media (max-width: 480px) {
          .story-nav-dot {
            width: 0.25rem !important;
            height: 0.25rem !important;
            min-width: 0.25rem !important;
            min-height: 0.25rem !important;
          }
        }

        /* Tablet optimizations */
        @media (min-width: 641px) and (max-width: 1024px) {
          .hero-title {
            font-size: clamp(5rem, 15vw, 8rem) !important;
          }
          
          .story-title {
            font-size: clamp(2.5rem, 8vw, 5rem) !important;
          }
        }

        /* Desktop and larger */
        @media (min-width: 1025px) {
          .hero-title {
            font-size: clamp(6rem, 12vw, 14rem) !important;
          }
        }

        /* Perspective for 3D effects (desktop only) */
        @media (min-width: 768px) {
          .story-panel {
            perspective: 1000px;
            transform-style: preserve-3d;
          }
        }

        /* Mobile optimizations */
        @media (max-width: 767px) {
          .story-panel {
            perspective: none;
            padding: 3rem 1rem !important;
          }
          
          .story-text-word {
            perspective: none !important;
          }
          
          /* Ensure no horizontal overflow */
          * {
            max-width: 100%;
            box-sizing: border-box;
          }
          
          /* Better touch targets */
          button {
            min-height: 44px;
            min-width: 44px;
          }
          
          /* Responsive spacing for jam nights */
          .jam-nights-section {
            padding: 2rem 1rem !important;
          }
          
          .jam-nights-card {
            padding: 1.5rem !important;
            margin-bottom: 1.5rem !important;
          }
        }

        /* Performance optimizations */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          box-sizing: border-box;
        }

        .floating-particle,
        .story-panel,
        .release-card,
        .hero-title,
        .hero-subtitle {
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        /* Video performance optimizations */
        video {
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          pointer-events: none;
        }

        /* GPU acceleration for smooth scrolling */
        .story-panel,
        .hero-section,
        .footer-section {
          transform: translate3d(0, 0, 0);
          will-change: transform;
        }

        /* Optimize compositing layers */
        .story-bg-video,
        .hero-video {
          transform: translateZ(0);
          will-change: transform;
        }

        /* Reduce video loading on slow connections */
        @media (max-width: 768px) and (max-resolution: 150dpi) {
          video {
            filter: brightness(0.8) contrast(1.2);
            transform: scale(1.1) translateZ(0);
          }
        }

        /* Reduce animations on low-end devices */
        @media (max-width: 768px) and (max-resolution: 150dpi) {
          .floating-particle {
            animation-duration: 12s !important;
          }
        }

        /* Optimize for touch devices */
        @media (hover: none) and (pointer: coarse) {
          .group:hover {
            transform: none !important;
          }
        }

        /* Prevent horizontal scroll */
        html, body {
          overflow-x: hidden;
          width: 100%;
        }

        /* Improve mobile readability */
        @media (max-width: 640px) {
          p, span {
            word-break: break-word;
            hyphens: auto;
          }
        }

        /* Footer signature styles */
        .footer-signature {
          font-size: clamp(4rem, 20vw, 30rem);
          font-family: 'Kalam', 'Caveat', 'Permanent Marker', cursive;
          font-weight: bold;
          color: rgba(255, 255, 255, 0.25);
          text-shadow: 0 0 100px rgba(255,255,255,0.1);
          line-height: 0.8;
          letter-spacing: -0.05em;
          transform: rotate(-12deg) skew(-5deg, 2deg);
        }

        .footer-signature:hover {
          color: rgba(255, 255, 255, 0.35);
        }

        /* Special font for footer credits */
        .footer-credits {
          font-family: 'JetBrains Mono', 'Inter', monospace !important;
        }
      `}</style>
    </div>
  )
}

import type { Metadata } from 'next'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import './globals.css'
import '../styles/video-optimizations.css'

export const metadata: Metadata = {
  title: 'The Last Note',
  description: 'Freelancer #10',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Load Geist Sans from CDN */}
        <link rel="stylesheet" href="https://geistsans.com/font.css" />
        
        {/* Preload critical video resources */}
        <link rel="preload" href="/vids/drumkit-optimized-v2.mp4" as="video" type="video/mp4" />
        <link rel="prefetch" href="/vids/drumcym-optimized.mp4" as="video" type="video/mp4" />
        
        {/* Video performance hints */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#000000" />
        
        {/* Performance optimizations */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="" />
      </head>
      <body className="geist">
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}

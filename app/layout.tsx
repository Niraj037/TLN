import type { Metadata } from 'next'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import { VIDEO_URLS } from '@/lib/video-config'
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
        
        {/* AWS S3 video preloading - only hero video gets preload hint */}
        <link rel="preload" href={VIDEO_URLS.hero} as="video" type="video/mp4" />
        
        {/* DNS prefetch for AWS S3 performance */}
        <link rel="dns-prefetch" href="//tln-vids.s3.ap-south-1.amazonaws.com" />
        <link rel="preconnect" href="https://tln-vids.s3.ap-south-1.amazonaws.com" crossOrigin="" />
        
        {/* Video performance hints for S3 hosting */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className="geist">
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}

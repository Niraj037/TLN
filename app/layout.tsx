import type { Metadata } from 'next'
import './globals.css'

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
      </head>
      <body className="geist">
        {children}
      </body>
    </html>
  )
}

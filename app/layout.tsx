import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Find the Odd One Out - Brain Teaser Game',
  description: 'Test your observation skills! Can you spot the odd one out?',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

'use client'

import { Suspense } from 'react'
import Terminal from '@/components/terminal'

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-emerald-400 text-xl">Loading terminal...</div>
        </div>
      }>
        <Terminal />
      </Suspense>
    </main>
  )
}


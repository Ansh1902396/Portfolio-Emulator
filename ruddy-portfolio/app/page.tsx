'use client';

import { Suspense, useState, useEffect } from 'react';
import Terminal from '@/components/terminal';
import Loading from './loading';

//@ts-ignore
function DelayedSuspense({ delay, fallback, children }) {
  const [showFallback, setShowFallback] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFallback(false);
    }, delay);

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [delay]);

  return showFallback ? fallback : <Suspense fallback={fallback}>{children}</Suspense>;
}

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <DelayedSuspense delay={8000} fallback={<Loading />}>
        <Terminal />
      </DelayedSuspense>
    </main>
  );
}
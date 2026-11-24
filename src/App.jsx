import { useState } from 'react'
import LoadingScreen from '@/components/LoadingScreen'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'

export default function App() {
  const [loadingComplete, setLoadingComplete] = useState(false)

  return (
    <>
      {/* Yuki Minimalist Loading Screen (Dissolves smoothly on top) */}
      {!loadingComplete && (
        <LoadingScreen onComplete={() => setLoadingComplete(true)} />
      )}

      {/* Dynamic Island Navbar */}
      <Navbar />

      {/* Main website: already resting solidly underneath for seamless zero-flicker reveal */}
      <main
        style={{
          minHeight: '100vh',
          width: '100%',
          backgroundColor: '#000000',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Hero />
        <About />
      </main>
    </>
  )
}

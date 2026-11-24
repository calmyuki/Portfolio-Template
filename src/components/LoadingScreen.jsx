import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import Starfield from './Starfield'
import './LoadingScreen.css'

export default function LoadingScreen({ onComplete }) {
  const containerRef = useRef(null)
  const backdropRef = useRef(null)
  const logoRef = useRef(null)
  const ambientBloomRef = useRef(null)

  useGSAP(
    () => {
      const tl = gsap.timeline({
        onComplete: () => {
          if (onComplete) onComplete()
        },
      })

      // 1. Initial State: Deep pitch black void
      gsap.set(backdropRef.current, {
        opacity: 1,
      })
      gsap.set(logoRef.current, {
        opacity: 0,
        scale: 0.94,
        filter: 'blur(20px)',
      })
      gsap.set(ambientBloomRef.current, {
        scale: 0.7,
        opacity: 0,
      })

      // 2. Zen Inhale: Soft crimson ambient bloom expands & Yuki coalesces from darkness
      tl.to(ambientBloomRef.current, {
        scale: 1.1,
        opacity: 0.7,
        duration: 1.8,
        ease: 'power2.out',
      })
        .to(
          logoRef.current,
          {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            duration: 1.6,
            ease: 'power2.out',
          },
          '-=1.5'
        )

        // 3. Gentle Breathing Float: Soft ambient depth drift
        .to(
          logoRef.current,
          {
            scale: 1.04,
            duration: 1.6,
            ease: 'sine.inOut',
          },
          '-=0.2'
        )
        .to(
          ambientBloomRef.current,
          {
            scale: 1.25,
            opacity: 0.85,
            duration: 1.6,
            ease: 'sine.inOut',
          },
          '-=1.6'
        )

        // 4. Seamless Dissolve: Logo, bloom & stars gently crossfade out into fully dark void
        .to(logoRef.current, {
          scale: 1.12,
          opacity: 0,
          filter: 'blur(24px)',
          duration: 1.1,
          ease: 'power2.inOut',
        })
        .to(
          ambientBloomRef.current,
          {
            scale: 1.45,
            opacity: 0,
            duration: 1.0,
            ease: 'power2.inOut',
          },
          '-=1.0'
        )
        .to(
          backdropRef.current,
          {
            opacity: 0,
            duration: 1.0,
            ease: 'power2.inOut',
          },
          '-=0.8'
        )
    },
    { scope: containerRef }
  )

  return (
    <div ref={containerRef} className="zen-loader-portal">
      <div ref={backdropRef} className="zen-backdrop">
        {/* Moving stars active only during loading */}
        <Starfield />

        {/* Ambient Crimson Bloom behind Yuki */}
        <div ref={ambientBloomRef} className="zen-ambient-bloom" />

        {/* Minimalist Yuki Wordmark */}
        <div className="zen-logo-stage">
          <h1 ref={logoRef} className="zen-yuki-title">
            Yuki
          </h1>
        </div>
      </div>
    </div>
  )
}

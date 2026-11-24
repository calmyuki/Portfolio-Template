import { useRef, useCallback } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import aboutPng from '@/assets/about-silhouette.png'
import { PERSON_OUTLINE_PATH } from '@/assets/personPath'
import './About.css'

export default function About() {
  const aboutRef = useRef(null)
  const imageFrameRef = useRef(null)
  const glintPathRef = useRef(null)
  const glintSparkRef = useRef(null)
  const glintTimelineRef = useRef(null)

  useGSAP(
    () => {
      // Initialize ONLY the Pure White Glint Timeline along the Person's perimeter
      // Zero entrance animations, zero blinks, zero flickers
      if (glintPathRef.current) {
        const pathEl = glintPathRef.current
        const totalLen = pathEl.getTotalLength()
        const pulseLen = Math.max(150, totalLen * 0.16)

        gsap.set(pathEl, {
          strokeDasharray: `${pulseLen} ${totalLen}`,
          strokeDashoffset: pulseLen,
          opacity: 0,
        })

        if (glintSparkRef.current) {
          gsap.set(glintSparkRef.current, {
            opacity: 0,
          })
        }

        const tl = gsap.timeline({ paused: true })
        const proxy = { progress: 0 }

        tl.set([pathEl, glintSparkRef.current], { opacity: 1 })
          .fromTo(
            proxy,
            { progress: 0 },
            {
              progress: 1,
              duration: 1.35,
              ease: 'power2.inOut',
              onUpdate: () => {
                const offset = pulseLen - proxy.progress * (totalLen + pulseLen)
                pathEl.style.strokeDashoffset = offset

                if (glintSparkRef.current) {
                  const currentDist = Math.max(0, Math.min(totalLen, proxy.progress * totalLen))
                  const pt = pathEl.getPointAtLength(currentDist)
                  glintSparkRef.current.setAttribute('cx', pt.x)
                  glintSparkRef.current.setAttribute('cy', pt.y)
                }
              },
            }
          )
          .to(
            [pathEl, glintSparkRef.current],
            {
              opacity: 0,
              duration: 0.25,
              ease: 'power2.out',
            },
            '-=0.15'
          )

        glintTimelineRef.current = tl
      }
    },
    { scope: aboutRef }
  )

  const handleMouseEnter = useCallback(() => {
    if (glintTimelineRef.current) {
      glintTimelineRef.current.restart()
    }
  }, [])

  return (
    <section ref={aboutRef} id="about" className="about-section">
      <div className="about-container">
        {/* Left Column: Silhouette with Steady Red Backlight & Solid Stable Person */}
        <div className="about-image-column">
          <div
            ref={imageFrameRef}
            className="about-image-frame"
            onMouseEnter={handleMouseEnter}
            onClick={handleMouseEnter}
            onTouchStart={handleMouseEnter}
          >
            {/* 1. Deep Volumetric Red Wash (steady background light) */}
            <div className="about-custom-red-deep" />

            {/* 2. Atmospheric Studio Red Diffusion (steady background light) */}
            <div className="about-custom-red-bloom" />

            {/* 3. Incandescent Hotspot directly behind head/neck (steady background light) */}
            <div className="about-custom-red-bg" />

            {/* 4. Human Silhouette Layer (Solid 100% presence, no blinks, expands on hover) */}
            <div className="about-human-layer">
              <img
                src={aboutPng}
                alt="Silhouette"
                className="about-image-element"
              />

              {/* Pure White Glint SVG locked to the human */}
              <svg
                className="about-person-glint-svg"
                viewBox="0 0 768 910"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <filter
                    id="pureWhiteGlintFilter"
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                  >
                    <feGaussianBlur stdDeviation="2" result="blur1" />
                    <feGaussianBlur stdDeviation="5" result="blur2" />
                    <feGaussianBlur stdDeviation="12" result="blur3" />
                    <feMerge>
                      <feMergeNode in="blur3" />
                      <feMergeNode in="blur2" />
                      <feMergeNode in="blur1" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <path
                  ref={glintPathRef}
                  d={PERSON_OUTLINE_PATH}
                  className="about-white-glint-path"
                />

                <circle
                  ref={glintSparkRef}
                  r="4.5"
                  className="about-white-glint-spark"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Right side: Minimalist About Me (No boxes, no gradients) */}
        <div className="about-content-column">
          <div className="about-text-wrapper">
            <span className="about-eyebrow">ABOUT</span>
            <h2 className="about-title">I'm Yuki.</h2>
            <p className="about-description">
              An independent mind with a passion for programming, building purposeful software, and exploring the possibilities of technology.
            </p>
            <div className="about-meta">
              <span>17 years</span>
              <span className="about-meta-divider">·</span>
              <span>India</span>
              <span className="about-meta-divider">·</span>
              <span>Software Development</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

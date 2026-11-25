import { useRef, useState, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Hero from './Hero'
import About from './About'
import ProjectsSection from './ProjectsSection'
import './ScrollStage.css'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollStage() {
  const rootRef = useRef(null)
  const viewportRef = useRef(null)
  const heroLayerRef = useRef(null)
  const aboutLayerRef = useRef(null)
  const projectsLayerRef = useRef(null)
  const projectsContentRef = useRef(null)
  const timelineRef = useRef(null)
  const stRef = useRef(null)
  const progressBarRef = useRef(null)

  // Track active section (0 = Hero, 1 = About, 2 = Projects)
  const [activeSection, setActiveSection] = useState(0)
  // Track scroll direction mode ('zoom' | 'right' | 'explore')
  const [directionMode, setDirectionMode] = useState('zoom')

  const glintTriggeredRef = useRef(false)

  // Smooth scroll to a target section in the timeline
  const scrollToTarget = useCallback((target) => {
    if (!stRef.current) {
      if (target === 'hero' || target === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        const el = document.getElementById(target)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }
      return
    }

    const st = stRef.current
    const totalDist = st.end - st.start

    let targetProgress = 0
    if (target === 'about') {
      targetProgress = 0.35
    } else if (target === 'projects') {
      targetProgress = 0.77
    } else {
      targetProgress = 0
    }

    const scrollY = st.start + totalDist * targetProgress
    window.scrollTo({
      top: scrollY,
      behavior: 'smooth',
    })
  }, [])

  // Listen for navigation events from Navbar and ProjectDetailPage
  useEffect(() => {
    const handleGoto = (e) => {
      const target = e.detail?.target || 'home'
      scrollToTarget(target)
    }

    window.addEventListener('scroll-stage-goto', handleGoto)

    // Check if initial URL has hash
    if (window.location.hash) {
      const hash = window.location.hash.replace('#', '')
      setTimeout(() => {
        scrollToTarget(hash)
      }, 350)
    }

    return () => {
      window.removeEventListener('scroll-stage-goto', handleGoto)
    }
  }, [scrollToTarget])

  useGSAP(
    () => {
      // Check for user reduced motion preference
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches

      if (prefersReducedMotion) {
        return
      }

      const heroEl = heroLayerRef.current
      const aboutEl = aboutLayerRef.current
      const projectsEl = projectsLayerRef.current
      const projectsContent = projectsContentRef.current

      if (!heroEl || !aboutEl || !projectsEl || !rootRef.current || !viewportRef.current) {
        return
      }

      // Initial visual states
      gsap.set(heroEl, {
        scale: 1,
        opacity: 1,
        filter: 'blur(0px)',
        xPercent: 0,
      })

      gsap.set(aboutEl, {
        scale: 0.82,
        opacity: 0,
        filter: 'blur(12px)',
        xPercent: 0,
      })

      gsap.set(projectsEl, {
        xPercent: 100,
        scale: 0.94,
        opacity: 0.25,
      })

      // Select collage cards for staggered horizontal reveal
      const collageCards = projectsEl.querySelectorAll('.collage-box')
      if (collageCards.length > 0) {
        gsap.set(collageCards, {
          x: 70,
          rotateY: -12,
          opacity: 0.3,
          transformPerspective: 1000,
        })
      }

      // Scroll distance calculation: generous track for silky control
      const getScrollDistance = () => {
        const extraOverflow = projectsContent
          ? Math.max(0, projectsContent.scrollHeight - window.innerHeight + 100)
          : 0
        return 3400 + extraOverflow
      }

      // Master Scrubbed Timeline
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: () => `+=${getScrollDistance()}`,
          pin: viewportRef.current,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress

            // Progress bar update
            if (progressBarRef.current) {
              progressBarRef.current.style.transform = `scaleX(${p})`
            }

            // Determine active section and broadcast to Navbar
            let currentSec = 0
            let mode = 'zoom'

            if (p < 0.22) {
              currentSec = 0
              mode = 'zoom'
            } else if (p >= 0.22 && p < 0.62) {
              currentSec = 1
              mode = 'right'
            } else {
              currentSec = 2
              mode = 'explore'
            }

            setActiveSection((prev) => {
              if (prev !== currentSec) {
                window.dispatchEvent(
                  new CustomEvent('stage-active-section', {
                    detail: { index: currentSec },
                  })
                )
                return currentSec
              }
              return prev
            })

            setDirectionMode(mode)

            // Trigger About silhouette perimeter glint once user enters About section
            if (p >= 0.28 && !glintTriggeredRef.current) {
              glintTriggeredRef.current = true
              window.dispatchEvent(new CustomEvent('trigger-about-glint'))
            } else if (p < 0.15) {
              glintTriggeredRef.current = false
            }

            // Pointer events management for layers
            if (p < 0.25) {
              heroEl.classList.add('is-interactive')
              aboutEl.classList.remove('is-interactive')
              projectsEl.classList.remove('is-interactive')
            } else if (p >= 0.25 && p < 0.62) {
              heroEl.classList.remove('is-interactive')
              aboutEl.classList.add('is-interactive')
              projectsEl.classList.remove('is-interactive')
            } else {
              heroEl.classList.remove('is-interactive')
              aboutEl.classList.remove('is-interactive')
              projectsEl.classList.add('is-interactive')
            }
          },
        },
      })

      timelineRef.current = tl
      stRef.current = tl.scrollTrigger

      /* ─────────────────────────────────────────────────────────────
         PHASE 1 (0 -> 1.2): ZOOM INSIDE FROM HERO TO ABOUT ME
         Hero scales up through the camera, dispersing outward with blur.
         About Me emerges from depth, scaling up to 100% into full clarity.
         ───────────────────────────────────────────────────────────── */
      tl.addLabel('heroStart', 0)

      tl.to(
        heroEl,
        {
          scale: 6.2,
          opacity: 0,
          filter: 'blur(16px)',
          ease: 'power2.inOut',
          duration: 1.2,
        },
        0
      )

      tl.to(
        aboutEl,
        {
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
          ease: 'power2.inOut',
          duration: 1.2,
        },
        0
      )

      /* ─────────────────────────────────────────────────────────────
         PHASE 2 (1.2 -> 1.7): ABOUT ME DWELL WINDOW
         About Me is locked in position, fully readable and interactive.
         ───────────────────────────────────────────────────────────── */
      tl.addLabel('aboutInPlace', 1.2)
      tl.to({}, { duration: 0.5 }, 1.2)

      /* ─────────────────────────────────────────────────────────────
         PHASE 3 (1.7 -> 3.2): HORIZONTAL AXIS TRANSITION (SCROLL RIGHT)
         About Me slides off to the left with soft scale and blur.
         Projects section slides into view from the right.
         Collage project cards fan in with 3D perspective stagger.
         ───────────────────────────────────────────────────────────── */
      tl.addLabel('scrollRightStart', 1.7)

      tl.to(
        aboutEl,
        {
          xPercent: -100,
          scale: 0.94,
          opacity: 0.2,
          filter: 'blur(6px)',
          ease: 'power1.inOut',
          duration: 1.5,
        },
        1.7
      )

      tl.to(
        projectsEl,
        {
          xPercent: 0,
          scale: 1,
          opacity: 1,
          ease: 'power1.inOut',
          duration: 1.5,
        },
        1.7
      )

      if (collageCards.length > 0) {
        tl.to(
          collageCards,
          {
            x: 0,
            rotateY: 0,
            opacity: 1,
            stagger: 0.03,
            ease: 'power2.out',
            duration: 1.1,
          },
          2.0
        )
      }

      /* ─────────────────────────────────────────────────────────────
         PHASE 4 (3.2 -> 4.2): PROJECTS EXPLORATION / VERTICAL GLIDE
         If the collage height exceeds viewport on smaller screens/laptops,
         continue scrolling vertically so user explores all project boxes.
         ───────────────────────────────────────────────────────────── */
      tl.addLabel('projectsInPlace', 3.2)

      if (projectsContent) {
        tl.to(
          projectsContent,
          {
            y: () => {
              const overflow =
                projectsContent.scrollHeight - window.innerHeight + 80
              return overflow > 0 ? -overflow : 0
            },
            ease: 'none',
            duration: 1.0,
          },
          3.2
        )
      }

      tl.addLabel('projectsEnd', 4.2)
    },
    { scope: rootRef }
  )

  return (
    <div ref={rootRef} className="scroll-stage-root">
      {/* Top Hairline Progress Tracker */}
      <div
        ref={progressBarRef}
        className="stage-progress-bar"
        style={{ width: '100%', transform: 'scaleX(0)' }}
      />

      {/* Pinned 3D Viewport */}
      <div ref={viewportRef} className="scroll-stage-viewport">
        {/* Layer 1: Brutalist Hero (Zooms inward on scroll) */}
        <div ref={heroLayerRef} className="stage-layer stage-layer-hero is-interactive">
          <Hero />
        </div>

        {/* Layer 2: Minimalist About Me (Revealed through zoom, slides left on horizontal scroll) */}
        <div ref={aboutLayerRef} className="stage-layer stage-layer-about">
          <About />
        </div>

        {/* Layer 3: Projects Section (Enters from right, then allows full exploration) */}
        <div ref={projectsLayerRef} className="stage-layer stage-layer-projects">
          <div ref={projectsContentRef} className="stage-projects-content">
            <ProjectsSection />
          </div>
        </div>
      </div>

      {/* ── Aesthetic Minimalist Axis Navigator / HUD ── */}
      <aside className="stage-hud" aria-label="Scroll stage navigation">
        {/* Active Direction Badge */}
        <div className="stage-hud-direction">
          <span className="stage-hud-pulse-dot" />
          <span
            className={`stage-hud-arrow direction-${directionMode}`}
            aria-hidden="true"
          >
            {directionMode === 'zoom' ? '↕' : directionMode === 'right' ? '➔' : '✢'}
          </span>
          <span className="stage-hud-mode-text">
            {directionMode === 'zoom'
              ? 'ZOOM IN'
              : directionMode === 'right'
              ? 'SCROLL RIGHT'
              : 'EXPLORE'}
          </span>
        </div>

        {/* Stage Indicators */}
        <div className="stage-hud-sections">
          <button
            type="button"
            className={`stage-hud-btn ${activeSection === 0 ? 'is-active' : ''}`}
            onClick={() => scrollToTarget('hero')}
            aria-label="Jump to Hero section"
          >
            01 HERO
          </button>
          <button
            type="button"
            className={`stage-hud-btn ${activeSection === 1 ? 'is-active' : ''}`}
            onClick={() => scrollToTarget('about')}
            aria-label="Jump to About section"
          >
            02 ABOUT
          </button>
          <button
            type="button"
            className={`stage-hud-btn ${activeSection === 2 ? 'is-active' : ''}`}
            onClick={() => scrollToTarget('projects')}
            aria-label="Jump to Projects section"
          >
            03 PROJECTS
          </button>
        </div>
      </aside>
    </div>
  )
}

import { useRef, useEffect, useCallback } from 'react'
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
    } else if (target === 'contact') {
      const el = document.getElementById('contact')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
      return
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

      // Initial visual states — centered transform origins
      gsap.set(heroEl, {
        scale: 1,
        opacity: 1,
        filter: 'blur(0px)',
        xPercent: 0,
        transformOrigin: '50% 50%',
      })

      gsap.set(aboutEl, {
        scale: 0.82,
        opacity: 0,
        filter: 'blur(12px)',
        xPercent: 0,
        transformOrigin: '50% 50%',
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

      let lastActiveSection = 0

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

            // Determine active section and broadcast to Navbar
            let currentSec = 0
            if (p < 0.22) {
              currentSec = 0
            } else if (p >= 0.22 && p < 0.62) {
              currentSec = 1
            } else {
              currentSec = 2
            }

            if (lastActiveSection !== currentSec) {
              lastActiveSection = currentSec
              window.dispatchEvent(
                new CustomEvent('stage-active-section', {
                  detail: { index: currentSec },
                })
              )
            }

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
         PHASE 1 (0 -> 1.2): ZOOM INSIDE FROM HERO TO ABOUT ME (MIDDLE ZOOM)
         Hero zooms directly through the screen center into the depths.
         About Me emerges from dead center, scaling up to full clarity.
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
          transformOrigin: '50% 50%',
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
          transformOrigin: '50% 50%',
        },
        0
      )

      // About silhouette and text emergence with dimensional depth
      const aboutImg = aboutEl.querySelector('.about-image-column')
      const aboutContent = aboutEl.querySelector('.about-content-column')
      if (aboutImg) {
        tl.fromTo(
          aboutImg,
          { scale: 0.88, opacity: 0.2 },
          { scale: 1, opacity: 1, ease: 'power2.out', duration: 1.1 },
          0.1
        )
      }
      if (aboutContent) {
        tl.fromTo(
          aboutContent,
          { y: 35, opacity: 0 },
          { y: 0, opacity: 1, ease: 'power2.out', duration: 1.1 },
          0.15
        )
      }

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
            stagger: 0.025,
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
      {/* Pinned 3D Viewport */}
      <div ref={viewportRef} className="scroll-stage-viewport">
        {/* Layer 1: Brutalist Hero (Zooms inward from the middle) */}
        <div ref={heroLayerRef} className="stage-layer stage-layer-hero is-interactive">
          <Hero />
        </div>

        {/* Layer 2: Minimalist About Me (Revealed through middle zoom, slides left on horizontal scroll) */}
        <div ref={aboutLayerRef} className="stage-layer stage-layer-about">
          <About />
        </div>

        {/* Layer 3: Projects Section */}
        <div ref={projectsLayerRef} className="stage-layer stage-layer-projects">
          <div ref={projectsContentRef} className="stage-projects-content">
            <ProjectsSection />
          </div>
        </div>
      </div>
    </div>
  )
}

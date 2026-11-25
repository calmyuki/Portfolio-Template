import { useEffect, useRef, useState, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import lottie from 'lottie-web'
import styles from './Navbar.module.css'

const NAV_LINKS = [
  { id: 0, label: 'Home',     href: '/' },
  { id: 1, label: 'About',    href: '/#about' },
  { id: 2, label: 'Projects', href: '/#projects' },
]

export default function Navbar() {
  const catRef          = useRef(null)
  const animRef         = useRef(null)
  const expandTimer     = useRef(null)
  const collapseTimer   = useRef(null)
  const islandRef       = useRef(null)
  const location        = useLocation()
  const navigate        = useNavigate()
  
  // Set active link based on scroll and current path
  const [active, setActive] = useState(0)
  const activeRef = useRef(0)

  useEffect(() => {
    activeRef.current = active
  }, [active])

  // Listen to ScrollStage active section events for accurate synchronization
  useEffect(() => {
    const handleStageActive = (e) => {
      if (typeof e.detail?.index === 'number' && location.pathname === '/') {
        setActive(e.detail.index)
      }
    }

    window.addEventListener('stage-active-section', handleStageActive)
    return () => {
      window.removeEventListener('stage-active-section', handleStageActive)
    }
  }, [location.pathname])

  // Fast scroll tracking with hysteresis
  const updateSection = useCallback(() => {
    if (location.pathname.startsWith('/project/')) {
      setActive(2) // Projects is active when viewing a project detail page
      return
    }

    if (location.pathname !== '/') {
      return
    }

    const heroHeight = window.innerHeight || 800
    const contactEl = document.getElementById('contact')
    const projectsEl = document.getElementById('projects')
    const aboutEl = document.getElementById('about')

    if (contactEl) {
      const contactRect = contactEl.getBoundingClientRect()
      if (contactRect.top <= heroHeight * 0.5) {
        setActive(3)
        return
      }
    }

    if (projectsEl) {
      const projRect = projectsEl.getBoundingClientRect()
      // If Projects section top reaches upper half of viewport
      if (projRect.top <= heroHeight * 0.45) {
        setActive(2)
        return
      }
    }

    if (aboutEl) {
      const aboutRect = aboutEl.getBoundingClientRect()
      if (aboutRect.top <= heroHeight * 0.45) {
        setActive(1)
        return
      }
    }

    setActive(0)
  }, [location.pathname])
  
  useEffect(() => {
    let rafId = null

    const handleScrollThrottled = () => {
      if (rafId) return
      rafId = window.requestAnimationFrame(() => {
        updateSection()
        rafId = null
      })
    }

    // Initial check
    updateSection()
    const timer = setTimeout(updateSection, 300)

    window.addEventListener('scroll', handleScrollThrottled, { passive: true })
    window.addEventListener('resize', handleScrollThrottled, { passive: true })

    return () => {
      clearTimeout(timer)
      if (rafId) window.cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', handleScrollThrottled)
      window.removeEventListener('resize', handleScrollThrottled)
    }
  }, [updateSection])

  const [expanded, setExpanded]       = useState(false)   // controls pill size
  const [showContent, setShowContent] = useState(false) // controls inner visibility

  /* ─── Load cat Lottie ─── */
  useEffect(() => {
    if (!catRef.current) return
    animRef.current = lottie.loadAnimation({
      container: catRef.current,
      renderer:  'svg',
      loop:      false, // play only once
      autoplay:  false,
      path:      '/cat-hiding.json',
    })
    return () => animRef.current?.destroy()
  }, [])

  /* ─── Play/Pause cat based on expansion ─── */
  useEffect(() => {
    if (!animRef.current) return
    const anim = animRef.current

    if (showContent) {
      const playCat = () => {
        const dropFrames = anim.frameRate * 1 // 1 second worth of frames
        const endFrame = Math.max(1, anim.totalFrames - dropFrames)
        anim.playSegments([0, endFrame], true)
      }

      if (anim.isLoaded) {
        playCat()
      } else {
        anim.addEventListener('DOMLoaded', playCat)
      }
    } else {
      anim.resetSegments(true)
      anim.goToAndStop(0, true)
    }
  }, [showContent])

  /* ─── OPEN sequence ─── */
  const handleEnter = () => {
    updateSection()
    clearTimeout(collapseTimer.current)
    setExpanded(true)
    expandTimer.current = setTimeout(() => setShowContent(true), 320)
  }

  /* ─── CLOSE sequence ─── */
  const handleLeave = () => {
    clearTimeout(expandTimer.current)
    setShowContent(false)
    collapseTimer.current = setTimeout(() => {
      setExpanded(false)
    }, 200)
  }

  // Tap-to-toggle island on touch / mobile devices
  const handleIslandClick = () => {
    if (!expanded) {
      handleEnter()
    }
  }

  // Outside tap to collapse on mobile ONLY if currently open
  useEffect(() => {
    if (!expanded) return

    const handleOutsideTouch = (e) => {
      if (islandRef.current && !islandRef.current.contains(e.target)) {
        handleLeave()
      }
    }

    window.addEventListener('touchstart', handleOutsideTouch, { passive: true })
    window.addEventListener('click', handleOutsideTouch, { passive: true })
    return () => {
      window.removeEventListener('touchstart', handleOutsideTouch)
      window.removeEventListener('click', handleOutsideTouch)
    }
  }, [expanded, handleLeave])

  const handleScroll = (e, href, index) => {
    e.preventDefault()
    if (typeof index === 'number') {
      setActive(index)
    }
    // Gracefully collapse on mobile after link selection
    setTimeout(() => {
      handleLeave()
    }, 150)

    const targetId = href === '/' ? 'hero' : href.replace('/#', '')

    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent('scroll-stage-goto', {
            detail: { target: targetId },
          })
        )
      }, 120)
      return
    }

    window.dispatchEvent(
      new CustomEvent('scroll-stage-goto', {
        detail: { target: targetId },
      })
    )
  }

  /* Cleanup */
  useEffect(() => () => {
    clearTimeout(expandTimer.current)
    clearTimeout(collapseTimer.current)
  }, [])

  return (
    <header className={styles.header}>
      <nav
        ref={islandRef}
        className={`${styles.island} ${expanded ? styles.isOpen : ''}`}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onClick={handleIslandClick}
      >
        {/* ── Collapsed pill: Pure white pulsing dot & clean label ── */}
        <div className={`${styles.collapsed} ${showContent ? styles.collapsedHidden : ''}`}>
          <span className={styles.redDot} />
          <span className={styles.collapsedLabel}>Yuki</span>
        </div>

        {/* ── Expanded nav ── */}
        <div className={`${styles.expanded} ${showContent ? styles.expandedVisible : ''}`}>

          <Link 
            to="/" 
            className={styles.catAvatar}
            onClick={(e) => handleScroll(e, '/', 0)}
          >
            <div ref={catRef} className={styles.catLottie} />
          </Link>

          <div className={styles.divider} />

          <ul className={styles.links}>
            {NAV_LINKS.map((item, i) => (
              <li key={item.id}>
                <Link
                  to={item.href}
                  className={`${styles.link} ${active === i ? styles.active : ''}`}
                  onClick={(e) => {
                    handleScroll(e, item.href, i);
                  }}
                >
                  {item.label}
                  <span
                    className={`${styles.activeDot} ${active === i ? styles.activeDotVisible : ''}`}
                  />
                </Link>
              </li>
            ))}
          </ul>

          <div className={styles.divider} />

          <Link 
            to="/#contact" 
            className={styles.cta}
            onClick={(e) => handleScroll(e, '/#contact', 3)}
          >
            <span className={styles.ctaText}>Let&apos;s Talk</span>
            <span className={styles.ctaArrow}>↗</span>
          </Link>

        </div>
      </nav>
    </header>
  )
}

import { useEffect, useRef, useState, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import lottie from 'lottie-web'
import styles from './Navbar.module.css'

const NAV_LINKS = [
  { id: 0, label: 'Home',  href: '/' },
  { id: 1, label: 'About', href: '/#about' },
]

export default function Navbar() {
  const catRef          = useRef(null)
  const animRef         = useRef(null)
  const expandTimer     = useRef(null)
  const collapseTimer   = useRef(null)
  const islandRef       = useRef(null)
  const location        = useLocation()
  
  // Set active link based on scroll and current path
  const [active, setActive] = useState(0)
  const activeRef = useRef(0)

  useEffect(() => {
    activeRef.current = active
  }, [active])

  // Fast, zero-reflow scroll tracking using compositor-cached scrollY with hysteresis
  const updateSection = useCallback(() => {
    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0
    const heroHeight = window.innerHeight || 800
    const current = activeRef.current

    // Distance of About section from viewport top
    const relativeTop = heroHeight - scrollY

    // 20% Hysteresis deadband:
    // To switch from Home (0) -> About (1): top of About must reach upper 42% of viewport
    // To switch from About (1) -> Home (0): top of About must drop down past 62% of viewport
    if (current === 0 && relativeTop <= heroHeight * 0.42) {
      setActive(1)
    } else if (current === 1 && relativeTop >= heroHeight * 0.62) {
      setActive(0)
    }
  }, [])
  
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

  const [expanded, setExpanded]     = useState(false)   // controls pill size
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

  // Outside tap to collapse on mobile ONLY if currently open (zero touch overhead while scrolling)
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

    if (href === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (href.startsWith('/#')) {
      const targetId = href.replace('/#', '')
      const element = document.getElementById(targetId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
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
            to="/#about" 
            className={styles.cta}
            onClick={(e) => handleScroll(e, '/#about', 1)}
          >
            <span className={styles.ctaText}>Let&apos;s Talk</span>
            <span className={styles.ctaArrow}>↗</span>
          </Link>

        </div>
      </nav>
    </header>
  )
}

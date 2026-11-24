import { useEffect, useRef } from 'react'

export default function Starfield() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationFrameId
    let width = 0
    let height = 0
    let dpr = window.devicePixelRatio || 1

    let stars = []

    // Mouse parallax tracking
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 }

    const handleMouseMove = (e) => {
      // Normalize mouse offset between -1 and 1
      mouse.targetX = (e.clientX / width - 0.5) * 2
      mouse.targetY = (e.clientY / height - 0.5) * 2
    }

    function initStars() {
      stars = []
      // High star density with multi-layer depth
      const count = Math.max(120, Math.min(220, Math.floor((width * height) / 6000)))

      for (let i = 0; i < count; i++) {
        // Depth from 0.2 (distant) to 1.0 (close)
        const depth = Math.random() * 0.8 + 0.2
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          depth,
          // Clearly visible speed scaled by depth (0.5px to 1.8px per frame)
          vy: -(0.5 + depth * 1.3),
          // Subtle natural diagonal drift
          vx: (Math.random() - 0.5) * 0.3 * depth,
          // Radius based on depth
          radius: (0.4 + depth * 1.4) * dpr,
          baseAlpha: 0.2 + depth * 0.65,
          twinkleSpeed: Math.random() * 0.02 + 0.008,
          phase: Math.random() * Math.PI * 2,
        })
      }
    }

    const handleResize = () => {
      if (!canvas) return
      dpr = window.devicePixelRatio || 1
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      initStars()
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)
    handleResize()

    let time = 0

    const render = () => {
      time += 1
      // Smooth lerp mouse parallax
      mouse.x += (mouse.targetX - mouse.x) * 0.04
      mouse.y += (mouse.targetY - mouse.y) * 0.04

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw and update drifting stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i]

        // Update positions with visible speed
        star.y += star.vy
        star.x += star.vx

        // Wrap around smoothly when exiting screen
        if (star.y < -10) {
          star.y = height + 10
          star.x = Math.random() * width
        }
        if (star.x < -10) star.x = width + 10
        if (star.x > width + 10) star.x = -10

        // Parallax offset based on mouse position and star depth
        const drawX = (star.x + mouse.x * 25 * star.depth) * dpr
        const drawY = (star.y + mouse.y * 25 * star.depth) * dpr

        // Organic twinkling
        const currentAlpha =
          star.baseAlpha + Math.sin(time * star.twinkleSpeed + star.phase) * 0.25
        const alpha = Math.max(0.1, Math.min(0.95, currentAlpha))

        ctx.beginPath()
        ctx.arc(drawX, drawY, star.radius, 0, Math.PI * 2)

        // Pure crisp diamond monochrome stars
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
        ctx.shadowBlur = star.depth > 0.6 ? 3 * dpr : 0
        ctx.shadowColor = 'rgba(255, 255, 255, 0.6)'

        ctx.fill()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="stars-canvas"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}

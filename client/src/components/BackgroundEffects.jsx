import React, { useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function BackgroundEffects() {
  const mouseX = useMotionValue(-150)
  const mouseY = useMotionValue(-150)

  const springConfig = { damping: 45, stiffness: 180, mass: 0.6 }
  const glowX = useSpring(mouseX, springConfig)
  const glowY = useSpring(mouseY, springConfig)

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Offset by 150px (half of 300px glow diameter) to center on cursor
      mouseX.set(e.clientX - 150)
      mouseY.set(e.clientY - 150)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  // Spawn 20 custom ember particles
  const embers = Array.from({ length: 20 })

  return (
    <>
      {/* Film Grain (repeating SVG pattern overlay) */}
      <div className="film-grain" />

      {/* Cinematic Vignette */}
      <div className="vignette" />

      {/* Soft Ambient Smoke/Glow */}
      <div className="smoke-overlay" />

      {/* Mouse-Follow Ambient Glow */}
      <motion.div
        className="pointer-events-none fixed w-[300px] h-[300px] rounded-full bg-brand-red/15 blur-[90px] z-[0] hidden lg:block"
        style={{
          x: glowX,
          y: glowY,
        }}
      />

      {/* Floating Crimson Embers */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[1]">
        {embers.map((_, i) => {
          const size = Math.random() * 3 + 2 // 2px to 5px
          const startX = Math.random() * 100 // random horizontal start (vw)
          const duration = Math.random() * 8 + 7 // 7s to 15s transit time
          const delay = Math.random() * 6 // random delay to stagger spawn

          return (
            <motion.div
              key={i}
              className="absolute rounded-full bg-brand-red"
              style={{
                width: size,
                height: size,
                left: `${startX}vw`,
                bottom: '-20px',
                boxShadow: '0 0 6px #ff0000',
                opacity: 0.6,
              }}
              animate={{
                y: '-105vh',
                x: [0, Math.random() * 50 - 25, Math.random() * 50 - 25, 0],
                opacity: [0.1, 0.6, 0.6, 0],
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                delay: delay,
                ease: 'easeInOut',
              }}
            />
          )
        })}
      </div>
    </>
  )
}

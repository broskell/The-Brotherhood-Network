import React from 'react'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center px-4 py-20 relative overflow-hidden select-none">
      {/* Background Cinematic Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-brand-red/10 rounded-full filter blur-[120px] pointer-events-none z-[0]"></div>

      <div className="max-w-5xl mx-auto space-y-6 relative z-10">
        
        {/* Protocol Alert Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-brand-red/35 bg-black/75 text-brand-red text-xs font-bold tracking-widest uppercase"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-brand-red animate-pulse"></span>
          Emergency Support & Safety Protocol
        </motion.div>
        
        {/* Title: Split Colors */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
          className="text-[3rem] md:text-[5rem] lg:text-[8rem] tracking-tight font-heading font-black leading-none uppercase"
        >
          <span className="text-white">THE </span>
          <span className="flicker-glow">BROTHERHOOD </span>
          <span className="text-black">NETWORK</span>
        </motion.h1>

        
        {/* Subtitle: High Contrast */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-white text-2xl font-heading font-bold uppercase tracking-[0.3em] max-w-2xl mx-auto"
        >
          Never Stand Alone.
        </motion.p>

        {/* Core Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-white/80 font-heading text-lg md:text-xl tracking-wider max-w-xl mx-auto uppercase"
        >
          When life gets difficult, brothers show up.
        </motion.p>
        
        {/* Main Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-white/85 text-[1.25rem] leading-[1.8] max-w-[700px] mx-auto font-sans"
        >
          Find support, share your location, and connect with trusted brothers whenever life gets difficult. A premium, high-integrity network built for safety and mental wellbeing.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button 
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto bg-white text-brand-red px-10 py-4 rounded-lg font-heading text-2xl tracking-wider transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] cursor-pointer"
          >
            JOIN THE NETWORK
          </button>
          <button 
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto bg-black text-white border border-white/15 px-10 py-4 rounded-lg font-heading text-2xl tracking-wider transition-all duration-300 hover:scale-105 hover:bg-[#111111] hover:shadow-[0_0_30px_rgba(0,0,0,0.6)] cursor-pointer"
          >
            LEARN MORE
          </button>
        </motion.div>
      </div>
    </section>
  )
}

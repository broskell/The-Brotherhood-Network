import React from 'react'
import { Shield } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] bg-[rgba(255,0,0,0.15)] backdrop-blur-[18px] select-none"
    >
      <div className="flex items-center gap-3">
        <Shield className="w-8 h-8 text-brand-red red-glow-shield animate-pulse" />
        <span className="font-heading text-2xl tracking-widest text-white">THE BROTHERHOOD</span>
      </div>
      
      <nav className="hidden md:flex items-center gap-4 font-sans text-xs tracking-widest font-semibold">
        <a
          href="#mission"
          className="text-white px-3 py-1.5 rounded transition-all duration-300 hover:text-black hover:bg-white"
        >
          MISSION
        </a>
        <a
          href="#features"
          className="text-white px-3 py-1.5 rounded transition-all duration-300 hover:text-black hover:bg-white"
        >
          SYSTEMS
        </a>
        <a
          href="#testimonials"
          className="text-white px-3 py-1.5 rounded transition-all duration-300 hover:text-black hover:bg-white"
        >
          TESTIMONIALS
        </a>
      </nav>

      <button 
        onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
        className="border border-brand-red bg-brand-red/10 text-brand-red px-5 py-2 rounded font-heading text-lg tracking-wider hover:bg-brand-red hover:text-white hover:scale-105 transition-all duration-300 cursor-pointer"
      >
        ENTER CORE
      </button>
    </motion.header>
  )
}

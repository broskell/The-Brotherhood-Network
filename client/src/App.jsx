import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FeatureCards from './components/FeatureCards'
import BackgroundEffects from './components/BackgroundEffects'
import FloatingSosButton from './components/FloatingSosButton'
import { Quote } from 'lucide-react'
import { motion } from 'framer-motion'

function App() {
  return (
    <div className="min-h-screen relative text-brand-text selection:bg-brand-red selection:text-white overflow-x-hidden">
      {/* Background Visual Layers */}
      <BackgroundEffects />

      {/* Global Foreground Wrapper */}
      <div className="relative z-10 flex flex-col justify-between min-h-screen">
        {/* Navbar */}
        <Navbar />

        {/* Hero Section */}
        <Hero />

        {/* Feature Cards Section */}
        <FeatureCards />

        {/* Mission Section */}
        <section id="mission" className="w-full max-w-4xl mx-auto py-20 px-6 text-center select-none">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-heading text-white tracking-widest uppercase">
              THE <span className="text-brand-red">MISSION</span>
            </h2>
            <div className="w-20 h-0.5 bg-brand-red mx-auto"></div>
            
            <p className="text-2xl md:text-4xl font-heading text-white/95 leading-snug tracking-wide max-w-3xl mx-auto italic uppercase">
              "Our mission is to ensure that no man faces danger, loneliness, or crisis alone."
            </p>
          </motion.div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="w-full max-w-5xl mx-auto py-20 px-6 select-none">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-4xl md:text-5xl font-heading text-white tracking-widest uppercase">
              BROTHERS <span className="text-brand-red">TESTIMONIALS</span>
            </h2>
            <div className="w-20 h-0.5 bg-brand-red mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-8 rounded-[24px] bg-black/75 backdrop-blur-[12px] border border-[rgba(255,0,0,0.15)] shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-brand-red/25" />
              <p className="text-white/80 font-sans italic text-sm leading-relaxed mb-6">
                "When my car broke down late at night in a dangerous area, I pressed the SOS button. Within minutes, two brothers from the network arrived to assist. It completely changed how I view community safety."
              </p>
              <h4 className="font-heading text-xl text-white tracking-wider">MARCUS R.</h4>
              <span className="text-xs text-brand-red tracking-widest uppercase">Member since 2024</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-8 rounded-[24px] bg-black/75 backdrop-blur-[12px] border border-[rgba(255,0,0,0.15)] shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-brand-red/25" />
              <p className="text-white/80 font-sans italic text-sm leading-relaxed mb-6">
                "Having a secure place like the Evidence Vault to store legal and personal records, combined with the general support channels, gives me immense peace of mind. It's a lifesaver."
              </p>
              <h4 className="font-heading text-xl text-white tracking-wider">SARATH K.</h4>
              <span className="text-xs text-brand-red tracking-widest uppercase">Member since 2025</span>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/8 py-8 text-center text-xs text-white/55 font-sans tracking-widest select-none">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <span>&copy; {new Date().getFullYear()} THE BROTHERHOOD NETWORK. ALL RIGHTS SECURED.</span>
            <div className="flex gap-6">
              <a href="#terms" className="hover:text-white transition-colors duration-300">TERMS OF PROTOCOL</a>
              <a href="#privacy" className="hover:text-white transition-colors duration-300">PRIVACY PROTOCOL</a>
            </div>
          </div>
        </footer>

        {/* Floating SOS Button */}
        <FloatingSosButton />
      </div>
    </div>
  )
}

export default App



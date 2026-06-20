import React from 'react'
import { motion } from 'framer-motion'
import { Radio, MapPin, Users, MessageSquare, ShieldAlert, Key } from 'lucide-react'

const features = [
  {
    title: 'EMERGENCY SOS',
    description: 'Instantly broadcast emergency alerts to your trusted circle with precise real-time coordinates.',
    icon: Radio,
  },
  {
    title: 'LIVE LOCATION',
    description: 'Share your dynamic location coordinates securely in real-time with trusted circle members.',
    icon: MapPin,
  },
  {
    title: 'TRUSTED CIRCLE',
    description: 'Form high-integrity networks of close brothers you trust to stand by you in moments of crisis.',
    icon: Users,
  },
  {
    title: 'BROTHERHOOD CHAT',
    description: 'Connect with brothers instantly for immediate support, resources, and mental wellbeing checks.',
    icon: MessageSquare,
  },
  {
    title: 'EVIDENCE VAULT',
    description: 'Securely upload photos, videos, and private notes directly to your personal safety vault.',
    icon: Key,
  },
  {
    title: 'NEARBY SUPPORT',
    description: 'Locate and coordinate help with vetted, high-integrity brothers in your immediate vicinity.',
    icon: ShieldAlert,
  },
]

export default function FeatureCards() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  }

  return (
    <div id="features" className="w-full max-w-6xl mx-auto py-20 px-6 relative z-10 select-none">
      <div className="text-center mb-16 space-y-3">
        <h2 className="text-4xl md:text-5xl font-heading text-white tracking-widest">
          TACTICAL <span className="text-brand-red">SYSTEMS</span>
        </h2>
        <div className="w-20 h-0.5 bg-brand-red mx-auto"></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {features.map((feature, idx) => {
          const Icon = feature.icon
          return (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover={{
                y: -10,
                borderColor: '#ff0000',
                boxShadow: '0 0 40px rgba(255,0,0,0.4)',
              }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="p-8 rounded-[24px] bg-black/75 backdrop-blur-[12px] border border-[rgba(255,0,0,0.25)] shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex flex-col justify-between group h-full cursor-default"
            >
              <div>
                <div className="mb-6 flex justify-start">
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 12 }}
                    className="p-3 bg-brand-red/10 rounded-xl"
                  >
                    <Icon
                      className="w-10 h-10 text-brand-red group-hover:text-[#ff0000] transition-colors duration-300"
                      style={{ filter: 'drop-shadow(0 0 15px #ff0000)' }}
                    />
                  </motion.div>
                </div>
                
                <h3 className="font-heading text-2xl text-white tracking-wider mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-white/75 text-sm leading-relaxed font-sans">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}

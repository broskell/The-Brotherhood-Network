import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertOctagon, ShieldAlert, CheckCircle } from 'lucide-react'
import { io } from 'socket.io-client'
import * as sosService from '../services/sos.service'

const BACKEND_URL = 'http://localhost:5000'

export default function FloatingSosButton() {
  const [isPressing, setIsPressing] = useState(false)
  const [progress, setProgress] = useState(0) // 0 to 100
  const [activeSos, setActiveSos] = useState(null) // Holds active SOS record
  const [errorMessage, setErrorMessage] = useState('')

  const timerRef = useRef(null)
  const progressIntervalRef = useRef(null)
  const watchIdRef = useRef(null)
  const socketRef = useRef(null)

  // Clean up watchers and sockets on unmount
  useEffect(() => {
    return () => {
      clearWatchers()
      if (socketRef.current) socketRef.current.disconnect()
    }
  }, [])

  const clearWatchers = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
  }

  // Handle Long Press Start
  const handlePressStart = (e) => {
    e.preventDefault()
    if (activeSos) return // Already in emergency state
    setIsPressing(true)
    setProgress(0)

    const duration = 3000 // 3 seconds
    const intervalTime = 50 // step interval
    const steps = duration / intervalTime
    let currentStep = 0

    progressIntervalRef.current = setInterval(() => {
      currentStep++
      const currentProgress = (currentStep / steps) * 100
      setProgress(currentProgress)

      if (currentStep >= steps) {
        clearInterval(progressIntervalRef.current)
        triggerEmergency()
      }
    }, intervalTime)
  }

  // Handle Long Press Release / Cancel
  const handlePressEnd = () => {
    if (activeSos) return
    setIsPressing(false)
    clearInterval(progressIntervalRef.current)
    setProgress(0)
  }

  // Trigger SOS Protocol
  const triggerEmergency = () => {
    setIsPressing(false)
    setProgress(0)

    if (!navigator.geolocation) {
      setErrorMessage('Geolocation not supported by your browser')
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        try {
          // 1. Call Express API to register alert
          const res = await sosService.createSos(latitude, longitude, 'EMERGENCY ALERT: Long-press triggered.')
          const sosRecord = res.data
          setActiveSos(sosRecord)

          // 2. Connect to Socket.io /sos namespace
          socketRef.current = io(`${BACKEND_URL}/sos`)
          socketRef.current.emit('sos:join', sosRecord.user._id || sosRecord.user)

          // Emit sos:create socket event
          socketRef.current.emit('sos:create', {
            sosId: sosRecord._id,
            userId: sosRecord.user._id || sosRecord.user,
            location: sosRecord.location,
            message: sosRecord.message
          })

          // 3. Initiate location stream
          startLocationStreaming(sosRecord._id)
        } catch (err) {
          console.error(err)
          setErrorMessage('Failed to trigger SOS on server.')
        }
      },
      (error) => {
        setErrorMessage(`Location access denied: ${error.message}`)
      },
      { enableHighAccuracy: true }
    )
  }

  // Stream coordinate changes
  const startLocationStreaming = (sosId) => {
    clearWatchers()

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        try {
          // Stream coordinates to REST API
          await sosService.updateLocation(sosId, latitude, longitude)

          // Stream coordinates via WebSockets
          if (socketRef.current) {
            socketRef.current.emit('sos:updateLocation', {
              sosId,
              coordinates: [longitude, latitude]
            })
          }
        } catch (err) {
          console.error('[SOS Stream] Failed to send coordinates:', err)
        }
      },
      (err) => console.error('[SOS Geolocation] error:', err),
      { enableHighAccuracy: true, distanceFilter: 5 } // Updates every 5 meters
    )
  }

  // Resolve Alert
  const handleResolveAlert = async () => {
    if (!activeSos) return
    try {
      await sosService.resolveSos(activeSos._id)

      if (socketRef.current) {
        socketRef.current.emit('sos:resolve', {
          sosId: activeSos._id,
          resolvedAt: new Date()
        })
        socketRef.current.disconnect()
        socketRef.current = null
      }

      clearWatchers()
      setActiveSos(null)
    } catch (err) {
      console.error(err)
      setErrorMessage('Failed to resolve SOS on server.')
    }
  }

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-center gap-2 select-none">
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-black/90 border border-brand-red px-3 py-1.5 rounded text-xs text-brand-red font-mono text-center max-w-xs"
          >
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative w-24 h-24 flex items-center justify-center">
        {/* Circular loader display */}
        {isPressing && (
          <svg className="absolute inset-0 w-full h-full rotate-270 pointer-events-none">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="rgba(220,38,38,0.2)"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="#ff0000"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={251.2}
              strokeDashoffset={251.2 - (251.2 * progress) / 100}
              strokeLinecap="round"
            />
          </svg>
        )}

        {/* SOS Pulse Glow */}
        {!activeSos && (
          <div className="absolute inset-4 rounded-full bg-red-600/30 animate-ping pointer-events-none"></div>
        )}

        {/* Floating Button */}
        {!activeSos ? (
          <button
            onMouseDown={handlePressStart}
            onMouseUp={handlePressEnd}
            onMouseLeave={handlePressEnd}
            onTouchStart={handlePressStart}
            onTouchEnd={handlePressEnd}
            className={`w-20 h-20 rounded-full flex flex-col items-center justify-center text-white font-heading text-xl shadow-[0_0_40px_rgba(220,38,38,0.8)] hover:scale-105 transition-transform duration-200 cursor-pointer ${
              isPressing ? 'bg-red-700' : 'bg-red-600'
            }`}
          >
            <ShieldAlert className="w-8 h-8 animate-bounce mb-0.5" />
            <span>{isPressing ? 'HOLD' : 'SOS'}</span>
          </button>
        ) : (
          <button
            onDoubleClick={handleResolveAlert}
            className="w-20 h-20 rounded-full bg-green-600 text-white font-heading text-xs flex flex-col items-center justify-center shadow-[0_0_40px_rgba(22,163,74,0.8)] animate-pulse hover:scale-105 cursor-pointer"
            title="Double-click to resolve alert"
          >
            <CheckCircle className="w-8 h-8 mb-0.5" />
            <span>RESOLVE</span>
          </button>
        )}
      </div>

      {activeSos && (
        <span className="text-[10px] text-white/55 font-mono bg-black/60 px-2 py-0.5 rounded tracking-widest animate-pulse uppercase">
          Streaming Coordinates...
        </span>
      )}
    </div>
  )
}

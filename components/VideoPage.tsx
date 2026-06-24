'use client'

import { useEffect, useRef, useState } from 'react'

export default function VideoPage() {
  const bgVideoRef = useRef<HTMLVideoElement>(null)
  const modalVideoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    bgVideoRef.current?.play().catch(() => {})
  }, [])

  // When modal opens, play modal video from start with sound
  useEffect(() => {
    if (modalOpen && modalVideoRef.current) {
      modalVideoRef.current.currentTime = 0
      modalVideoRef.current.muted = false
      modalVideoRef.current.play().catch(() => {})
    }
    if (!modalOpen && modalVideoRef.current) {
      modalVideoRef.current.pause()
    }
  }, [modalOpen])

  // Desktop toggle: just mute/unmute bg video
  const handleDesktopToggle = () => {
    if (!bgVideoRef.current) return
    bgVideoRef.current.muted = !bgVideoRef.current.muted
    setMuted(bgVideoRef.current.muted)
  }

  // Mobile/tablet: unmute opens modal, mute closes it
  const handleMobileToggle = () => {
    if (muted) {
      setModalOpen(true)
      setMuted(false)
    } else {
      setModalOpen(false)
      setMuted(true)
    }
  }

  const closeModal = () => {
    setModalOpen(false)
    setMuted(true)
  }

  const handleToggle = isMobile ? handleMobileToggle : handleDesktopToggle

  // Mute icon
  const MuteIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
    </svg>
  )

  const UnmuteIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
    </svg>
  )

  return (
    <>
      {/* Background video — always playing silently */}
      <div className="video-page">
        <video
          ref={bgVideoRef}
          src="/landing_Animation.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      </div>

      {/* Mute/Unmute button — bottom right */}
      <button
        className="mute-btn"
        onClick={handleToggle}
        aria-label={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? <MuteIcon /> : <UnmuteIcon />}
        {muted ? 'WATCH' : 'CLOSE'}
      </button>

      {/* Mobile/Tablet modal — opens when UNMUTE is clicked */}
      {modalOpen && (
        <div className="video-modal-overlay" onClick={closeModal}>
          <div className="video-modal-inner" onClick={(e) => e.stopPropagation()}>
            <button className="video-modal-close" onClick={closeModal} aria-label="Close">
              ✕
            </button>
            <video
              ref={modalVideoRef}
              src="/landing_Animation.mp4"
              controls
              playsInline
              className="video-modal-player"
            />
          </div>
        </div>
      )}
    </>
  )
}

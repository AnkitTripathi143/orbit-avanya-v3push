'use client'

import { useEffect, useRef, useState } from 'react'

export default function VideoPage() {
  const bgVideoRef   = useRef<HTMLVideoElement>(null)
  const modalVideoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted]       = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalVisible, setModalVisible] = useState(false) // controls CSS class for transition
  const [isMobile, setIsMobile]   = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    bgVideoRef.current?.play().catch(() => {})
  }, [])

  // Open modal: mount first, then add visible class on next frame for CSS transition
  const openModal = () => {
    setModalOpen(true)
    setMuted(false)
    // tiny delay so the DOM is painted before the transition triggers
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setModalVisible(true))
    })
  }

  // Close modal: remove visible class first, then unmount after transition ends
  const closeModal = () => {
    setModalVisible(false)
    setMuted(true)
    setTimeout(() => setModalOpen(false), 380) // matches CSS transition duration
  }

  // Play/pause modal video based on visibility
  useEffect(() => {
    if (!modalVideoRef.current) return
    if (modalVisible) {
      modalVideoRef.current.currentTime = 0
      modalVideoRef.current.muted = false
      modalVideoRef.current.play().catch(() => {})
    } else {
      modalVideoRef.current.pause()
    }
  }, [modalVisible])

  // Desktop: directly mute/unmute bg video
  const handleDesktopToggle = () => {
    if (!bgVideoRef.current) return
    bgVideoRef.current.muted = !bgVideoRef.current.muted
    setMuted(bgVideoRef.current.muted)
  }

  const handleToggle = isMobile
    ? () => (muted ? openModal() : closeModal())
    : handleDesktopToggle

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
      {/* Background video — always playing silently, properly responsive */}
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

      {/* Mute/Unmute button */}
      <button
        className="mute-btn"
        onClick={handleToggle}
        aria-label={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? <MuteIcon /> : <UnmuteIcon />}
        {muted ? 'UNMUTE' : 'MUTE'}
      </button>

      {/* Modal — always mounted when open, visibility drives CSS transition */}
      {modalOpen && (
        <div
          className={`video-modal-overlay${modalVisible ? ' is-visible' : ''}`}
          onClick={closeModal}
        >
          <div
            className={`video-modal-inner${modalVisible ? ' is-visible' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
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

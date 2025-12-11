import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import pocScreenshot from '../assets/poc-screenshots/poc-main.jpeg'

const documents = [
  { pages: 47, name: 'MSA' },
  { pages: 23, name: 'DPA' },
  { pages: 12, name: 'SOW' },
  { pages: 31, name: 'Term Sheet' },
  { pages: 58, name: 'Vendor Agreement' },
  { pages: 64, name: 'Partnership Agreement' },
  { pages: 8, name: 'SLA' },
]

// Get color based on page count (green → yellow → orange → red)
// Steep curve: 8 pages is fine, 12+ is already concerning, 20+ is red
function getPageColor(pages: number): string {
  const minPages = 8
  const dangerPages = 20 // Already deep orange/red by this point
  // Normalize to 0-1 range with steep curve
  const t = Math.min(1, Math.max(0, (pages - minPages) / (dangerPages - minPages)))
  // Apply power curve to make it steeper (reaches red faster)
  const curved = Math.pow(t, 0.5)
  // HSL: green (120) → yellow (60) → orange (30) → red (0)
  const hue = Math.round(120 - (curved * 120))
  return `hsl(${hue}, 85%, 42%)`
}

// Hotspots for the POC screenshot - positions as percentages
// These define where the hotspot dot appears AND where to zoom
const hotspots = [
  { id: 'structure', label: 'Document Structure', x: 12, y: 50, zoomX: 0, description: 'Navigate definitions, clauses, and sections' },
  { id: 'content', label: 'Smart Highlights', x: 48, y: 50, zoomX: 35, description: 'Key terms and definitions highlighted inline' },
  { id: 'intelligence', label: 'AI in the loop', x: 88, y: 50, zoomX: 100, description: 'AI-powered analysis and suggestions' },
]

export function Hero() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [docIndex, setDocIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 })
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null)

  const openWithHotspot = (hotspotId: string) => {
    const hotspot = hotspots.find(h => h.id === hotspotId)
    if (hotspot) {
      setZoomOrigin({ x: hotspot.zoomX, y: 50 })
      setZoomLevel(2.5)
      setActiveHotspot(hotspotId)
      setLightboxOpen(true)
    }
  }

  const openFullView = () => {
    setZoomOrigin({ x: 50, y: 50 })
    setZoomLevel(1)
    setActiveHotspot(null)
    setLightboxOpen(true)
  }

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation()
    if (zoomLevel >= 2.5) {
      closeLightbox()
    } else {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      setZoomOrigin({ x, y })
      setZoomLevel(prev => Math.min(prev + 1, 3))
    }
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    setZoomLevel(1)
    setZoomOrigin({ x: 50, y: 50 })
    setActiveHotspot(null)
  }

  // Cycle through documents
  useEffect(() => {
    const interval = setInterval(() => {
      setDocIndex((prev) => (prev + 1) % documents.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)
    // Placeholder - will wire up actual endpoint later
    await new Promise(resolve => setTimeout(resolve, 500))
    setSubmitted(true)
    setIsSubmitting(false)
  }

  return (
    <section className="pt-32 pb-20 px-6" id="waitlist">
      <div className="max-w-5xl mx-auto text-center">
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-clash text-4xl sm:text-5xl lg:text-6xl font-semibold text-text-primary leading-tight"
        >
          <span className="block">That sinking feeling when a</span>
          <span className="block">
            <AnimatePresence mode="wait">
              <motion.span
                key={`${documents[docIndex].pages}-${documents[docIndex].name}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="inline-block"
              >
                <span style={{ color: getPageColor(documents[docIndex].pages) }}>
                  {documents[docIndex].pages}-page
                </span>{' '}
                {documents[docIndex].name}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="block">lands in your inbox.</span>
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-8 text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-[1.75]"
        >
          You're a founder, not a paralegal.
          <br />
          Yet here you are at 11 PM, drowning in legalese, hoping you don't accidentally sign away your company.
          <br />
          <br />
          The way we handle legal documents is broken.
          <br />
          <span className="text-accent font-bold">It's time for a fix.</span>
        </motion.p>

        {/* CTA Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12"
        >
          {submitted ? (
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-accent-subtle rounded-xl">
              <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-accent font-medium">You're on the list. We'll be in touch.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@startup.com"
                className="w-full sm:w-64 px-4 py-3 text-base bg-bg-card border border-border rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-3 text-base font-medium bg-accent text-white rounded-xl hover:bg-accent-hover transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {isSubmitting ? 'Joining...' : 'Join the Waitlist'}
              </button>
            </form>
          )}
          <p className="mt-4 text-sm text-text-secondary">
            Early access launching early 2026. No spam. No BS.
          </p>
        </motion.div>

      </div>

      {/* POC Screenshot - Full width, overlaps next section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-20 relative px-4 sm:px-6 lg:px-8 -mb-32 sm:-mb-48 lg:-mb-64 z-10"
      >
        {/* Ambient glow */}
        <div className="absolute inset-0 bg-linear-to-b from-accent/20 to-transparent blur-3xl -z-10 scale-110" />

        {/* Screenshot container */}
        <div className="relative max-w-7xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl shadow-accent/10 bg-bg-card group">
            <img
              src={pocScreenshot}
              alt="LexLoop interface showing contract analysis with semantic extraction and AI insights"
              className="w-full h-auto"
            />

            {/* Hotspot indicators - hidden on mobile, shown on desktop */}
            <div className="hidden sm:block">
              {hotspots.map((hotspot) => (
                <button
                  key={hotspot.id}
                  onClick={() => openWithHotspot(hotspot.id)}
                  className="absolute group/hotspot"
                  style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%`, transform: 'translate(-50%, -50%)' }}
                  aria-label={`View ${hotspot.label}`}
                >
                  {/* Pulse ring */}
                  <span className="absolute inset-0 w-8 h-8 -m-4 rounded-full bg-accent/30 animate-ping" />
                  {/* Hotspot dot */}
                  <span className="relative flex items-center justify-center w-8 h-8 rounded-full bg-accent text-white shadow-lg cursor-pointer hover:scale-110 transition-transform">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </span>
                  {/* Tooltip */}
                  <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-1.5 bg-zinc-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover/hotspot:opacity-100 transition-opacity pointer-events-none">
                    {hotspot.label}
                    <span className="absolute left-1/2 -translate-x-1/2 top-full border-4 border-transparent border-t-zinc-900" />
                  </span>
                </button>
              ))}
            </div>

            {/* View details button - always visible on mobile */}
            <button
              onClick={openFullView}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 sm:opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-text-primary font-medium text-sm sm:text-base cursor-pointer"
              aria-label="View in details"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View in details
            </button>
          </div>
        </div>
      </motion.div>

      {/* Lightbox modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Image container */}
            <motion.div
              className="relative cursor-pointer rounded-lg overflow-hidden shadow-2xl"
              style={{
                width: zoomLevel > 1 ? `${90 * zoomLevel}vw` : '90vw',
                height: zoomLevel > 1 ? `${90 * zoomLevel}vh` : '90vh',
                maxWidth: zoomLevel > 1 ? 'none' : '90vw',
                maxHeight: zoomLevel > 1 ? 'none' : '90vh',
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onClick={closeLightbox}
            >
              <img
                src={pocScreenshot}
                alt="LexLoop interface - full size"
                className="w-full h-full"
                style={{
                  objectFit: zoomLevel > 1 ? 'cover' : 'contain',
                  objectPosition: zoomLevel > 1 ? `${zoomOrigin.x}% ${zoomOrigin.y}%` : 'center',
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleImageClick(e)
                }}
              />
            </motion.div>

            {/* Zoom indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm flex items-center gap-2">
              {activeHotspot ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  {hotspots.find(h => h.id === activeHotspot)?.label} — tap anywhere to close
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                  {zoomLevel === 1 ? 'Tap image to zoom' : 'Tap anywhere to close'}
                </>
              )}
            </div>

            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

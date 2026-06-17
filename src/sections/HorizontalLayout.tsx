import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Navbar } from '../components/Navbar'
import { useUi } from '../context/UiContext'
import { useHorizontalLenis } from '../hooks/useHorizontalLenis'
import { AboutMePanel } from '../panels/AboutMePanel'
import { ContactPanel } from '../panels/ContactPanel'
import { WorksGalleryPanel } from '../panels/WorksGalleryPanel'
import { HeroSection } from './HeroSection'

const VIEWPORT_COUNT = 4
const WORKS_LOCK_RATIO = 0.92
const WORKS_SNAP_RATIO = 0.35

interface WorksOverlap {
  ratio: number
  enteringFromAbout: boolean
  enteringFromContact: boolean
}

/**
 * Full-page horizontal scroll layout wrapping hero and all content panels.
 */
export function HorizontalLayout() {
  const {
    overlayOpen,
    worksLocked,
    setWorksLocked,
    worksScrollState,
    worksPanelRef,
  } = useUi()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const overlayOpenRef = useRef(overlayOpen)
  const worksLockedRef = useRef(worksLocked)
  const worksScrollStateRef = useRef(worksScrollState)
  const exitingWorksRef = useRef(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [heroActive, setHeroActive] = useState(true)

  const handleProgress = useCallback((progress: number) => {
    setScrollProgress(progress)
    setHeroActive(progress < 0.1)
  }, [])

  const lenisRef = useHorizontalLenis(wrapperRef, contentRef, handleProgress)

  /**
   * Measures how much of the Works panel overlaps the horizontal viewport.
   */
  function getWorksOverlap(): WorksOverlap | null {
    const worksPanel = worksPanelRef.current
    const wrapper = wrapperRef.current
    if (!worksPanel || !wrapper) return null

    const worksRect = worksPanel.getBoundingClientRect()
    const wrapperRect = wrapper.getBoundingClientRect()
    const overlapLeft = Math.max(worksRect.left, wrapperRect.left)
    const overlapRight = Math.min(worksRect.right, wrapperRect.right)
    const overlapWidth = Math.max(0, overlapRight - overlapLeft)
    const ratio = overlapWidth / worksRect.width

    return {
      ratio,
      enteringFromAbout: worksRect.left > wrapperRect.left + 8,
      enteringFromContact: worksRect.right < wrapperRect.right - 8,
    }
  }

  /**
   * Snaps horizontal scroll to the Works panel.
   */
  function snapToWorks() {
    const worksElement = document.getElementById('works')
    if (worksElement) {
      lenisRef.current?.scrollTo(worksElement, { lock: true })
    }
  }

  /**
   * Snaps horizontal scroll to the About panel.
   */
  function snapToAbout() {
    const aboutElement = document.getElementById('about')
    if (aboutElement) {
      lenisRef.current?.scrollTo(aboutElement, { lock: true })
    }
  }

  /**
   * Snaps horizontal scroll to the Contact panel.
   */
  function snapToContact() {
    const contactElement = document.getElementById('contact')
    if (contactElement) {
      lenisRef.current?.scrollTo(contactElement, { lock: true })
    }
  }

  /**
   * Resolves a partial Works overlap toward the nearest intended full panel.
   */
  function settleWorksBoundary(scrollDirection: 'forward' | 'backward' | 'idle') {
    if (worksLockedRef.current || overlayOpenRef.current || exitingWorksRef.current) return

    const overlap = getWorksOverlap()
    if (!overlap || overlap.ratio <= 0 || overlap.ratio >= WORKS_LOCK_RATIO) return

    if (overlap.ratio >= 0.5 || scrollDirection === 'forward' && overlap.enteringFromAbout) {
      snapToWorks()
      return
    }

    if (scrollDirection === 'backward' && overlap.enteringFromContact) {
      snapToWorks()
      return
    }

    if (overlap.enteringFromAbout) {
      snapToAbout()
      return
    }

    if (overlap.enteringFromContact) {
      snapToContact()
    }
  }

  useEffect(() => {
    overlayOpenRef.current = overlayOpen
    if (overlayOpen) {
      lenisRef.current?.stop()
    } else if (!worksLockedRef.current) {
      lenisRef.current?.start()
    }
  }, [overlayOpen, lenisRef])

  useEffect(() => {
    worksLockedRef.current = worksLocked
    if (worksLocked && !overlayOpenRef.current) {
      lenisRef.current?.stop()
    } else if (!worksLocked && !overlayOpenRef.current) {
      lenisRef.current?.start()
    }
  }, [worksLocked, lenisRef])

  useEffect(() => {
    worksScrollStateRef.current = worksScrollState
  }, [worksScrollState])

  useEffect(() => {
    const worksPanel = worksPanelRef.current
    if (!worksPanel) return

    /**
     * Completes Works snap at 35% visibility and locks vertical scroll only at full alignment.
     */
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry || overlayOpenRef.current || exitingWorksRef.current) return

        const ratio = entry.intersectionRatio

        if (ratio >= WORKS_SNAP_RATIO && ratio < WORKS_LOCK_RATIO) {
          snapToWorks()
          return
        }

        if (ratio >= WORKS_LOCK_RATIO) {
          snapToWorks()
          lenisRef.current?.stop()
          setWorksLocked(true)
          return
        }

        if (worksLockedRef.current && ratio < WORKS_LOCK_RATIO - 0.05) {
          setWorksLocked(false)
          if (!overlayOpenRef.current) {
            lenisRef.current?.start()
          }
        }
      },
      {
        root: wrapperRef.current,
        threshold: [0, WORKS_SNAP_RATIO, 0.5, WORKS_LOCK_RATIO],
      },
    )

    observer.observe(worksPanel)

    return () => observer.disconnect()
  }, [lenisRef, setWorksLocked, worksPanelRef])

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    let settleTimer = 0
    let lastScrollDirection: 'forward' | 'backward' | 'idle' = 'idle'

    /**
     * Routes wheel input between horizontal layout scroll and vertical works column.
     */
    function handleWheel(event: WheelEvent) {
      if (overlayOpenRef.current) return
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return

      const scrollingDown = event.deltaY > 0
      const scrollingUp = event.deltaY < 0

      if (worksLockedRef.current) {
        const overlap = getWorksOverlap()
        if (overlap && overlap.ratio < WORKS_LOCK_RATIO - 0.05) {
          setWorksLocked(false)
          lenisRef.current?.start()
        }

        const { atTop, atBottom } = worksScrollStateRef.current

        if (atBottom && scrollingDown) {
          event.preventDefault()
          exitingWorksRef.current = true
          setWorksLocked(false)
          lenisRef.current?.start()
          snapToContact()
          window.setTimeout(() => {
            exitingWorksRef.current = false
          }, 900)
          return
        }

        if (atTop && scrollingUp) {
          event.preventDefault()
          exitingWorksRef.current = true
          setWorksLocked(false)
          lenisRef.current?.start()
          snapToAbout()
          window.setTimeout(() => {
            exitingWorksRef.current = false
          }, 900)
          return
        }

        return
      }

      event.preventDefault()

      if (scrollingDown) {
        lastScrollDirection = 'forward'
      } else if (scrollingUp) {
        lastScrollDirection = 'backward'
      }

      const overlap = getWorksOverlap()
      if (overlap && overlap.ratio > 0 && overlap.ratio < WORKS_LOCK_RATIO) {
        if (scrollingDown && overlap.enteringFromAbout && overlap.ratio >= WORKS_SNAP_RATIO) {
          snapToWorks()
          return
        }

        if (scrollingUp && overlap.enteringFromContact && overlap.ratio >= WORKS_SNAP_RATIO) {
          snapToWorks()
          return
        }
      }

      if (settleTimer) {
        window.clearTimeout(settleTimer)
      }

      settleTimer = window.setTimeout(() => {
        settleWorksBoundary(lastScrollDirection)
        lastScrollDirection = 'idle'
        settleTimer = 0
      }, 140)
    }

    window.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
      window.removeEventListener('wheel', handleWheel)
      if (settleTimer) {
        window.clearTimeout(settleTimer)
      }
    }
  }, [lenisRef, setWorksLocked, worksPanelRef])

  const progressMotion = useMotionValue(0)
  const progressSpring = useSpring(progressMotion, { stiffness: 120, damping: 28 })

  useEffect(() => {
    progressMotion.set(scrollProgress)
  }, [scrollProgress, progressMotion])

  const indicatorScale = useTransform(progressSpring, [0, 1], [0, 1])

  return (
    <>
      <Navbar />
      <div ref={wrapperRef} className="h-dvh w-full overflow-hidden">
        <div ref={contentRef} className="flex h-full w-max">
          <HeroSection canvasActive={heroActive} />
          <AboutMePanel />
          <WorksGalleryPanel />
          <ContactPanel />
        </div>
      </div>

      <div className="pointer-events-none fixed right-6 bottom-8 left-6 z-40 md:right-12 md:left-12 lg:right-16 lg:left-16">
        <div className="mb-3 flex justify-between text-[10px] tracking-[0.3em] text-white/30 uppercase">
          <span>{worksLocked ? 'Scroll ↕' : 'Scroll →'}</span>
          <span>0{VIEWPORT_COUNT}</span>
        </div>
        <div className="h-px w-full bg-white/10">
          <motion.div
            className="h-full w-full origin-left bg-[#e8702a]"
            style={{ scaleX: indicatorScale }}
          />
        </div>
      </div>
    </>
  )
}

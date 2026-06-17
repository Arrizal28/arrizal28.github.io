import Lenis from '@studio-freight/lenis'
import { useEffect, useRef, type RefObject } from 'react'

interface VerticalLenisCallbacks {
  onProgress?: (progress: number) => void
  onScroll?: (scroll: number, limit: number) => void
}

/**
 * Initializes Lenis vertical smooth scrolling on a wrapper and content pair.
 */
export function useVerticalLenis(
  wrapperRef: RefObject<HTMLDivElement | null>,
  contentRef: RefObject<HTMLDivElement | null>,
  callbacks?: VerticalLenisCallbacks,
) {
  const lenisRef = useRef<Lenis | null>(null)
  const callbacksRef = useRef(callbacks)

  useEffect(() => {
    callbacksRef.current = callbacks
  }, [callbacks])

  useEffect(() => {
    const wrapper = wrapperRef.current
    const content = contentRef.current
    if (!wrapper || !content) return

    const lenis = new Lenis({
      wrapper,
      content,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    lenisRef.current = lenis

    /**
     * Forwards scroll progress and position to optional callbacks.
     */
    function handleScroll({ progress, scroll, limit }: { progress: number; scroll: number; limit: number }) {
      callbacksRef.current?.onProgress?.(progress)
      callbacksRef.current?.onScroll?.(scroll, limit)
    }

    lenis.on('scroll', handleScroll)

    let frameId = 0

    /**
     * Advances Lenis on each animation frame.
     */
    function raf(time: number) {
      lenis.raf(time)
      frameId = requestAnimationFrame(raf)
    }

    frameId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frameId)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [wrapperRef, contentRef])

  return lenisRef
}

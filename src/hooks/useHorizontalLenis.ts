import Lenis from '@studio-freight/lenis'
import { useEffect, useRef, type RefObject } from 'react'

/**
 * Initializes Lenis horizontal smooth scrolling on a wrapper and content pair.
 */
export function useHorizontalLenis(
  wrapperRef: RefObject<HTMLDivElement | null>,
  contentRef: RefObject<HTMLDivElement | null>,
  onProgress?: (progress: number) => void,
  active = true,
) {
  const lenisRef = useRef<Lenis | null>(null)
  const onProgressRef = useRef(onProgress)

  useEffect(() => {
    onProgressRef.current = onProgress
  }, [onProgress])

  useEffect(() => {
    if (!active) return

    const wrapper = wrapperRef.current
    const content = contentRef.current
    if (!wrapper || !content) return

    const lenis = new Lenis({
      wrapper,
      content,
      orientation: 'horizontal',
      gestureOrientation: 'both',
      smoothWheel: true,
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    lenisRef.current = lenis

    /**
     * Forwards scroll progress to the optional callback.
     */
    function handleScroll({ progress }: { progress: number }) {
      onProgressRef.current?.(progress)
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
  }, [wrapperRef, contentRef, active])

  return lenisRef
}

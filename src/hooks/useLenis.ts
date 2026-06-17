import Lenis from '@studio-freight/lenis'
import { useEffect } from 'react'

/**
 * Initializes Lenis smooth scrolling and wires it to the browser animation frame loop.
 */
export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    })

    document.documentElement.classList.add('lenis', 'lenis-smooth')

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
      document.documentElement.classList.remove('lenis', 'lenis-smooth')
      lenis.destroy()
    }
  }, [])
}

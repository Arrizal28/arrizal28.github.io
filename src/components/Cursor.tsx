import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useUi } from '../context/UiContext'

/**
 * Custom cursor dot that follows the pointer and scales up over interactive elements.
 */
export function Cursor() {
  const { menuOpen } = useUi()
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const [isHovering, setIsHovering] = useState(false)
  const [isEnabled, setIsEnabled] = useState(false)

  const springConfig = { damping: 28, stiffness: 380, mass: 0.35 }
  const x = useSpring(cursorX, springConfig)
  const y = useSpring(cursorY, springConfig)
  const scale = useSpring(isHovering && !menuOpen ? 2 : menuOpen ? 1.6 : 1, springConfig)

  useEffect(() => {
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches
    setIsEnabled(hasFinePointer)
    if (!hasFinePointer) return

    /**
     * Updates cursor position from pointer events.
     */
    function handlePointerMove(event: PointerEvent) {
      cursorX.set(event.clientX)
      cursorY.set(event.clientY)
    }

    /**
     * Enlarges the cursor when hovering clickable or interactive targets.
     */
    function handlePointerOver(event: PointerEvent) {
      const target = event.target as HTMLElement
      if (target.closest('[data-cursor-ignore]')) {
        setIsHovering(false)
        return
      }
      const interactive = target.closest('a, button, [data-cursor-hover]')
      setIsHovering(Boolean(interactive))
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerover', handlePointerOver)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerover', handlePointerOver)
    }
  }, [cursorX, cursorY])

  if (!isEnabled) return null

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0"
      style={{
        x,
        y,
        scale,
        zIndex: menuOpen ? 10001 : 9999,
      }}
    >
      <div
        className={`-translate-x-1/2 -translate-y-1/2 rounded-full ${
          menuOpen
            ? 'h-3 w-3 bg-[#e8702a] shadow-[0_0_0_2px_#fff,0_0_12px_rgba(232,112,42,0.6)]'
            : isHovering
              ? 'h-2.5 w-2.5 bg-[#e8702a] shadow-[0_0_8px_rgba(232,112,42,0.5)]'
              : 'h-2.5 w-2.5 border border-white/40 bg-white shadow-[0_0_6px_rgba(255,255,255,0.4)]'
        }`}
      />
    </motion.div>
  )
}

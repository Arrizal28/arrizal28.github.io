import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  strength?: number
  onClick?: () => void
  'aria-label'?: string
}

/**
 * Wraps children with a magnetic pull effect that follows the cursor on hover.
 */
export function MagneticButton({
  children,
  className = '',
  strength = 0.35,
  onClick,
  'aria-label': ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 20, mass: 0.2 })
  const springY = useSpring(y, { stiffness: 300, damping: 20, mass: 0.2 })

  /**
   * Calculates offset from button center toward the pointer position.
   */
  function handlePointerMove(event: React.PointerEvent<HTMLButtonElement>) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const offsetX = event.clientX - (rect.left + rect.width / 2)
    const offsetY = event.clientY - (rect.top + rect.height / 2)
    x.set(offsetX * strength)
    y.set(offsetY * strength)
  }

  /**
   * Resets magnetic offset when the pointer leaves the button.
   */
  function handlePointerLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={ref}
      type="button"
      aria-label={ariaLabel}
      className={`text-white ${className}`}
      style={{ x: springX, y: springY }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      data-cursor-ignore=""
    >
      {children}
    </motion.button>
  )
}

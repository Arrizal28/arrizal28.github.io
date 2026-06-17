import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface AnimatedTextProps {
  children: ReactNode
  className?: string
  delay?: number
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
}

const lineVariants = {
  hidden: {
    y: '110%',
  },
  visible: {
    y: '0%',
    transition: {
      duration: 1,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
}

/**
 * Reveals text lines from bottom to top using a mask and staggered motion.
 */
export function AnimatedText({ children, className = '', delay = 0 }: AnimatedTextProps) {
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </motion.div>
  )
}

interface AnimatedLineProps {
  children: ReactNode
  className?: string
}

/**
 * Single masked line used inside AnimatedText for per-line reveal animation.
 */
export function AnimatedLine({ children, className = '' }: AnimatedLineProps) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div variants={lineVariants}>{children}</motion.div>
    </div>
  )
}

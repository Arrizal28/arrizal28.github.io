import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useRef, type RefObject } from 'react'

interface ScrollTextRevealProps {
  text: string
  className?: string
  containerRef?: RefObject<HTMLElement | null>
  scrollProgress?: MotionValue<number>
}

interface WordRevealProps {
  word: string
  index: number
  total: number
  scrollProgress: MotionValue<number>
}

/**
 * Reveals one word based on shared scroll progress across the parent section.
 */
function WordReveal({ word, index, total, scrollProgress }: WordRevealProps) {
  const wordStart = index / total
  const wordEnd = Math.min((index + 2) / total, 1)
  const opacity = useTransform(scrollProgress, [wordStart, wordEnd], [0.2, 1])

  return (
    <motion.span className="inline" style={{ opacity }}>
      {word}
      {index < total - 1 ? '\u00A0' : ''}
    </motion.span>
  )
}

/**
 * Splits paragraph text and reveals each word on scroll with staggered opacity.
 */
export function ScrollTextReveal({
  text,
  className = '',
  containerRef,
  scrollProgress: externalProgress,
}: ScrollTextRevealProps) {
  const localRef = useRef<HTMLParagraphElement>(null)
  const targetRef = containerRef ?? localRef
  const words = text.split(' ').filter(Boolean)

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start 0.85', 'end 0.35'],
  })

  const scrollProgress = externalProgress ?? scrollYProgress

  return (
    <p ref={containerRef ? undefined : localRef} className={className}>
      {words.map((word, index) => (
        <WordReveal
          key={`${word}-${index}`}
          word={word}
          index={index}
          total={words.length}
          scrollProgress={scrollProgress}
        />
      ))}
    </p>
  )
}

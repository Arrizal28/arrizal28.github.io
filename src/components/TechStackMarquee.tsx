import { motion } from 'framer-motion'

const MARQUEE_TEXT =
  'FLUTTER ARCHITECTURE — SWIFT & KOTLIN — CLEAN CODE — AI INTEGRATION — PERFORMANCE OPTIMIZATION — UI/UX SYSTEMS — '

/**
 * Infinite neon-outlined marquee showcasing the tech stack with glow on hover.
 */
export function TechStackMarquee() {
  return (
    <div className="marquee-group overflow-hidden border-t border-white/10 py-6 md:py-8">
      <motion.div
        className="flex w-max whitespace-nowrap"
        animate={{ x: ['0%', '-33.333%'] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: 28,
            ease: 'linear',
          },
        }}
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <span
            key={index}
            className="font-clash tech-marquee-neon px-4 text-3xl font-medium uppercase md:text-5xl lg:text-6xl"
          >
            {MARQUEE_TEXT}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

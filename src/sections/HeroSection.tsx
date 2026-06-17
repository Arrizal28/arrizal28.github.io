import { motion } from 'framer-motion'
import { AnimatedLine, AnimatedText } from '../components/AnimatedText'
import { HeroCanvas } from '../components/HeroCanvas'

interface HeroSectionProps {
  canvasActive?: boolean
}

/**
 * First horizontal panel with 3D background, mask-reveal headline, and meta info.
 */
export function HeroSection({ canvasActive = true }: HeroSectionProps) {
  return (
    <section className="relative h-dvh w-screen shrink-0 overflow-hidden border-r border-white/10">
      <div className="absolute inset-0 z-10">
        <HeroCanvas active={canvasActive} />
      </div>

      <div className="pointer-events-none absolute top-1/2 left-6 z-30 -translate-y-1/2 md:left-12 lg:left-16">
        <AnimatedText>
          <AnimatedLine>
            <h1 className="font-clash text-[14vw] leading-[0.85] font-bold tracking-tight uppercase">
              ENGINEERING
            </h1>
          </AnimatedLine>
          <AnimatedLine>
            <h1 className="font-clash text-[14vw] leading-[0.85] font-bold tracking-tight uppercase">
              FLUIDITY.
            </h1>
          </AnimatedLine>
        </AnimatedText>
      </div>

      <div className="absolute bottom-10 left-6 z-30 flex flex-col gap-6 md:left-12 md:flex-row md:gap-24 lg:left-16">
        <p className="text-sm font-light tracking-wide uppercase opacity-80">Location // West Java, ID</p>
        <p className="text-sm font-light tracking-wide uppercase opacity-80">
          Focus // Mobile Architecture & UI/UX
        </p>
        <motion.p
          className="text-sm font-light tracking-wide text-[#e8702a] uppercase"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          Scroll → to explore
        </motion.p>
      </div>
    </section>
  )
}

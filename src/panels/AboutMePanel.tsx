import { motion } from 'framer-motion'
import { AnimatedLine, AnimatedText } from '../components/AnimatedText'
import { TechStackMarquee } from '../components/TechStackMarquee'

const ABOUT_LINES = [
  'Software & Mobile Engineer',
  'West Java, Indonesia',
  'Native UX · Clean Architecture',
]

/**
 * About Me panel mirroring hero layout with improved typography hierarchy.
 */
export function AboutMePanel() {
  return (
    <section
      id="about"
      className="relative flex h-dvh w-screen shrink-0 flex-col overflow-hidden border-r border-white/10 bg-[#050505]"
    >
      <div className="relative flex flex-1 flex-col">
        <div className="pointer-events-none absolute top-1/2 left-6 z-10 -translate-y-1/2 md:left-12 lg:left-16">
          <motion.span
            className="mb-6 block font-mono text-[10px] tracking-[0.35em] text-[#e8702a] uppercase"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            02 — About
          </motion.span>

          <AnimatedText>
            <AnimatedLine>
              <h2 className="font-clash text-[14vw] leading-[0.85] font-bold tracking-tight uppercase">
                ABOUT
              </h2>
            </AnimatedLine>
            <AnimatedLine>
              <h2 className="font-clash text-[14vw] leading-[0.85] font-bold tracking-tight text-white/20 uppercase">
                ARRIZAL.
              </h2>
            </AnimatedLine>
          </AnimatedText>
        </div>

        <motion.div
          className="absolute top-1/2 right-6 z-10 max-w-xs -translate-y-1/2 md:right-12 md:max-w-sm lg:right-16 lg:max-w-md"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-sm leading-relaxed font-light text-white/55 md:text-base md:leading-relaxed">
            I build scalable mobile architectures and craft interfaces that feel completely native,
            fast, and alive — from Flutter ecosystems to native Swift & Kotlin stacks.
          </p>

          <div className="mt-8 space-y-3 border-t border-white/10 pt-8">
            {ABOUT_LINES.map((line) => (
              <p key={line} className="text-xs tracking-widest text-white/40 uppercase md:text-sm">
                {line}
              </p>
            ))}
          </div>
        </motion.div>

        <div className="pointer-events-none absolute bottom-28 left-6 z-10 md:bottom-32 md:left-12 lg:left-16">
          <p className="max-w-md text-xs leading-relaxed font-light tracking-wide text-white/30 uppercase md:text-sm">
            Crafting digital experiences with obsessive attention to performance and feel.
          </p>
        </div>
      </div>

      <div className="relative z-20 shrink-0">
        <TechStackMarquee />
      </div>
    </section>
  )
}

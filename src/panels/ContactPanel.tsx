import { motion } from 'framer-motion'

const SOCIAL_LINKS = [
  { label: 'GitHub', href: '#' },
  { label: 'LinkedIn', href: '#' },
  { label: 'Twitter', href: '#' },
  { label: 'Dribbble', href: '#' },
]

/**
 * Full-viewport contact panel closing the horizontal scroll experience.
 */
export function ContactPanel() {
  return (
    <footer
      id="contact"
      className="panel-content-inset relative flex h-dvh w-screen shrink-0 flex-col justify-between overflow-hidden bg-[#050505] py-20 md:py-24 lg:py-28"
    >
      <div className="flex items-start justify-between pt-20 md:pt-24">
        <span className="font-mono text-xs tracking-widest text-[#e8702a] uppercase">04 — Contact</span>
        <span className="text-xs tracking-widest text-white/30 uppercase">West Java, ID</span>
      </div>

      <div className="flex flex-col gap-14 md:flex-row md:items-end md:justify-between md:gap-16">
        <div className="max-w-4xl">
          <p className="mb-6 text-sm tracking-widest text-white/40 uppercase">Let&apos;s build something</p>
          <a
            href="mailto:hello@arrizal.dev"
            className="font-clash text-[8vw] leading-[0.9] font-bold uppercase transition-colors hover:text-[#e8702a] md:text-6xl lg:text-7xl"
            data-cursor-hover=""
          >
            hello@arrizal.dev
          </a>
        </div>

        <div className="grid shrink-0 grid-cols-2 gap-x-10 gap-y-6 md:gap-x-12 md:gap-y-8">
          {SOCIAL_LINKS.map((link, index) => (
            <motion.a
              key={link.label}
              href={link.href}
              className="text-sm tracking-widest text-white/50 uppercase transition-colors hover:text-[#e8702a]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              data-cursor-hover=""
            >
              {link.label}
            </motion.a>
          ))}
        </div>
      </div>

      <motion.p
        className="font-clash pointer-events-none pb-2 text-[16vw] leading-none font-bold tracking-tight text-white/4 uppercase md:text-[10vw]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        ARRIZAL
      </motion.p>
    </footer>
  )
}

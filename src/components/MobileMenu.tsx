import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect } from 'react'
import { MagneticButton } from './MagneticButton'

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Works', href: '#works' },
  { label: 'Contact', href: '#contact' },
]

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * Full-screen overlay navigation menu with staggered link entrance animation.
 */
export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col bg-[#050505] backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between px-6 py-8 md:px-12 lg:px-16">
            <span className="text-sm font-medium tracking-widest uppercase">ARRIZAL ©2026</span>
            <MagneticButton aria-label="Close menu" onClick={onClose}>
              <X size={28} strokeWidth={1.5} />
            </MagneticButton>
          </div>

          <nav className="flex flex-1 flex-col items-center justify-center gap-8">
            {NAV_LINKS.map((link, index) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="font-clash text-5xl font-semibold text-white uppercase md:text-7xl"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.1 + index * 0.08, duration: 0.5 }}
              >
                {link.label}
              </motion.a>
            ))}
          </nav>

          <div className="px-6 py-10 text-center text-sm tracking-widest uppercase opacity-50 md:px-12 lg:px-16">
            Software & Mobile Engineer
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

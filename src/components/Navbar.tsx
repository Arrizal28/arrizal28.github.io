import { Menu } from 'lucide-react'
import { MagneticButton } from './MagneticButton'
import { MobileMenu } from './MobileMenu'
import { useUi } from '../context/UiContext'

/**
 * Fixed top navigation bar with magnetic menu trigger and fullscreen overlay.
 */
export function Navbar() {
  const { menuOpen, setMenuOpen } = useUi()

  /**
   * Opens the fullscreen navigation overlay.
   */
  function openMenu() {
    setMenuOpen(true)
  }

  /**
   * Closes the fullscreen navigation overlay.
   */
  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <>
      <nav
        className="fixed top-0 right-0 z-50 flex items-center justify-end px-6 py-8 md:px-12 lg:px-16"
        data-cursor-ignore=""
      >
        <MagneticButton aria-label="Open menu" onClick={openMenu}>
          <Menu size={28} strokeWidth={1.5} />
        </MagneticButton>
      </nav>
      <MobileMenu isOpen={menuOpen} onClose={closeMenu} />
    </>
  )
}

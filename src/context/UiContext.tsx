import { createContext, useContext, useRef, useState, type ReactNode, type RefObject } from 'react'

export interface WorksScrollState {
  atTop: boolean
  atBottom: boolean
  progress: number
}

interface UiContextValue {
  menuOpen: boolean
  setMenuOpen: (open: boolean) => void
  overlayOpen: boolean
  setOverlayOpen: (open: boolean) => void
  worksLocked: boolean
  setWorksLocked: (locked: boolean) => void
  worksScrollState: WorksScrollState
  setWorksScrollState: (state: WorksScrollState) => void
  worksPanelRef: RefObject<HTMLElement | null>
}

const UiContext = createContext<UiContextValue | null>(null)

/**
 * Provides shared UI state such as menu, overlay, and works scroll handoff across the app.
 */
export function UiProvider({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [worksLocked, setWorksLocked] = useState(false)
  const [worksScrollState, setWorksScrollState] = useState<WorksScrollState>({
    atTop: true,
    atBottom: false,
    progress: 0,
  })
  const worksPanelRef = useRef<HTMLElement | null>(null)

  return (
    <UiContext.Provider
      value={{
        menuOpen,
        setMenuOpen,
        overlayOpen,
        setOverlayOpen,
        worksLocked,
        setWorksLocked,
        worksScrollState,
        setWorksScrollState,
        worksPanelRef,
      }}
    >
      {children}
    </UiContext.Provider>
  )
}

/**
 * Reads shared UI state from the nearest UiProvider.
 */
export function useUi() {
  const context = useContext(UiContext)
  if (!context) {
    throw new Error('useUi must be used within UiProvider')
  }
  return context
}

import { Cursor } from './components/Cursor'
import { HorizontalLayout } from './sections/HorizontalLayout'

/**
 * Root application layout with full horizontal scroll experience.
 */
function App() {
  return (
    <>
      <Cursor />
      <div className="text-white">
        <HorizontalLayout />
      </div>
    </>
  )
}

export default App

import { useState } from 'react'
import { ProjectDetailView } from '../components/ProjectDetailView'
import { useUi } from '../context/UiContext'
import type { Project } from '../data/projects'
import { WorksRefractionColumn } from './WorksRefractionColumn'

/**
 * Single-viewport works panel with vertical refraction column and detail overlay.
 */
export function WorksGalleryPanel() {
  const { setOverlayOpen, worksPanelRef } = useUi()
  const [activeProject, setActiveProject] = useState<Project | null>(null)

  /**
   * Opens the horizontal detail view for the selected project.
   */
  function openProject(project: Project) {
    setActiveProject(project)
    setOverlayOpen(true)
  }

  /**
   * Closes the active project detail view.
   */
  function closeProject() {
    setActiveProject(null)
    setOverlayOpen(false)
  }

  return (
    <div
      ref={(node) => {
        worksPanelRef.current = node
      }}
      className="relative h-dvh w-screen shrink-0"
    >
      <section
        id="works"
        className="flex h-full w-full flex-col border-r border-white/10 bg-[#050505]"
      >
        <WorksRefractionColumn onOpenProject={openProject} />
      </section>

      <ProjectDetailView project={activeProject} onClose={closeProject} />
    </div>
  )
}

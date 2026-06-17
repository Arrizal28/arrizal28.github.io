import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, Code2 } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { Project } from '../data/projects'
import { useVerticalLenis } from '../hooks/useVerticalLenis'

interface ProjectDetailViewProps {
  project: Project | null
  onClose: () => void
}

const overlayEase = [0.22, 1, 0.36, 1] as const

const GALLERY_LABELS = ['Overview', 'Core Flow', 'Detail View']

interface ProjectLinkButtonProps {
  href: string
  label: string
  icon?: 'github' | 'external'
}

/**
 * Renders an external project link as a styled CTA button.
 */
function ProjectLinkButton({ href, label, icon = 'external' }: ProjectLinkButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="project-detail-cta group inline-flex items-center gap-3"
      data-cursor-hover=""
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] transition-colors group-hover:border-[#e8702a] group-hover:bg-[#e8702a]/10">
        {icon === 'github' ? <Code2 size={16} /> : <ArrowUpRight size={16} />}
      </span>
      <span className="text-xs tracking-[0.22em] uppercase">{label}</span>
    </a>
  )
}

/**
 * Renders the project link CTAs when URLs are available.
 */
function ProjectLinks({ project }: { project: Project }) {
  const links = project.links
  if (!links) return null

  const hasLinks = links.github || links.playStore || links.appStore
  if (!hasLinks) return null

  return (
    <div className="flex flex-wrap gap-x-8 gap-y-4">
      {links.github && (
        <ProjectLinkButton href={links.github} label="GitHub Repo" icon="github" />
      )}
      {links.playStore && (
        <ProjectLinkButton href={links.playStore} label="Play Store" />
      )}
      {links.appStore && (
        <ProjectLinkButton href={links.appStore} label="App Store" />
      )}
    </div>
  )
}

/**
 * Full-screen project detail with vertical editorial scroll layout.
 */
export function ProjectDetailView({ project, onClose }: ProjectDetailViewProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useVerticalLenis(wrapperRef, contentRef)

  useEffect(() => {
    /**
     * Closes the detail view when Escape is pressed.
     */
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    /**
     * Keeps wheel events inside the detail overlay scroll container.
     */
    function handleWheel(event: WheelEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) return
      event.stopPropagation()
    }

    if (project) {
      window.addEventListener('keydown', handleKey)
      window.addEventListener('wheel', handleWheel, { capture: true })
    }

    return () => {
      window.removeEventListener('keydown', handleKey)
      window.removeEventListener('wheel', handleWheel, { capture: true })
    }
  }, [project, onClose])

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[90] bg-[#050505]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          data-cursor-ignore=""
          data-lenis-prevent=""
        >
          <motion.div
            className="absolute inset-0"
            initial={{ y: '3%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '3%', opacity: 0 }}
            transition={{ duration: 0.55, ease: overlayEase }}
          >
            <button
              type="button"
              onClick={onClose}
              className="group fixed top-8 left-8 z-[95] inline-flex items-center gap-3 text-xs tracking-[0.25em] text-white/60 uppercase transition-colors hover:text-[#e8702a] md:top-10 md:left-12 lg:left-16"
              data-cursor-hover=""
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-[#050505]/80 backdrop-blur-sm transition-colors group-hover:border-[#e8702a]">
                <ArrowLeft size={16} />
              </span>
              Back to works
            </button>

            <div
              ref={wrapperRef}
              className="project-detail-scroll h-dvh w-full overflow-hidden"
              data-lenis-prevent=""
            >
              <div ref={contentRef}>
                <section className="project-detail-hero relative min-h-[72vh] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="project-detail-hero-overlay absolute inset-0" />
                  <div className="relative flex min-h-[72vh] flex-col justify-end px-8 pb-16 pt-32 md:px-16 lg:px-24">
                    <span className="font-clash mb-4 block text-[14vw] leading-none font-bold text-white/10 md:text-[8vw]">
                      {project.number}
                    </span>
                    <div className="flex flex-wrap items-end gap-4">
                      <h1 className="font-clash text-5xl leading-[0.9] font-bold tracking-tight uppercase md:text-7xl lg:text-8xl">
                        {project.title}
                      </h1>
                      <span className="mb-2 rounded-full border border-[#e8702a]/40 px-4 py-1.5 text-[10px] tracking-[0.3em] text-[#e8702a] uppercase">
                        {project.year}
                      </span>
                    </div>
                    <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70 md:text-xl">
                      {project.summary}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/15 bg-black/30 px-3 py-1 text-[10px] tracking-wide text-white/60 uppercase backdrop-blur-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="border-t border-white/10 px-8 py-16 md:px-16 md:py-20 lg:px-24">
                  <div className="project-detail-grid mx-auto max-w-6xl">
                    <div>
                      <p className="editorial-label mb-6">About the project</p>
                      <p className="text-base leading-relaxed text-white/65 md:text-lg">
                        {project.description}
                      </p>
                      <p className="mt-8 text-sm leading-relaxed text-white/45">
                        {project.summary}
                      </p>

                      <div className="mt-10 border-t border-white/10 pt-8">
                        <p className="editorial-label mb-3">Role</p>
                        <p className="text-sm leading-relaxed text-white/60">{project.role}</p>
                      </div>

                      <div className="mt-10">
                        <ProjectLinks project={project} />
                      </div>
                    </div>

                    <div className="project-detail-impact panel-surface rounded-3xl border border-white/10 p-8 md:p-10">
                      <p className="editorial-label mb-6 text-[#e8702a]">Impact</p>
                      <blockquote className="font-clash text-2xl leading-snug font-medium text-white/90 md:text-3xl">
                        &ldquo;{project.impact}&rdquo;
                      </blockquote>
                    </div>
                  </div>
                </section>

                <section className="border-t border-white/10 px-8 py-16 md:px-16 md:py-20 lg:px-24">
                  <div className="mx-auto max-w-6xl">
                    <p className="editorial-label mb-8">Tech stack</p>
                    <div className="flex flex-wrap gap-3">
                      {project.techStack.map((tech) => (
                        <span key={tech} className="project-detail-tech-pill">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="border-t border-white/10 px-8 py-16 md:px-16 md:py-20 lg:px-24">
                  <div className="mx-auto max-w-6xl">
                    <div className="mb-10 flex items-end justify-between gap-6">
                      <div>
                        <p className="editorial-label mb-3">Screenshots</p>
                        <h2 className="font-clash text-3xl font-semibold uppercase md:text-4xl">
                          Feature Gallery
                        </h2>
                      </div>
                      <p className="hidden text-[10px] tracking-[0.3em] text-white/30 uppercase md:block">
                        {project.screenshots.length} views
                      </p>
                    </div>

                    <div className="project-detail-gallery">
                      {project.screenshots.map((screenshot, index) => (
                        <figure
                          key={screenshot}
                          className={`project-detail-gallery-item panel-surface overflow-hidden rounded-2xl border border-white/10 ${
                            index === 0 ? 'project-detail-gallery-featured' : ''
                          }`}
                        >
                          <img
                            src={screenshot}
                            alt={`${project.title} — ${GALLERY_LABELS[index] ?? `View ${index + 1}`}`}
                            className="h-full w-full object-cover"
                          />
                          <figcaption className="border-t border-white/10 px-5 py-4">
                            <span className="text-[10px] tracking-[0.3em] text-[#e8702a] uppercase">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            <p className="mt-1 text-sm text-white/55">
                              {GALLERY_LABELS[index] ?? `Feature ${index + 1}`}
                            </p>
                          </figcaption>
                        </figure>
                      ))}
                    </div>
                  </div>
                </section>

                <footer className="border-t border-white/10 px-8 py-12 md:px-16 lg:px-24">
                  <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6">
                    <ProjectLinks project={project} />
                    <button
                      type="button"
                      onClick={onClose}
                      className="text-[10px] tracking-[0.3em] text-white/35 uppercase transition-colors hover:text-[#e8702a]"
                      data-cursor-hover=""
                    >
                      Close detail
                    </button>
                  </div>
                </footer>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

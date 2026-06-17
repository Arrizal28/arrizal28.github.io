import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, Code2 } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Project } from '../data/projects'
import { useHorizontalLenis } from '../hooks/useHorizontalLenis'

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
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/3 transition-colors group-hover:border-[#e8702a] group-hover:bg-[#e8702a]/10">
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
 * Renders a single portrait phone mockup showing one app screenshot.
 */
function ProjectPhoneMockup({
  project,
  screenshot,
  index,
  priority = false,
}: {
  project: Project
  screenshot: string
  index: number
  priority?: boolean
}) {
  const label = GALLERY_LABELS[index] ?? `Feature ${index + 1}`

  return (
    <figure className="project-detail-phone-item flex flex-col items-center">
      <div className="project-detail-phone">
        <span className="project-detail-phone-notch" />
        <img
          src={screenshot}
          alt={`${project.title} — ${label}`}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
        />
      </div>
      <figcaption className="mt-6 text-center">
        <span className="text-[10px] tracking-[0.3em] text-[#e8702a] uppercase">
          {String(index + 1).padStart(2, '0')}
        </span>
        <p className="mt-1 text-sm text-white/55">{label}</p>
      </figcaption>
    </figure>
  )
}

/**
 * Renders the hero strip with project info and a continuous row of phone mockups.
 */
function ProjectHeroStrip({ project }: { project: Project }) {
  return (
    <section className="project-detail-hero-strip relative flex h-dvh shrink-0 items-center border-r border-white/10 bg-[#050505]">
      <span className="font-clash pointer-events-none absolute top-24 right-12 text-[22vw] leading-none font-bold text-white/4 select-none md:right-20 md:text-[14vw]">
        {project.number}
      </span>

      <div className="project-detail-content-inset project-detail-hero-copy flex shrink-0 flex-col justify-center">
        <p className="editorial-label mb-6">Project {project.number}</p>
        <div className="flex flex-wrap items-end gap-5">
          <h1 className="font-clash text-4xl leading-[0.95] font-bold tracking-tight uppercase md:text-6xl lg:text-7xl">
            {project.title}
          </h1>
          <span className="mb-1 rounded-full border border-[#e8702a]/40 px-4 py-1.5 text-[10px] tracking-[0.3em] text-[#e8702a] uppercase">
            {project.year}
          </span>
        </div>
        <p className="mt-8 max-w-xl text-base leading-[1.8] text-white/70 md:text-lg">
          {project.description}
        </p>

        <div className="mt-10">
          <p className="editorial-label mb-4">Tech stack</p>
          <div className="flex flex-wrap gap-2.5">
            {project.techStack.map((tech) => (
              <span key={tech} className="project-detail-tech-pill">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-10">
          <ProjectLinks project={project} />
        </div>
      </div>

      <div className="project-detail-gallery-phones flex items-center">
        {project.screenshots.map((screenshot, index) => (
          <ProjectPhoneMockup
            key={`${screenshot}-${index}`}
            project={project}
            screenshot={screenshot}
            index={index}
            priority={index === 0}
          />
        ))}
      </div>
    </section>
  )
}

/**
 * Renders the closing panel with impact, role and store links.
 */
function ProjectClosingPanel({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <section className="project-detail-panel flex flex-col justify-center bg-[#050505]">
      <div className="project-detail-grid project-detail-content-inset py-28">
        <div className="space-y-10">
          <div className="project-detail-impact panel-surface rounded-3xl border border-white/10 p-8 md:p-10">
            <p className="editorial-label mb-6 text-[#e8702a]">Impact</p>
            <blockquote className="font-clash text-xl leading-snug font-medium text-white/90 md:text-2xl lg:text-3xl">
              &ldquo;{project.impact}&rdquo;
            </blockquote>
          </div>
          <div className="border-t border-white/10 pt-10">
            <p className="editorial-label mb-4">Role</p>
            <p className="max-w-md text-sm leading-[1.85] text-white/60 md:text-base">
              {project.role}
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <p className="editorial-label mb-6">Get the app</p>
          <ProjectLinks project={project} />
          <button
            type="button"
            onClick={onClose}
            className="mt-14 inline-flex items-center gap-3 self-start text-[10px] tracking-[0.3em] text-white/35 uppercase transition-colors hover:text-[#e8702a]"
            data-cursor-hover=""
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15">
              <ArrowLeft size={14} />
            </span>
            Back to works
          </button>
        </div>
      </div>
    </section>
  )
}

interface ProjectDetailContentProps {
  project: Project
  onClose: () => void
}

/**
 * Renders the mounted detail carousel so Lenis initializes after refs attach.
 */
function ProjectDetailContent({ project, onClose }: ProjectDetailContentProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  const handleProgress = useCallback((progress: number) => {
    setScrollProgress(progress)
  }, [])

  useHorizontalLenis(wrapperRef, contentRef, handleProgress, true)

  const progressMotion = useMotionValue(0)
  const progressSpring = useSpring(progressMotion, { stiffness: 120, damping: 28 })
  const indicatorScale = useTransform(progressSpring, [0, 1], [0, 1])

  useEffect(() => {
    progressMotion.set(scrollProgress)
  }, [scrollProgress, progressMotion])

  useEffect(() => {
    /**
     * Closes the detail view when Escape is pressed.
     */
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <motion.div
      className="absolute inset-0"
      initial={{ x: '4%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '4%', opacity: 0 }}
      transition={{ duration: 0.55, ease: overlayEase }}
    >
      <button
        type="button"
        onClick={onClose}
        className="group fixed top-8 left-8 z-95 inline-flex items-center gap-3 text-xs tracking-[0.25em] text-white/60 uppercase transition-colors hover:text-[#e8702a] md:top-10 md:left-12 lg:left-16"
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
        onWheel={(event) => event.stopPropagation()}
      >
        <div ref={contentRef} className="flex h-full w-max">
          <ProjectHeroStrip project={project} />
          <ProjectClosingPanel project={project} onClose={onClose} />
        </div>
      </div>

      <div className="pointer-events-none fixed right-8 bottom-8 left-8 z-95 md:right-12 md:left-12 lg:right-16 lg:left-16">
        <div className="mb-3 flex justify-between text-[10px] tracking-[0.3em] text-white/30 uppercase">
          <span>Scroll →</span>
          <span>{String(Math.round(scrollProgress * 100)).padStart(2, '0')}%</span>
        </div>
        <div className="h-px w-full bg-white/10">
          <motion.div
            className="h-full w-full origin-left bg-[#e8702a]"
            style={{ scaleX: indicatorScale }}
          />
        </div>
      </div>
    </motion.div>
  )
}

/**
 * Full-screen project detail with horizontal panel-by-panel scroll.
 */
export function ProjectDetailView({ project, onClose }: ProjectDetailViewProps) {
  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-90 bg-[#050505]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          data-cursor-ignore=""
          data-lenis-prevent=""
        >
          <ProjectDetailContent key={project.id} project={project} onClose={onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

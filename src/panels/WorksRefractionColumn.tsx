import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion'
import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import { useUi } from '../context/UiContext'
import type { Project } from '../data/projects'
import { projects } from '../data/projects'
import { useVerticalLenis } from '../hooks/useVerticalLenis'

interface WorksRefractionColumnProps {
  onOpenProject: (project: Project) => void
}

interface ProjectRefractionItemProps {
  project: Project
  index: number
  onOpen: (project: Project) => void
  refractionEnabled: boolean
  scrollContainerRef: RefObject<HTMLDivElement | null>
}

/**
 * Renders one vertically stacked project with lens-style scroll transforms.
 */
function ProjectRefractionItem({
  project,
  index,
  onOpen,
  refractionEnabled,
  scrollContainerRef,
}: ProjectRefractionItemProps) {
  const itemRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    container: scrollContainerRef,
    target: itemRef,
    offset: ['start end', 'end start'],
  })

  const focus = useTransform(scrollYProgress, [0.25, 0.5, 0.75], [0.88, 1, 0.88])
  const opacity = useTransform(scrollYProgress, [0.2, 0.45, 0.55, 0.8], [0.3, 1, 1, 0.3])
  const y = useTransform(scrollYProgress, [0, 1], [80, -80])
  const skewY = useTransform(scrollYProgress, [0, 0.5, 1], [2, 0, -2])
  const isEven = index % 2 === 0

  return (
    <article
      ref={itemRef}
      className="works-project-item relative flex min-h-[88vh] w-full items-center justify-center py-16"
    >
      <span
        className={`works-ghost-title font-clash pointer-events-none absolute top-1/2 -translate-y-1/2 ${
          isEven ? 'right-[8%]' : 'left-[8%]'
        }`}
        aria-hidden
      >
        {project.title}
      </span>

      <motion.div
        className="works-column-inner relative z-10 w-full max-w-[min(520px,78vw)]"
        style={{ scale: focus, opacity, y, skewY }}
      >
        <button
          type="button"
          onClick={() => onOpen(project)}
          className="group block w-full text-left"
          data-cursor-hover=""
        >
          <div className="works-image-frame overflow-hidden rounded-3xl border border-white/10">
            <img
              src={project.image}
              alt={project.title}
              className={`works-refraction-image aspect-4/5 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] ${
                refractionEnabled ? 'works-refraction-active' : ''
              }`}
            />
          </div>

          <div className="mt-8 px-1">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-xs text-[#e8702a]">{project.number}</span>
              <span className="text-[10px] tracking-widest text-white/35 uppercase">
                {project.year}
              </span>
            </div>
            <h3 className="font-clash text-3xl leading-tight font-semibold uppercase md:text-4xl">
              {project.title}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-white/55 md:text-base">
              {project.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 px-3 py-1 text-[10px] tracking-wide text-white/50 uppercase"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </button>
      </motion.div>
    </article>
  )
}

/**
 * Vertical living-lens project column with SVG refraction driven by scroll velocity.
 */
export function WorksRefractionColumn({ onOpenProject }: WorksRefractionColumnProps) {
  const { setWorksScrollState } = useUi()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const turbulenceRef = useRef<SVGFETurbulenceElement>(null)
  const displacementRef = useRef<SVGFEDisplacementMapElement>(null)

  const scrollProgress = useMotionValue(0)
  const scrollVelocity = useVelocity(scrollProgress)
  const smoothVelocity = useSpring(scrollVelocity, { stiffness: 120, damping: 28 })

  const [refractionEnabled, setRefractionEnabled] = useState(false)

  const handleProgress = useCallback(
    (progress: number) => {
      scrollProgress.set(progress)
      setWorksScrollState({
        atTop: progress <= 0.01,
        atBottom: progress >= 0.99,
        progress,
      })
    },
    [scrollProgress, setWorksScrollState],
  )

  useVerticalLenis(wrapperRef, contentRef, { onProgress: handleProgress })

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setRefractionEnabled(finePointer && !reducedMotion)
  }, [])

  useMotionValueEvent(smoothVelocity, 'change', (velocity) => {
    if (!refractionEnabled || !turbulenceRef.current || !displacementRef.current) return

    const intensity = Math.min(Math.abs(velocity) * 0.08, 28)
    const frequency = 0.012 + Math.min(Math.abs(velocity) * 0.0004, 0.018)

    displacementRef.current.setAttribute('scale', String(intensity))
    turbulenceRef.current.setAttribute('baseFrequency', `${frequency} ${frequency * 0.9}`)
  })

  return (
    <div className="relative flex h-full w-full flex-col">
      <svg className="pointer-events-none absolute h-0 w-0" aria-hidden>
        <defs>
          <filter id="worksRefraction" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              ref={turbulenceRef}
              type="fractalNoise"
              baseFrequency="0.012 0.011"
              numOctaves="3"
              seed="8"
              result="noise"
            />
            <feDisplacementMap
              ref={displacementRef}
              in="SourceGraphic"
              in2="noise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <header className="works-column-header shrink-0 px-8 pt-28 pb-8 md:px-16 md:pt-32 lg:px-20">
        <span className="editorial-label mb-4 block text-[#e8702a]">03 — Featured Works</span>
        <h2 className="font-clash text-4xl leading-[0.9] font-bold tracking-tight uppercase md:text-5xl">
          SELECTED
          <span className="text-white/20"> BUILDS</span>
        </h2>
        <p className="mt-4 text-[10px] tracking-[0.3em] text-white/30 uppercase">
          Scroll vertically · Click to open detail
        </p>
      </header>

      <div
        ref={wrapperRef}
        className="min-h-0 flex-1 overflow-hidden"
        data-lenis-prevent=""
      >
        <div ref={contentRef} className="works-column-track">
          {projects.map((project, index) => (
            <ProjectRefractionItem
              key={project.id}
              project={project}
              index={index}
              onOpen={onOpenProject}
              refractionEnabled={refractionEnabled}
              scrollContainerRef={wrapperRef}
            />
          ))}
          <div className="flex h-[30vh] items-center justify-center">
            <p className="text-[10px] tracking-[0.35em] text-[#e8702a] uppercase">
              Scroll → to continue
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

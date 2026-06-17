export interface ProjectLinks {
  github?: string
  playStore?: string
  appStore?: string
}

export interface Project {
  id: string
  number: string
  title: string
  description: string
  summary: string
  image: string
  year: string
  tags: string[]
  techStack: string[]
  role: string
  impact: string
  screenshots: string[]
  links?: ProjectLinks
}

export const projects: Project[] = [
  {
    id: 'lumina-digital',
    number: '01',
    title: 'Lumina Digital',
    description:
      'E-commerce mobile experience with fluid animations, offline-first architecture, and robust BLoC state management.',
    summary:
      'A premium shopping app focused on fast discovery, smooth checkout, and resilient mobile architecture for unstable networks.',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070',
    year: '2024',
    tags: ['Flutter', 'BLoC', 'Firebase'],
    techStack: ['Flutter', 'Dart', 'BLoC', 'Firebase', 'Stripe', 'Figma'],
    role: 'Mobile architecture, interaction design, performance tuning',
    impact: 'Reduced checkout friction and improved perceived speed through offline-first product browsing.',
    screenshots: [
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1974',
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070',
    ],
    links: {
      github: 'https://github.com',
      playStore: 'https://play.google.com/store',
      appStore: 'https://apps.apple.com',
    },
  },
  {
    id: 'nova-finance',
    number: '02',
    title: 'Nova Finance',
    description:
      'Fintech app with end-to-end encryption, real-time sync, and sub-16ms frame rendering on low-end devices.',
    summary:
      'A secure financial dashboard designed around instant balance visibility, realtime movement tracking, and native-feeling interactions.',
    image:
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2070',
    year: '2025',
    tags: ['Swift', 'Kotlin', 'GraphQL'],
    techStack: ['SwiftUI', 'Kotlin', 'GraphQL', 'WebSocket', 'Keychain', 'Biometric Auth'],
    role: 'Native mobile engineering, security flow, realtime sync',
    impact: 'Improved session security while preserving instant access to key financial actions.',
    screenshots: [
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2011',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070',
      'https://images.unsplash.com/photo-1642790106117-e829e14a795f?q=80&w=2070',
    ],
    links: {
      github: 'https://github.com',
    },
  },
  {
    id: 'pulse-health',
    number: '03',
    title: 'Pulse Health',
    description:
      'Health-tracking platform with wearable integration, personalized insights, and HIPAA-compliant data pipelines.',
    summary:
      'A health companion that translates wearable signals into calm, actionable insights for daily wellbeing routines.',
    image:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070',
    year: '2025',
    tags: ['Flutter', 'HealthKit', 'AWS'],
    techStack: ['Flutter', 'HealthKit', 'AWS Lambda', 'DynamoDB', 'Charts', 'CI/CD'],
    role: 'Cross-platform mobile build, data visualization, wearable integration',
    impact: 'Created a scalable mobile foundation for personalized wellness insights and connected device data.',
    screenshots: [
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070',
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=2031',
      'https://images.unsplash.com/photo-1581093458791-9f3c3900df7b?q=80&w=2070',
    ],
    links: {
      playStore: 'https://play.google.com/store',
      appStore: 'https://apps.apple.com',
    },
  },
]

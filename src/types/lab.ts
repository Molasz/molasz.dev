export type ViewPreset =
  | 'overview'
  | 'laptop'
  | 'instruments'
  | 'pcb'
  | 'soldering'
  | 'pegboard'
  | 'topdown'

export type LightingTheme = 'cyber' | 'warm' | 'clean' | 'matrix'

export const VIEW_CONFIGS: Record<ViewPreset, { pos: [number, number, number]; target: [number, number, number] }> = {
  overview: {
    pos: [0, 1.85, 3.10],
    target: [0, 0.98, -0.05],
  },
  laptop: {
    pos: [-0.68, 1.15, 0.52],
    target: [-0.68, 0.94, 0.08],
  },
  instruments: {
    pos: [-0.20, 1.65, 0.40],
    target: [-0.20, 1.46, -0.32],
  },
  pcb: {
    pos: [-0.02, 1.25, 0.35],
    target: [-0.02, 0.88, -0.04],
  },
  soldering: {
    pos: [0.72, 1.18, 0.38],
    target: [0.72, 0.94, -0.08],
  },
  pegboard: {
    pos: [0.05, 1.62, 0.70],
    target: [0.05, 1.35, -0.35],
  },
  topdown: {
    pos: [0, 3.10, 0.08],
    target: [0, 0.84, 0],
  },
}

export interface ProjectItem {
  id: string
  title: string
  category: string
  date: string
  summary: string
  techs: string[]
  metrics?: { label: string; value: string }[]
  githubUrl?: string
  liveUrl?: string
  status: 'active' | 'completed' | 'experimental'
}

export interface LabState {
  currentView: ViewPreset
  lightingTheme: LightingTheme
  lampOn: boolean
  soundEnabled: boolean
  autoTour: boolean
  oscilloscopeMode: number
  powerPreset: number
  solderingPreset: number
  pcbActive: boolean
}

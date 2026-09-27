export type AppScene = 'home' | 'taller'

export type ViewPreset =
  | 'overview'
  | 'laptop'
  | 'instruments'
  | 'pcb'
  | 'soldering'
  | 'pegboard'
  | 'topdown'

export type HomeViewPreset =
  | 'general'
  | 'taller_ext'
  | 'figuera'
  | 'habitacio_ext'
  | 'jardi'

export const VIEW_CONFIGS: Record<ViewPreset, { pos: [number, number, number]; target: [number, number, number] }> = {
  overview: {
    pos: [-1.45, 1.85, 2.40],
    target: [-1.45, 0.98, -0.75],
  },
  laptop: {
    pos: [-2.13, 1.15, -0.18],
    target: [-2.13, 0.94, -0.62],
  },
  instruments: {
    pos: [-1.65, 1.65, -0.30],
    target: [-1.65, 1.46, -1.02],
  },
  pcb: {
    pos: [-1.47, 1.25, -0.35],
    target: [-1.47, 0.88, -0.74],
  },
  soldering: {
    pos: [-0.73, 1.18, -0.32],
    target: [-0.73, 0.94, -0.78],
  },
  pegboard: {
    pos: [-1.40, 1.62, 0.00],
    target: [-1.40, 1.35, -1.05],
  },
  topdown: {
    pos: [-1.45, 3.10, -0.62],
    target: [-1.45, 0.84, -0.70],
  },
}

export const HOME_VIEW_CONFIGS: Record<HomeViewPreset, { pos: [number, number, number]; target: [number, number, number] }> = {
  general: {
    pos: [0, 8.5, 16.5],
    target: [-0.5, 0.8, 0],
  },
  taller_ext: {
    pos: [-4.2, 3.2, 0.8],
    target: [-4.5, 1.6, -4.5],
  },
  figuera: {
    pos: [2.4, 2.6, 3.8],
    target: [2.4, 1.8, -0.8],
  },
  habitacio_ext: {
    pos: [-3.8, 2.8, 10.5],
    target: [-3.8, 1.5, 5.0],
  },
  jardi: {
    pos: [1.2, 4.0, 7.5],
    target: [0.5, 0.8, 1.5],
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
  currentScene: AppScene
  currentView: ViewPreset
  homeView: HomeViewPreset
  lampOn: boolean
  soundEnabled: boolean
  autoTour: boolean
  oscilloscopeMode: number
  powerPreset: number
  solderingPreset: number
  pcbActive: boolean
}

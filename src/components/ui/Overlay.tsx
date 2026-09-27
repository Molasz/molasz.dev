import React from 'react'
import { Terminal, LayoutGrid, Activity, Cpu, Flame, RotateCcw } from 'lucide-react'
import type { ViewPreset } from '../canvas/CameraController'

interface OverlayProps {
  currentView: ViewPreset
  onSelectView: (view: ViewPreset) => void
}

export const Overlay: React.FC<OverlayProps> = ({ currentView, onSelectView }) => {
  const navButtons: { id: ViewPreset; label: string; shortLabel: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Taula completa', shortLabel: 'Taula', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
    { id: 'laptop', label: 'Portàtil', shortLabel: 'Portàtil', icon: <Terminal className="w-3.5 h-3.5" /> },
    { id: 'instruments', label: 'Oscil·loscopi & Font', shortLabel: 'Instruments', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'pcb', label: 'Circuit PCB', shortLabel: 'PCB', icon: <Cpu className="w-3.5 h-3.5" /> },
    { id: 'soldering', label: 'Soldador', shortLabel: 'Soldador', icon: <Flame className="w-3.5 h-3.5" /> },
  ]

  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex flex-col justify-between p-4 sm:p-6 select-none overflow-hidden">
      {/* Top Header & Camera View Switcher */}
      <header className="flex flex-wrap items-center justify-between gap-3 w-full">
        {/* Brand Badge */}
        <div className="pointer-events-auto flex items-center gap-3 bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-700/60 shadow-xl">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-wide text-slate-100">molasz.dev</h1>
            <p className="text-[11px] text-slate-400 font-mono hidden sm:block">Hardware & Software Lab</p>
          </div>
        </div>

        {/* View Switcher Menu */}
        <nav className="pointer-events-auto flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/60 shadow-xl text-xs font-mono text-slate-300">
          {navButtons.map((btn) => {
            const isActive = currentView === btn.id
            return (
              <button
                key={btn.id}
                type="button"
                onClick={() => onSelectView(btn.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer text-xs whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-800 text-cyan-300 border border-cyan-500/50 shadow-md font-medium'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                {btn.icon}
                <span className="hidden md:inline">{btn.label}</span>
                <span className="inline md:hidden">{btn.shortLabel}</span>
              </button>
            )
          })}
        </nav>
      </header>

      {/* Bottom Footer with Navigation Info */}
      <footer className="flex flex-wrap items-end justify-between gap-3 w-full">
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md px-4 py-3 rounded-xl border border-slate-700/60 shadow-xl text-xs text-slate-300 max-w-sm">
          <div className="flex items-center gap-2 font-medium text-slate-200 mb-1">
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            Navegació 3D interactiva
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Fes clic als botons superiors per centrar la càmera a cada instrument o arrossega per rotar la vista 360°.
          </p>
        </div>

        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/60 text-[11px] font-mono text-slate-400 shadow-xl">
          <span>Three.js • React Three Fiber</span>
        </div>
      </footer>
    </div>
  )
}

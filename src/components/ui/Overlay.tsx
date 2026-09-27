import React from 'react'
import { Terminal, Cpu, Radio, Flame, RotateCcw } from 'lucide-react'
import type { ViewPreset } from '../canvas/CameraController'

interface OverlayProps {
  currentView: ViewPreset
  onSelectView: (view: ViewPreset) => void
}

export const Overlay: React.FC<OverlayProps> = ({ currentView, onSelectView }) => {
  const navButtons: { id: ViewPreset; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Taula de taller', icon: <Cpu className="w-3.5 h-3.5" /> },
    { id: 'laptop', label: 'Portàtil', icon: <Terminal className="w-3.5 h-3.5" /> },
    { id: 'instruments', label: 'Oscil·loscopi & Font', icon: <Radio className="w-3.5 h-3.5" /> },
    { id: 'soldering', label: 'Soldador & Circuit', icon: <Flame className="w-3.5 h-3.5" /> },
  ]

  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-6 z-10 select-none">
      {/* Top Header */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="pointer-events-auto flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-700/50 shadow-xl">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-wide text-white">molasz.dev</h1>
            <p className="text-xs text-slate-400 font-mono">Hardware & Software Workshop</p>
          </div>
        </div>

        {/* View Switcher Navigation */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/50 shadow-xl text-xs font-mono text-slate-300">
          {navButtons.map((btn) => {
            const isActive = currentView === btn.id
            return (
              <button
                key={btn.id}
                onClick={() => onSelectView(btn.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                {btn.icon}
                <span>{btn.label}</span>
              </button>
            )
          })}
        </div>
      </header>

      {/* Bottom Footer / Controls Hint */}
      <footer className="flex flex-wrap items-end justify-between gap-4">
        <div className="pointer-events-auto bg-slate-900/80 backdrop-blur-md px-4 py-3 rounded-xl border border-slate-700/50 shadow-xl text-xs text-slate-300 max-w-sm">
          <div className="flex items-center gap-2 font-medium text-slate-200 mb-1">
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            Navegació 3D interactiva
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Fes clic i arrossega per rotar la vista 360°. Roda per fer zoom. Fes clic als botons superiors per enfocar cada eina.
          </p>
        </div>

        <div className="pointer-events-auto bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/50 text-[11px] font-mono text-slate-400">
          <span>Three.js + React Three Fiber</span>
        </div>
      </footer>
    </div>
  )
}

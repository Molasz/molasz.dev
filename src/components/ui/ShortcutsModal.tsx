import React from 'react'
import { X, Keyboard, MousePointer } from 'lucide-react'
import { soundFx } from '../../utils/sound'

interface ShortcutsModalProps {
  isOpen: boolean
  onClose: () => void
  soundEnabled: boolean
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose, soundEnabled }) => {
  if (!isOpen) return null

  const handleClose = () => {
    soundFx.click(soundEnabled)
    onClose()
  }

  const shortcuts = [
    { key: '1', desc: 'Vista taula completa (Overview)' },
    { key: '2', desc: 'Portàtil & Terminal IDE' },
    { key: '3', desc: 'Instruments (Oscil·loscopi & Font)' },
    { key: '4', desc: 'Circuit PCB & Breadboard' },
    { key: '5', desc: 'Estació de soldadura' },
    { key: '6', desc: 'Panell d’eines & Metrologia' },
    { key: '7', desc: 'Vista zenital / Plànol superior' },
    { key: 'L', desc: 'Encendre / apagar el llum de taula' },
    { key: 'S', desc: 'Activar / desactivar efectes de so' },
    { key: 'T', desc: 'Activar / desactivar Tour Automàtic' },
    { key: 'P', desc: 'Obrir quadern de projectes' },
    { key: 'R', desc: 'Reiniciar càmera a vista inicial' },
    { key: '?', desc: 'Obrir aquesta guia de dreceres' },
  ]

  const mouseControls = [
    { action: 'Clic esquerre + Arrossegar', desc: 'Rotar la càmera 360° lliurement al voltant de l’objecte' },
    { action: 'Roda del ratolí / Pinça tàctil', desc: 'Apropar o allunyar el zoom de visió' },
    { action: 'Clic dret + Arrossegar', desc: 'Desplaçar (panoràmica) la posició de la càmera' },
    { action: 'Clic sobre qualsevol instrument', desc: 'Interactuar amb els botons, rodes, dials o eines 3D' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative flex flex-col w-full max-w-xl max-h-[90vh] bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100">Controls & Dreceres de teclat</h2>
              <p className="text-xs text-slate-400 font-mono">Guia de navegació interactiva 3D</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            aria-label="Tancar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-slate-200">
          {/* Mouse Section */}
          <div>
            <h3 className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider mb-2.5 flex items-center gap-2">
              <MousePointer className="w-4 h-4" />
              Controls de ratolí & tàctil
            </h3>
            <div className="grid grid-cols-1 gap-2 text-xs font-mono">
              {mouseControls.map((m, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 gap-1.5"
                >
                  <span className="text-slate-200 font-semibold">{m.action}</span>
                  <span className="text-slate-400 text-[11px] sm:text-right">{m.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Keyboard Shortcuts Section */}
          <div>
            <h3 className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider mb-2.5 flex items-center gap-2">
              <Keyboard className="w-4 h-4" />
              Dreceres de teclat ràpides
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              {shortcuts.map((s, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50 border border-slate-700/50"
                >
                  <span className="text-slate-400 text-[11px] truncate mr-2">{s.desc}</span>
                  <kbd className="px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-cyan-500/40 text-xs font-bold shadow-sm">
                    {s.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-5 py-3 border-t border-slate-800 bg-slate-950/60 text-xs font-mono">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold transition-colors cursor-pointer"
          >
            Entesos
          </button>
        </div>
      </div>
    </div>
  )
}

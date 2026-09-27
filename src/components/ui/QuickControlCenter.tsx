import React from 'react'
import {
  Activity,
  Zap,
  Flame,
  Lightbulb,
  Play,
  Pause,
  Sliders,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import type { ViewPreset } from '../../types/lab'
import { soundFx } from '../../utils/sound'

interface QuickControlCenterProps {
  isOpen: boolean
  onToggleOpen: () => void
  lampOn: boolean
  onToggleLamp: () => void
  soundEnabled: boolean
  autoTour: boolean
  onToggleAutoTour: () => void
  oscilloscopeMode: number
  onChangeOscilloscope: (m: number) => void
  powerPreset: number
  onChangePowerPreset: (p: number) => void
  solderingPreset: number
  onChangeSolderingPreset: (s: number) => void
  pcbActive: boolean
  onTogglePcb: () => void
  currentView: ViewPreset
}

export const QuickControlCenter: React.FC<QuickControlCenterProps> = ({
  isOpen,
  onToggleOpen,
  lampOn,
  onToggleLamp,
  soundEnabled,
  autoTour,
  onToggleAutoTour,
  oscilloscopeMode,
  onChangeOscilloscope,
  powerPreset,
  onChangePowerPreset,
  solderingPreset,
  onChangeSolderingPreset,
  pcbActive,
  onTogglePcb,
}) => {
  const scopeModes = ['48.00 MHz', 'SOLAR PK', 'HARMONIC', 'BEACON']
  const powerPresets = ['3.3V (0.45A)', '5.0V (1.20A)', '12.0V (2.15A)', '24.0V (0.80A)']
  const solderingTemps = ['350 °C', '380 °C', '420 °C', 'STBY']

  return (
    <div className="pointer-events-auto flex flex-col items-end">
      {/* Drawer Container */}
      {isOpen && (
        <div className="w-80 sm:w-88 mb-2 p-4 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-700/70 shadow-2xl text-xs font-mono space-y-4 animate-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <span className="font-semibold text-slate-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Panell de Control dels Instruments
            </span>
            <span className="text-[10px] text-slate-400">molasz.dev</span>
          </div>

          {/* Oscilloscope Frequency Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                Senyal Oscil·loscopi
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold">{scopeModes[oscilloscopeMode % 4]}</span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {scopeModes.map((name, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onChangeOscilloscope(idx)
                    soundFx.scopeBeep(soundEnabled)
                  }}
                  className={`py-1 px-1 rounded text-[10px] text-center truncate border transition-all cursor-pointer ${
                    oscilloscopeMode % 4 === idx
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/60 font-medium'
                      : 'bg-slate-950/40 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Power Supply Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Font d'Alimentació DC
              </span>
              <span className="text-[10px] text-amber-400 font-semibold">{powerPresets[powerPreset % 4]}</span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {['3.3V', '5.0V', '12.0V', '24.0V'].map((v, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onChangePowerPreset(idx)
                    soundFx.switchRelay(soundEnabled)
                  }}
                  className={`py-1 px-1 rounded text-[10px] text-center border transition-all cursor-pointer ${
                    powerPreset % 4 === idx
                      ? 'bg-amber-950/60 text-amber-300 border-amber-500/60 font-medium'
                      : 'bg-slate-950/40 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Soldering Iron Temp */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                Estació de Soldadura
              </span>
              <span className="text-[10px] text-orange-400 font-semibold">{solderingTemps[solderingPreset % 4]}</span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {solderingTemps.map((temp, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onChangeSolderingPreset(idx)
                    soundFx.solderSizzle(soundEnabled)
                  }}
                  className={`py-1 px-1 rounded text-[10px] text-center border transition-all cursor-pointer ${
                    solderingPreset % 4 === idx
                      ? 'bg-orange-950/60 text-orange-300 border-orange-500/60 font-medium'
                      : 'bg-slate-950/40 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {temp}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Action Toggles */}
          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                onToggleLamp()
                soundFx.switchRelay(soundEnabled)
              }}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg border text-[11px] transition-all cursor-pointer ${
                lampOn
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-medium'
                  : 'bg-slate-950/40 text-slate-400 border-slate-800 hover:bg-slate-800/50'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>{lampOn ? 'Llum On' : 'Llum Off'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onTogglePcb()
                soundFx.click(soundEnabled)
              }}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg border text-[11px] transition-all cursor-pointer ${
                pcbActive
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-medium'
                  : 'bg-slate-950/40 text-slate-400 border-slate-800 hover:bg-slate-800/50'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{pcbActive ? 'PCB Actiu' : 'PCB Standby'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onToggleAutoTour()
                soundFx.click(soundEnabled)
              }}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg border text-[11px] transition-all cursor-pointer ${
                autoTour
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-medium'
                  : 'bg-slate-950/40 text-slate-400 border-slate-800 hover:bg-slate-800/50'
              }`}
            >
              {autoTour ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{autoTour ? 'Pausa Tour' : 'Auto-Tour'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Drawer Toggle Button */}
      <button
        type="button"
        onClick={onToggleOpen}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl backdrop-blur-md border shadow-xl text-xs font-mono transition-all cursor-pointer ${
          isOpen
            ? 'bg-cyan-600 text-slate-950 border-cyan-400 font-semibold'
            : 'bg-slate-900/90 text-slate-300 border-slate-700/60 hover:bg-slate-800 hover:text-slate-100'
        }`}
      >
        <Sliders className="w-4 h-4" />
        <span>Ajustos & Instruments</span>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
      </button>
    </div>
  )
}

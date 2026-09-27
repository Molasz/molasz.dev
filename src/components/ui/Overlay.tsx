import React, { useState } from 'react'
import {
  Terminal,
  LayoutGrid,
  Activity,
  Cpu,
  Flame,
  Wrench,
  Compass,
  RotateCcw,
  Volume2,
  VolumeX,
  BookOpen,
  Keyboard,
  Sun,
  Moon,
  Lightbulb,
  Sparkles,
} from 'lucide-react'
import type { ViewPreset, LightingTheme } from '../../types/lab'
import { LabNotebookModal } from './LabNotebookModal'
import { ShortcutsModal } from './ShortcutsModal'
import { QuickControlCenter } from './QuickControlCenter'
import { soundFx } from '../../utils/sound'

interface OverlayProps {
  currentView: ViewPreset
  onSelectView: (view: ViewPreset) => void
  lightingTheme: LightingTheme
  onChangeTheme: (theme: LightingTheme) => void
  lampOn: boolean
  onToggleLamp: () => void
  soundEnabled: boolean
  onToggleSound: () => void
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
  isNotebookOpen: boolean
  onOpenNotebook: () => void
  onCloseNotebook: () => void
}

export const Overlay: React.FC<OverlayProps> = ({
  currentView,
  onSelectView,
  lightingTheme,
  onChangeTheme,
  lampOn,
  onToggleLamp,
  soundEnabled,
  onToggleSound,
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
  isNotebookOpen,
  onOpenNotebook,
  onCloseNotebook,
}) => {
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false)
  const [isQuickControlsOpen, setIsQuickControlsOpen] = useState(false)

  const navButtons: { id: ViewPreset; label: string; shortLabel: string; hotkey: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Taula completa', shortLabel: 'Taula', hotkey: '1', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
    { id: 'laptop', label: 'Portàtil IDE', shortLabel: 'Portàtil', hotkey: '2', icon: <Terminal className="w-3.5 h-3.5" /> },
    { id: 'instruments', label: 'Oscil·loscopi & Font', shortLabel: 'Instruments', hotkey: '3', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'pcb', label: 'Circuit PCB', shortLabel: 'PCB', hotkey: '4', icon: <Cpu className="w-3.5 h-3.5" /> },
    { id: 'soldering', label: 'Soldador', shortLabel: 'Soldador', hotkey: '5', icon: <Flame className="w-3.5 h-3.5" /> },
    { id: 'pegboard', label: 'Panell d’eines', shortLabel: 'Eines', hotkey: '6', icon: <Wrench className="w-3.5 h-3.5" /> },
    { id: 'topdown', label: 'Vista zenital', shortLabel: 'Zenital', hotkey: '7', icon: <Compass className="w-3.5 h-3.5" /> },
  ]

  const scopeModes = ['48 MHz', 'SOLAR', 'HARM', 'BEACON']
  const powerPresets = ['3.3V', '5.0V', '12.0V', '24.0V']
  const solderingTemps = ['350°C', '380°C', '420°C', 'STBY']

  const handleSelectView = (view: ViewPreset) => {
    soundFx.cameraSwoosh(soundEnabled)
    onSelectView(view)
  }

  const nextTheme: Record<LightingTheme, LightingTheme> = {
    cyber: 'warm',
    warm: 'clean',
    clean: 'matrix',
    matrix: 'cyber',
  }

  const themeIcons: Record<LightingTheme, React.ReactNode> = {
    cyber: <Moon className="w-3.5 h-3.5 text-cyan-400" />,
    warm: <Sun className="w-3.5 h-3.5 text-amber-400" />,
    clean: <Lightbulb className="w-3.5 h-3.5 text-sky-400" />,
    matrix: <Sparkles className="w-3.5 h-3.5 text-emerald-400" />,
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex flex-col justify-between p-3 sm:p-5 select-none overflow-hidden">
      {/* 1. TOP HEADER BAR */}
      <header className="flex flex-wrap items-center justify-between gap-3 w-full">
        {/* Brand Badge & Project Notebook Button */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div
            onClick={onOpenNotebook}
            className="flex items-center gap-3 bg-slate-900/90 hover:bg-slate-800/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/60 shadow-xl cursor-pointer transition-all group"
            title="Obrir quadern de projectes (Tecla P)"
          >
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xs sm:text-sm font-semibold tracking-wide text-slate-100 group-hover:text-cyan-300 transition-colors">
                  molasz.dev
                </h1>
                <BookOpen className="w-3 h-3 text-cyan-400 opacity-70 group-hover:opacity-100" />
              </div>
              <p className="text-[10px] text-slate-400 font-mono hidden sm:block">Hardware & Software Lab</p>
            </div>
          </div>

          {/* Quick Theme Cycle Button */}
          <button
            type="button"
            onClick={() => {
              onChangeTheme(nextTheme[lightingTheme])
              soundFx.click(soundEnabled)
            }}
            className="p-2.5 bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md rounded-xl border border-slate-700/60 text-slate-300 shadow-xl cursor-pointer transition-all"
            title={`Atmosfera actual: ${lightingTheme}. Clic per canviar`}
            aria-label="Canviar tema d'il·luminació"
          >
            {themeIcons[lightingTheme]}
          </button>

          {/* Audio Sound FX Toggle */}
          <button
            type="button"
            onClick={() => {
              onToggleSound()
              if (!soundEnabled) soundFx.click(true)
            }}
            className={`p-2.5 bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md rounded-xl border shadow-xl cursor-pointer transition-all ${
              soundEnabled ? 'text-cyan-400 border-slate-700/60' : 'text-slate-500 border-slate-800'
            }`}
            title={soundEnabled ? 'Silenciar efectes de so (Tecla S)' : 'Activar efectes de so (Tecla S)'}
            aria-label="Commutar so"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Keyboard Shortcuts Dialog */}
          <button
            type="button"
            onClick={() => {
              setIsShortcutsOpen(true)
              soundFx.click(soundEnabled)
            }}
            className="p-2.5 bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md rounded-xl border border-slate-700/60 text-slate-300 shadow-xl cursor-pointer transition-all hidden md:flex items-center gap-1.5 text-xs font-mono"
            title="Guia de controls i tecles (Tecla ?)"
          >
            <Keyboard className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px]">Dreceres</span>
          </button>
        </div>

        {/* View Preset Switcher Menu */}
        <nav className="pointer-events-auto flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/60 shadow-xl text-xs font-mono text-slate-300 max-w-full overflow-x-auto">
          {navButtons.map((btn) => {
            const isActive = currentView === btn.id
            return (
              <button
                key={btn.id}
                type="button"
                onClick={() => handleSelectView(btn.id)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer text-xs whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-800 text-cyan-300 border border-cyan-500/50 shadow-md font-medium'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent'
                }`}
                title={`Canviar a vista ${btn.label} (Tecla ${btn.hotkey})`}
              >
                {btn.icon}
                <span className="hidden lg:inline">{btn.label}</span>
                <span className="inline lg:hidden">{btn.shortLabel}</span>
                <span className="hidden xl:inline text-[9px] text-slate-500 ml-0.5 px-1 py-0.2 rounded bg-slate-950/60">
                  {btn.hotkey}
                </span>
              </button>
            )
          })}
        </nav>
      </header>

      {/* 2. BOTTOM CONTROL & TELEMETRY FOOTER */}
      <footer className="flex flex-wrap items-end justify-between gap-3 w-full">
        {/* Left Telemetry Card */}
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-700/60 shadow-xl text-xs text-slate-300 max-w-md hidden sm:block">
          <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-800">
            <div className="flex items-center gap-2 font-semibold text-slate-200 text-xs">
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
              Estat de la Instrumentació
            </div>
            <button
              type="button"
              onClick={() => handleSelectView('overview')}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
            >
              Reset Càmera (R)
            </button>
          </div>

          {/* Quick live gauges */}
          <div className="grid grid-cols-4 gap-2 text-[10px] font-mono">
            <div className="p-1.5 rounded bg-slate-950/50 border border-slate-800">
              <span className="text-slate-500 block text-[9px]">OSCIL</span>
              <span className="text-emerald-400 font-bold">{scopeModes[oscilloscopeMode % 4]}</span>
            </div>
            <div className="p-1.5 rounded bg-slate-950/50 border border-slate-800">
              <span className="text-slate-500 block text-[9px]">FONT DC</span>
              <span className="text-amber-400 font-bold">{powerPresets[powerPreset % 4]}</span>
            </div>
            <div className="p-1.5 rounded bg-slate-950/50 border border-slate-800">
              <span className="text-slate-500 block text-[9px]">SOLDADOR</span>
              <span className="text-orange-400 font-bold">{solderingTemps[solderingPreset % 4]}</span>
            </div>
            <div className="p-1.5 rounded bg-slate-950/50 border border-slate-800">
              <span className="text-slate-500 block text-[9px]">LLUM</span>
              <span className={lampOn ? 'text-amber-300 font-bold' : 'text-slate-500 font-bold'}>
                {lampOn ? 'ON' : 'OFF'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Action Widgets & Quick Controls Drawer */}
        <div className="flex items-center gap-2 ml-auto">
          <QuickControlCenter
            isOpen={isQuickControlsOpen}
            onToggleOpen={() => {
              setIsQuickControlsOpen((prev) => !prev)
              soundFx.click(soundEnabled)
            }}
            lightingTheme={lightingTheme}
            onChangeTheme={onChangeTheme}
            lampOn={lampOn}
            onToggleLamp={onToggleLamp}
            soundEnabled={soundEnabled}
            onToggleSound={onToggleSound}
            autoTour={autoTour}
            onToggleAutoTour={onToggleAutoTour}
            oscilloscopeMode={oscilloscopeMode}
            onChangeOscilloscope={onChangeOscilloscope}
            powerPreset={powerPreset}
            onChangePowerPreset={onChangePowerPreset}
            solderingPreset={solderingPreset}
            onChangeSolderingPreset={onChangeSolderingPreset}
            pcbActive={pcbActive}
            onTogglePcb={onTogglePcb}
            currentView={currentView}
          />
        </div>
      </footer>

      {/* 3. MODALS */}
      <LabNotebookModal
        isOpen={isNotebookOpen}
        onClose={onCloseNotebook}
        soundEnabled={soundEnabled}
      />

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
        soundEnabled={soundEnabled}
      />
    </div>
  )
}

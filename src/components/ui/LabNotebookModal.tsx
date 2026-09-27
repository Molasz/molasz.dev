import React, { useState } from 'react'
import { X, ExternalLink, Cpu, Zap, Terminal, Sparkles, CheckCircle2, Code2 } from 'lucide-react'
import type { ProjectItem } from '../../types/lab'
import { soundFx } from '../../utils/sound'

interface LabNotebookModalProps {
  isOpen: boolean
  onClose: () => void
  soundEnabled: boolean
}

const PROJECTS: ProjectItem[] = [
  {
    id: 'firmware-core',
    title: 'Embedded RTOS & Telemetry Core',
    category: 'Hardware & Firmware',
    date: '2026',
    summary: 'Arquitectura de firmware bare-metal i RTOS per a microcontroladors ARM Cortex-M7 (STM32H7) amb processament de senyals en temps real i telemetria d’alta freqüència.',
    techs: ['C / C++', 'FreeRTOS', 'ARM Cortex-M7', 'DMA', 'SPI/I2C/UART', 'KiCad'],
    metrics: [
      { label: 'Freqüència CPU', value: '480 MHz' },
      { label: 'Latència IRQ', value: '< 1.2 µs' },
      { label: 'Buffer DMA', value: 'Double-buffered' },
    ],
    githubUrl: 'https://github.com/anomalyco',
    status: 'active',
  },
  {
    id: 'signal-scope',
    title: 'WebGL Realtime Signal Scope',
    category: 'DSP & Web Visualizer',
    date: '2025 - 2026',
    summary: 'Visualitzador d’oscil·loscopi digital d’alta fidelitat amb anàlisi espectral FFT en temps real, interfície gràfica amb acceleració WebGL i renderitzat amb Three.js.',
    techs: ['TypeScript', 'Three.js', 'Web Audio DSP', 'WebGL Shaders', 'React'],
    metrics: [
      { label: 'Taxa de refresc', value: '60+ FPS' },
      { label: 'Resolució FFT', value: '2048 punts' },
      { label: 'Latència àudio', value: '< 5 ms' },
    ],
    githubUrl: 'https://github.com/anomalyco',
    status: 'active',
  },
  {
    id: 'custom-ergo-kb',
    title: 'Ergonomic Split Mechanical Keyboard',
    category: 'Hardware & CAD',
    date: '2025',
    summary: 'Disseny integral de teclat mecànic custom: disseny de PCB en KiCad, firmware ZMK / QMK amb connectivitat Bluetooth Low Energy i xassís fresat CNC en alumini.',
    techs: ['KiCad PCB', 'ZMK / QMK Firmware', 'nRF52840 BLE', 'CNC Aluminum', '3D CAD'],
    metrics: [
      { label: 'Tecles', value: '36 Column-stagger' },
      { label: 'Autonomia', value: '3+ mesos BLE' },
      { label: 'Polling rate', value: '1000 Hz USB' },
    ],
    githubUrl: 'https://github.com/anomalyco',
    status: 'completed',
  },
  {
    id: 'lora-edge-node',
    title: 'Ultra-Low Power LoRaWAN Field Node',
    category: 'IoT & Sensors',
    date: '2024 - 2025',
    summary: 'Node sensorial per a monitorització ambiental exterior alimentat per panell solar i supercondensador, amb transmissió LoRa de llarg abast i mode deep-sleep extrem.',
    techs: ['ESP32-S3', 'SX1262 LoRa', 'Solar Harvesting', 'KiCad', 'Rust Embedded'],
    metrics: [
      { label: 'Consum Deep Sleep', value: '4.8 µA' },
      { label: 'Abast LoRa', value: '> 14 km' },
      { label: 'Eficiència MPPT', value: '94%' },
    ],
    githubUrl: 'https://github.com/anomalyco',
    status: 'completed',
  },
]

const SKILLS = [
  { group: 'Llenguatges & Firmware', list: ['C / C++20', 'Rust (Embedded)', 'TypeScript / JavaScript', 'Python', 'Assembly ARM'] },
  { group: 'Hardware & Disseny', list: ['KiCad PCB Design', 'Circuit Prototyping', 'Soldadura SMD (0805/0603/QFN)', 'CAD 3D & CNC', 'Instrumentació Lab'] },
  { group: 'Sistemes & Web', list: ['Three.js / WebGL', 'React 19 / Vite', 'Linux & Embedded Linux', 'FreeRTOS / Zephyr', 'Git / CI-CD'] },
]

export const LabNotebookModal: React.FC<LabNotebookModalProps> = ({ isOpen, onClose, soundEnabled }) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'skills' | 'about'>('projects')

  if (!isOpen) return null

  const handleTabChange = (tab: 'projects' | 'skills' | 'about') => {
    setActiveTab(tab)
    soundFx.click(soundEnabled)
  }

  const handleClose = () => {
    soundFx.click(soundEnabled)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative flex flex-col w-full max-w-3xl max-h-[90vh] bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-slate-100 flex items-center gap-2">
                Laboratori de Hardware & Software
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono">
                  molasz.dev
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">Cuadern de projectes, enginyeria i prototipatge</p>
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

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 px-5 py-2.5 border-b border-slate-800/80 bg-slate-900/50 text-xs font-mono">
          <button
            type="button"
            onClick={() => handleTabChange('projects')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'projects'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-medium'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Projectes destacats
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('skills')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'skills'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-medium'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Habilitats & Stack
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('about')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'about'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-medium'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Sobre el laboratori
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-slate-200">
          {activeTab === 'projects' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PROJECTS.map((proj) => (
                <div
                  key={proj.id}
                  className="flex flex-col justify-between p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-cyan-500/40 transition-all shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-slate-900/80 text-cyan-400 border border-slate-700/80">
                        {proj.category}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">{proj.date}</span>
                    </div>

                    <h3 className="text-sm font-semibold text-slate-100 mb-1.5">{proj.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-3">{proj.summary}</p>

                    {/* Metrics */}
                    {proj.metrics && (
                      <div className="grid grid-cols-3 gap-2 py-2 px-2.5 rounded-lg bg-slate-900/60 border border-slate-800 mb-3 text-[11px] font-mono">
                        {proj.metrics.map((m, idx) => (
                          <div key={idx}>
                            <p className="text-slate-500 text-[10px] truncate">{m.label}</p>
                            <p className="text-slate-200 font-semibold truncate">{m.value}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Tech badges */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {proj.techs.map((t, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700/40"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {proj.githubUrl && (
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        Codi & Detalls
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {SKILLS.map((sg, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
                    <h3 className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider mb-3 pb-2 border-b border-slate-700/50">
                      {sg.group}
                    </h3>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {sg.list.map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono space-y-2">
                <p className="text-slate-400">
                  <span className="text-cyan-400">Laboratori equipat amb:</span> Oscil·loscopi digital de banc, font
                  d'alimentació de precisió regulable, estació de soldadura SMD, multímetre de laboratori, analitzador lògic i
                  eines de fabricació mecànica.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-3">
                <p>
                  Benvingut/da a <strong className="text-slate-100">molasz.dev</strong>, un espai interactiu i laboratori
                  virtual dedicat a la creació de sistemes de hardware, electrònica digital, firmware embebut i aplicacions
                  web interactives 3D.
                </p>
                <p>
                  Aquest entorn està dissenyat amb models 3D proceduralment detallats, textures anti-aliased i un motor
                  d'àudio sintetitzat pur basat en la Web Audio API, oferint una experiència immersiva sense carregar recursos
                  externs pesats.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="https://github.com/anomalyco"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 transition-all font-mono text-xs cursor-pointer"
                >
                  <Code2 className="w-4 h-4" />
                  GitHub Profile
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-800 bg-slate-950/60 text-xs font-mono text-slate-400">
          <span>molasz.dev • Hardware & Software Lab</span>
          <button
            type="button"
            onClick={handleClose}
            className="px-3.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            Tancar
          </button>
        </div>
      </div>
    </div>
  )
}

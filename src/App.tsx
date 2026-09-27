import React, { useState, useEffect, useCallback } from 'react'
import { Scene } from './components/canvas/Scene'
import { Overlay } from './components/ui/Overlay'
import type { ViewPreset, LightingTheme } from './types/lab'
import { soundFx } from './utils/sound'

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewPreset>('overview')
  const [lightingTheme, setLightingTheme] = useState<LightingTheme>('cyber')
  const [lampOn, setLampOn] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [autoTour, setAutoTour] = useState(false)
  const [oscilloscopeMode, setOscilloscopeMode] = useState(0)
  const [powerPreset, setPowerPreset] = useState(0)
  const [solderingPreset, setSolderingPreset] = useState(0)
  const [pcbActive, setPcbActive] = useState(true)
  const [isNotebookOpen, setIsNotebookOpen] = useState(false)

  const handleSelectView = useCallback((view: ViewPreset) => {
    setCurrentView(view)
    setAutoTour(false)
  }, [])

  const handleToggleLamp = useCallback(() => {
    setLampOn((prev) => !prev)
  }, [])

  const handleToggleSound = useCallback(() => {
    setSoundEnabled((prev) => !prev)
  }, [])

  const handleToggleAutoTour = useCallback(() => {
    setAutoTour((prev) => !prev)
  }, [])

  const handleTogglePcb = useCallback(() => {
    setPcbActive((prev) => !prev)
  }, [])

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is inside an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return
      }

      switch (e.key) {
        case '1':
          handleSelectView('overview')
          soundFx.cameraSwoosh(soundEnabled)
          break
        case '2':
          handleSelectView('laptop')
          soundFx.cameraSwoosh(soundEnabled)
          break
        case '3':
          handleSelectView('instruments')
          soundFx.cameraSwoosh(soundEnabled)
          break
        case '4':
          handleSelectView('pcb')
          soundFx.cameraSwoosh(soundEnabled)
          break
        case '5':
          handleSelectView('soldering')
          soundFx.cameraSwoosh(soundEnabled)
          break
        case '6':
          handleSelectView('pegboard')
          soundFx.cameraSwoosh(soundEnabled)
          break
        case '7':
          handleSelectView('topdown')
          soundFx.cameraSwoosh(soundEnabled)
          break
        case 'l':
        case 'L':
          setLampOn((prev) => !prev)
          soundFx.switchRelay(soundEnabled)
          break
        case 's':
        case 'S':
          setSoundEnabled((prev) => {
            const next = !prev
            if (next) soundFx.click(true)
            return next
          })
          break
        case 't':
        case 'T':
          setAutoTour((prev) => !prev)
          soundFx.click(soundEnabled)
          break
        case 'p':
        case 'P':
          setIsNotebookOpen((prev) => !prev)
          soundFx.click(soundEnabled)
          break
        case 'r':
        case 'R':
          handleSelectView('overview')
          soundFx.cameraSwoosh(soundEnabled)
          break
        case 'Escape':
          setIsNotebookOpen(false)
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [soundEnabled, handleSelectView])

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0a0e17]">
      <Scene
        view={currentView}
        onViewChange={setCurrentView}
        lightingTheme={lightingTheme}
        lampOn={lampOn}
        onToggleLamp={handleToggleLamp}
        soundEnabled={soundEnabled}
        autoTour={autoTour}
        onOpenProjects={() => setIsNotebookOpen(true)}
        oscilloscopeMode={oscilloscopeMode}
        onOscilloscopeChange={setOscilloscopeMode}
        powerPreset={powerPreset}
        onPowerPresetChange={setPowerPreset}
        solderingPreset={solderingPreset}
        onSolderingPresetChange={setSolderingPreset}
        pcbActive={pcbActive}
        onPcbToggle={handleTogglePcb}
      />
      <Overlay
        currentView={currentView}
        onSelectView={handleSelectView}
        lightingTheme={lightingTheme}
        onChangeTheme={setLightingTheme}
        lampOn={lampOn}
        onToggleLamp={handleToggleLamp}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        autoTour={autoTour}
        onToggleAutoTour={handleToggleAutoTour}
        oscilloscopeMode={oscilloscopeMode}
        onChangeOscilloscope={setOscilloscopeMode}
        powerPreset={powerPreset}
        onChangePowerPreset={setPowerPreset}
        solderingPreset={solderingPreset}
        onChangeSolderingPreset={setSolderingPreset}
        pcbActive={pcbActive}
        onTogglePcb={handleTogglePcb}
        isNotebookOpen={isNotebookOpen}
        onOpenNotebook={() => setIsNotebookOpen(true)}
        onCloseNotebook={() => setIsNotebookOpen(false)}
      />
    </div>
  )
}

export default App

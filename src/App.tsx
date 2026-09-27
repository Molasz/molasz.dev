import React, { useState, useEffect, useCallback } from 'react'
import { Scene } from './components/canvas/Scene'
import { HomeScene } from './components/canvas/HomeScene'
import { Overlay } from './components/ui/Overlay'
import type { ViewPreset, HomeViewPreset, AppScene } from './types/lab'
import { soundFx } from './utils/sound'

export const App: React.FC = () => {
  const [currentScene, setCurrentScene] = useState<AppScene>('taller')
  const [currentView, setCurrentView] = useState<ViewPreset>('overview')
  const [homeView, setHomeView] = useState<HomeViewPreset>('general')
  const [lampOn, setLampOn] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [autoTour, setAutoTour] = useState(false)
  const [oscilloscopeMode, setOscilloscopeMode] = useState(0)
  const [powerPreset, setPowerPreset] = useState(0)
  const [solderingPreset, setSolderingPreset] = useState(0)
  const [pcbActive, setPcbActive] = useState(true)
  const [isNotebookOpen, setIsNotebookOpen] = useState(false)

  const handleSelectScene = useCallback((scene: AppScene) => {
    setCurrentScene(scene)
    setAutoTour(false)
  }, [])

  const handleSelectView = useCallback((view: ViewPreset) => {
    setCurrentView(view)
    setAutoTour(false)
  }, [])

  const handleSelectHomeView = useCallback((view: HomeViewPreset) => {
    setHomeView(view)
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
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return
      }

      switch (e.key) {
        case '1':
          if (currentScene === 'taller') {
            handleSelectView('overview')
            soundFx.cameraSwoosh(soundEnabled)
          } else {
            handleSelectHomeView('general')
            soundFx.cameraSwoosh(soundEnabled)
          }
          break
        case '2':
          if (currentScene === 'taller') {
            handleSelectView('laptop')
            soundFx.cameraSwoosh(soundEnabled)
          } else {
            handleSelectHomeView('taller_ext')
            soundFx.cameraSwoosh(soundEnabled)
          }
          break
        case '3':
          if (currentScene === 'taller') {
            handleSelectView('instruments')
            soundFx.cameraSwoosh(soundEnabled)
          } else {
            handleSelectHomeView('figuera')
            soundFx.cameraSwoosh(soundEnabled)
          }
          break
        case '4':
          if (currentScene === 'taller') {
            handleSelectView('pcb')
            soundFx.cameraSwoosh(soundEnabled)
          } else {
            handleSelectHomeView('habitacio_ext')
            soundFx.cameraSwoosh(soundEnabled)
          }
          break
        case '5':
          if (currentScene === 'taller') {
            handleSelectView('soldering')
            soundFx.cameraSwoosh(soundEnabled)
          } else {
            handleSelectHomeView('jardi')
            soundFx.cameraSwoosh(soundEnabled)
          }
          break
        case '6':
          if (currentScene === 'taller') {
            handleSelectView('pegboard')
            soundFx.cameraSwoosh(soundEnabled)
          }
          break
        case '7':
          if (currentScene === 'taller') {
            handleSelectView('topdown')
            soundFx.cameraSwoosh(soundEnabled)
          }
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
          if (currentScene === 'taller') {
            setAutoTour((prev) => !prev)
            soundFx.click(soundEnabled)
          }
          break
        case 'p':
        case 'P':
          setIsNotebookOpen((prev) => !prev)
          soundFx.click(soundEnabled)
          break
        case 'r':
        case 'R':
          if (currentScene === 'taller') {
            handleSelectView('overview')
            soundFx.cameraSwoosh(soundEnabled)
          } else {
            handleSelectHomeView('general')
            soundFx.cameraSwoosh(soundEnabled)
          }
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
  }, [soundEnabled, currentScene, handleSelectView, handleSelectHomeView])

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#1e293b]">
      {currentScene === 'home' ? (
        <HomeScene
          view={homeView}
          soundEnabled={soundEnabled}
          onSelectTaller={() => handleSelectScene('taller')}
        />
      ) : (
        <Scene
          view={currentView}
          onViewChange={setCurrentView}
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
      )}

      <Overlay
        currentScene={currentScene}
        onSelectScene={handleSelectScene}
        currentView={currentView}
        onSelectView={handleSelectView}
        homeView={homeView}
        onSelectHomeView={handleSelectHomeView}
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

import React, { useState } from 'react'
import { Scene } from './components/canvas/Scene'
import { Overlay } from './components/ui/Overlay'
import type { ViewPreset } from './components/canvas/CameraController'

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewPreset>('overview')

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950">
      <Overlay currentView={currentView} onSelectView={setCurrentView} />
      <Scene view={currentView} />
    </main>
  )
}

export default App

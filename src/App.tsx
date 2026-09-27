import React, { useState } from 'react'
import { Scene } from './components/canvas/Scene'
import { Overlay } from './components/ui/Overlay'
import type { ViewPreset } from './components/canvas/CameraController'

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewPreset>('overview')

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0a0e17]">
      <Scene view={currentView} />
      <Overlay currentView={currentView} onSelectView={setCurrentView} />
    </div>
  )
}

export default App

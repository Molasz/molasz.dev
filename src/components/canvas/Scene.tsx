import React, { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { Workbench } from './Workbench'
import { Lighting } from './Lighting'
import { Environment } from './Environment'
import { DustParticles } from './DustParticles'
import { CameraController } from './CameraController'
import type { ViewPreset, LightingTheme } from '../../types/lab'

interface SceneProps {
  view: ViewPreset
  onViewChange?: (view: ViewPreset) => void
  lightingTheme: LightingTheme
  lampOn: boolean
  onToggleLamp: () => void
  soundEnabled: boolean
  autoTour: boolean
  onOpenProjects: () => void
  oscilloscopeMode: number
  onOscilloscopeChange: (m: number) => void
  powerPreset: number
  onPowerPresetChange: (p: number) => void
  solderingPreset: number
  onSolderingPresetChange: (s: number) => void
  pcbActive: boolean
  onPcbToggle: () => void
}

export const Scene: React.FC<SceneProps> = ({
  view,
  onViewChange,
  lightingTheme,
  lampOn,
  onToggleLamp,
  soundEnabled,
  autoTour,
  onOpenProjects,
  oscilloscopeMode,
  onOscilloscopeChange,
  powerPreset,
  onPowerPresetChange,
  solderingPreset,
  onSolderingPresetChange,
  pcbActive,
  onPcbToggle,
}) => {
  const controlsRef = useRef<OrbitControlsImpl | null>(null)

  const bgColor = {
    cyber: '#0a0e17',
    warm: '#0f0c0a',
    clean: '#0f172a',
    matrix: '#030a06',
  }[lightingTheme]

  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        shadows
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        camera={{
          position: [0, 1.85, 3.10],
          fov: 45,
          near: 0.1,
          far: 35,
        }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
      >
        <color attach="background" args={[bgColor]} />
        <fog attach="fog" args={[bgColor, 8, 24]} />

        <Suspense fallback={null}>
          <Lighting theme={lightingTheme} lampOn={lampOn} />
          <Workbench
            soundEnabled={soundEnabled}
            lampOn={lampOn}
            onToggleLamp={onToggleLamp}
            onOpenProjects={onOpenProjects}
            oscilloscopeMode={oscilloscopeMode}
            onOscilloscopeChange={onOscilloscopeChange}
            powerPreset={powerPreset}
            onPowerPresetChange={onPowerPresetChange}
            solderingPreset={solderingPreset}
            onSolderingPresetChange={onSolderingPresetChange}
            pcbActive={pcbActive}
            onPcbToggle={onPcbToggle}
          />
          <Environment theme={lightingTheme} />
          <DustParticles count={70} theme={lightingTheme} />
        </Suspense>

        <CameraController
          view={view}
          controlsRef={controlsRef}
          autoTour={autoTour}
          onViewChange={onViewChange}
        />

        <OrbitControls
          ref={controlsRef}
          makeDefault
          target={[0, 0.98, -0.05]}
          minDistance={0.7}
          maxDistance={7.5}
          maxPolarAngle={Math.PI / 2 - 0.05}
          minPolarAngle={0.08}
          enableDamping
          dampingFactor={0.06}
        />
      </Canvas>
    </div>
  )
}

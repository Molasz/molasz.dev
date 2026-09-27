import React, { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { Workbench } from './Workbench'
import { Lighting } from './Lighting'
import { Environment } from './Environment'
import { CameraController } from './CameraController'
import { WorkshopRoom } from './WorkshopRoom'
import { WorkshopStool } from '../props/WorkshopStool'
import { StorageRack } from '../props/StorageRack'
import { TrashBin } from '../props/TrashBin'
import type { ViewPreset } from '../../types/lab'

interface SceneProps {
  view: ViewPreset
  onViewChange?: (view: ViewPreset) => void
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

  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        shadows
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        camera={{
          position: [-1.45, 1.85, 2.40],
          fov: 45,
          near: 0.1,
          far: 35,
        }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.35,
        }}
      >
        <color attach="background" args={['#1e293b']} />
        <fog attach="fog" args={['#1e293b', 16, 40]} />

        <Suspense fallback={null}>
          <Lighting lampOn={lampOn} />

          {/* Architectural Workshop Room */}
          <WorkshopRoom />

          {/* Table Station Group (Positioned at left side near the door: [-1.45, 0, -0.7]) */}
          <group position={[-1.45, 0, -0.7]}>
            {/* Workbench with instruments and tools */}
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

            {/* Workshop Swivel Stool in front of table */}
            <WorkshopStool
              position={[-0.15, 0, 0.68]}
              rotation={[0, -0.2, 0]}
              soundEnabled={soundEnabled}
            />

            {/* Metal Waste Bin beside table */}
            <TrashBin
              position={[1.25, 0, 0.35]}
            />
          </group>

          {/* Industrial Storage Rack along Right Wall */}
          <StorageRack
            position={[2.5, 0, -0.6]}
            rotation={[0, -Math.PI / 2, 0]}
          />

          <Environment />
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
          target={[-1.45, 0.98, -0.75]}
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

import React, { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { Workbench } from './Workbench'
import { Lighting } from './Lighting'
import { Environment } from './Environment'
import { CameraController, type ViewPreset } from './CameraController'

interface SceneProps {
  view: ViewPreset
}

export const Scene: React.FC<SceneProps> = ({ view }) => {
  const controlsRef = useRef<OrbitControlsImpl | null>(null)

  return (
    <div className="absolute inset-0 w-full h-full bg-[#090d16]">
      <Canvas
        shadows
        camera={{
          position: [0, 1.45, 1.85],
          fov: 48,
          near: 0.1,
          far: 30,
        }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
        }}
      >
        <color attach="background" args={['#090d16']} />
        <fog attach="fog" args={['#090d16', 6, 20]} />

        <Suspense fallback={null}>
          <Lighting />
          <Workbench />
          <Environment />
        </Suspense>

        <CameraController view={view} controlsRef={controlsRef} />

        <OrbitControls
          ref={controlsRef}
          makeDefault
          target={[0, 0.95, 0]}
          minDistance={0.5}
          maxDistance={5.5}
          maxPolarAngle={Math.PI / 2 - 0.05}
          minPolarAngle={0.1}
          enableDamping
          dampingFactor={0.06}
        />
      </Canvas>
    </div>
  )
}

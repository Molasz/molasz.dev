import React, { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
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
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        performance={{ min: 0.5 }}
        camera={{
          position: [0, 1.85, 3.10],
          fov: 45,
          near: 0.1,
          far: 30,
        }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
      >
        <color attach="background" args={['#0a0e17']} />
        <fog attach="fog" args={['#0a0e17', 8, 22]} />

        <Suspense fallback={null}>
          <Lighting />
          <Workbench />
          <Environment />
        </Suspense>

        <CameraController view={view} controlsRef={controlsRef} />

        <OrbitControls
          ref={controlsRef}
          makeDefault
          target={[0, 0.98, -0.05]}
          minDistance={0.8}
          maxDistance={7.0}
          maxPolarAngle={Math.PI / 2 - 0.05}
          minPolarAngle={0.1}
          enableDamping
          dampingFactor={0.06}
        />
      </Canvas>
    </div>
  )
}

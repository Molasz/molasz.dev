import React, { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { OutdoorTerrain } from './OutdoorTerrain'
import { DustParticles } from './DustParticles'
import { HomeController } from './HomeController'
import type { HomeViewPreset } from '../../types/lab'

interface HomeSceneProps {
  view?: HomeViewPreset
  soundEnabled: boolean
  onSelectTaller?: () => void
}

export const HomeScene: React.FC<HomeSceneProps> = ({ view = 'general', soundEnabled, onSelectTaller }) => {
  const controlsRef = useRef<OrbitControlsImpl | null>(null)

  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{
          position: [0, 8.5, 16.5],
          fov: 48,
          near: 0.1,
          far: 60,
        }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.35,
        }}
      >
        <color attach="background" args={['#334155']} />
        <fog attach="fog" args={['#334155', 22, 55]} />

        <Suspense fallback={null}>
          <ambientLight intensity={1.3} color="#ffffff" />
          <directionalLight
            position={[12, 22, 10]}
            intensity={2.2}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-bias={-0.0001}
            shadow-camera-near={1}
            shadow-camera-far={50}
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
            color="#ffffff"
          />

          {/* Outdoor Terrain Model based on home.jpg */}
          <OutdoorTerrain
            onSelectTaller={onSelectTaller}
            soundEnabled={soundEnabled}
          />

          {/* Floating Spores */}
          <DustParticles count={50} />
        </Suspense>

        <HomeController view={view} controlsRef={controlsRef} />

        <OrbitControls
          ref={controlsRef}
          makeDefault
          target={[-0.5, 0.8, 0]}
          minDistance={3.0}
          maxDistance={32.0}
          maxPolarAngle={Math.PI / 2 - 0.05}
          minPolarAngle={0.08}
          enableDamping
          dampingFactor={0.06}
        />
      </Canvas>
    </div>
  )
}

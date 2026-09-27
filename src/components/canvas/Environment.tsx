import React, { useMemo } from 'react'
import { Grid, ContactShadows } from '@react-three/drei'
import { getFloorTexture } from '../../utils/textures'
import type { LightingTheme } from '../../types/lab'

interface EnvironmentProps {
  theme?: LightingTheme
}

export const Environment: React.FC<EnvironmentProps> = ({ theme = 'cyber' }) => {
  const floorTexture = useMemo(() => getFloorTexture(), [])

  const gridConfig = {
    cyber: {
      floorColor: '#161d28',
      cellColor: '#1c2533',
      sectionColor: '#253244',
    },
    warm: {
      floorColor: '#201815',
      cellColor: '#2d1f1a',
      sectionColor: '#3d2b22',
    },
    clean: {
      floorColor: '#1e293b',
      cellColor: '#334155',
      sectionColor: '#475569',
    },
    matrix: {
      floorColor: '#0a1410',
      cellColor: '#0f291e',
      sectionColor: '#134e34',
    },
  }[theme]

  return (
    <>
      {/* Studio Floor with Seamless Low-Poly Flagstone */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial
          map={floorTexture}
          color={gridConfig.floorColor}
          roughness={0.9}
          metalness={0.1}
          flatShading
        />
      </mesh>

      {/* Ambient Technical Floor Grid */}
      <Grid
        position={[0, 0, 0]}
        args={[30, 30]}
        cellSize={1.0}
        cellThickness={0.4}
        cellColor={gridConfig.cellColor}
        sectionSize={4.0}
        sectionThickness={0.8}
        sectionColor={gridConfig.sectionColor}
        fadeDistance={18}
        fadeStrength={1.8}
      />

      {/* Soft Contact Shadows Under Table & Legs */}
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.6}
        scale={8.5}
        blur={2.0}
        far={3.5}
        resolution={1024}
        color="#04070c"
      />
    </>
  )
}

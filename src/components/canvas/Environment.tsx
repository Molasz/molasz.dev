import React, { useMemo } from 'react'
import { Grid, ContactShadows } from '@react-three/drei'
import { getFloorTexture } from '../../utils/textures'

export const Environment: React.FC = () => {
  const floorTexture = useMemo(() => getFloorTexture(), [])

  return (
    <>
      {/* Studio Workshop Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial
          map={floorTexture}
          color="#334155"
          roughness={0.75}
          metalness={0.15}
          flatShading
        />
      </mesh>

      {/* Clean Technical Floor Grid */}
      <Grid
        position={[0, 0, 0]}
        args={[30, 30]}
        cellSize={1.0}
        cellThickness={0.5}
        cellColor="#475569"
        sectionSize={4.0}
        sectionThickness={1.0}
        sectionColor="#64748b"
        fadeDistance={22}
        fadeStrength={1.5}
      />

      {/* Soft Contact Shadows Under Table & Legs */}
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.45}
        scale={8.5}
        blur={2.0}
        far={3.5}
        resolution={1024}
        color="#0f172a"
      />
    </>
  )
}

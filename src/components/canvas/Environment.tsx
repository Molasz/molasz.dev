import React, { useMemo } from 'react'
import { Grid, ContactShadows } from '@react-three/drei'
import { getFloorTexture } from '../../utils/textures'

export const Environment: React.FC = () => {
  const floorTexture = useMemo(() => getFloorTexture(), [])

  return (
    <>
      {/* Studio Floor with Seamless Low-Poly Flagstone */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial
          map={floorTexture}
          color="#161d28"
          roughness={0.9}
          metalness={0.1}
          flatShading
        />
      </mesh>

      {/* Soft Ambient Technical Floor Grid (Wide spacing, no shimmering) */}
      <Grid
        position={[0, 0, 0]}
        args={[30, 30]}
        cellSize={1.0}
        cellThickness={0.4}
        cellColor="#1c2533"
        sectionSize={4.0}
        sectionThickness={0.8}
        sectionColor="#253244"
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

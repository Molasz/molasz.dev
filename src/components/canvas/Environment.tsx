import React from 'react'
import { Grid, ContactShadows } from '@react-three/drei'

export const Environment: React.FC = () => {
  return (
    <>
      {/* Workshop Concrete Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Subtle Technical Floor Grid */}
      <Grid
        position={[0, 0, 0]}
        args={[30, 30]}
        cellSize={0.5}
        cellThickness={0.6}
        cellColor="#1e293b"
        sectionSize={2.5}
        sectionThickness={1.2}
        sectionColor="#334155"
        fadeDistance={20}
        fadeStrength={1.5}
      />

      {/* Realistic Ground Contact Shadows */}
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.75}
        scale={10}
        blur={2}
        far={4}
        resolution={1024}
        color="#000000"
      />
    </>
  )
}

import React from 'react'

interface LightingProps {
  lampOn?: boolean
}

export const Lighting: React.FC<LightingProps> = ({ lampOn = true }) => {
  return (
    <>
      {/* 1. Global Balanced Ambient Light */}
      <ambientLight intensity={1.35} color="#ffffff" />

      {/* 2. Main Room Ceiling Directional Light */}
      <directionalLight
        position={[2.0, 5.5, 2.5]}
        intensity={2.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.00015}
        shadow-camera-near={0.5}
        shadow-camera-far={14}
        shadow-camera-left={-3.5}
        shadow-camera-right={3.5}
        shadow-camera-top={3.5}
        shadow-camera-bottom={-3.5}
        color="#ffffff"
      />

      {/* 3. Natural Window Backlight (Streaming from rear window) */}
      <spotLight
        position={[0, 3.2, -3.8]}
        target-position={[-1.0, 0.88, -0.7]}
        intensity={1.8}
        angle={0.8}
        penumbra={0.6}
        distance={10.0}
        color="#f1f5f9"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0002}
      />

      {/* 4. Ceiling Industrial Fluorescent Spotlights */}
      <pointLight
        position={[-1.45, 2.8, -0.4]}
        intensity={1.7}
        distance={5.5}
        color="#ffffff"
      />
      <pointLight
        position={[1.2, 2.8, 0.2]}
        intensity={1.5}
        distance={5.5}
        color="#ffffff"
      />

      {/* 5. Soft Natural Room Fill Lights */}
      <pointLight
        position={[-2.4, 1.6, 1.8]}
        intensity={lampOn ? 0.75 : 0.55}
        distance={5.5}
        color="#f8fafc"
      />
      <pointLight
        position={[2.4, 1.8, 1.8]}
        intensity={0.75}
        distance={5.5}
        color="#f8fafc"
      />
    </>
  )
}

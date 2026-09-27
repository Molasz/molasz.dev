import React from 'react'

export const Lighting: React.FC = () => {
  return (
    <>
      <ambientLight intensity={0.7} color="#f1f5f9" />

      {/* Main Studio Key Light */}
      <directionalLight
        position={[4, 6, 4]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
        color="#ffffff"
      />

      {/* Workbench Overhead Luminaire Light */}
      <spotLight
        position={[0, 1.7, -0.2]}
        target-position={[0, 0.85, 0.05]}
        angle={1.0}
        penumbra={0.5}
        intensity={3.0}
        distance={3.5}
        color="#ffffff"
        castShadow
      />

      {/* Warm Fill Light */}
      <pointLight position={[-2.5, 1.8, 1.5]} intensity={0.5} color="#fed7aa" />

      {/* Cool Rim Accent Light */}
      <pointLight position={[2.5, 2.2, -2]} intensity={0.8} color="#60a5fa" />
    </>
  )
}

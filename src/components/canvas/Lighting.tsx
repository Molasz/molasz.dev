import React from 'react'

export const Lighting: React.FC = () => {
  return (
    <>
      {/* Neutral Balanced Ambient Light */}
      <ambientLight intensity={0.7} color="#dbeafe" />

      {/* Main Studio Key Light */}
      <directionalLight
        position={[3.5, 5, 3]}
        intensity={1.4}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0002}
        shadow-camera-near={0.5}
        shadow-camera-far={12}
        shadow-camera-left={-2}
        shadow-camera-right={2}
        shadow-camera-top={2}
        shadow-camera-bottom={-2}
        color="#fefefe"
      />

      {/* Overhead Luminaire Light */}
      <pointLight
        position={[0, 1.6, -0.1]}
        intensity={0.9}
        distance={2.8}
        color="#f8fafc"
      />

      {/* Soft Warm Side Fill Light */}
      <pointLight position={[-2, 1.3, 1.2]} intensity={0.35} color="#fed7aa" />

      {/* Soft Cool Rim Light */}
      <pointLight position={[2, 1.6, -1.5]} intensity={0.45} color="#93c5fd" />
    </>
  )
}

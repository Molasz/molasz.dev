import React from 'react'

interface TrashBinProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
}

export const TrashBin: React.FC<TrashBinProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}) => {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Perforated Metal Round Waste Bin */}
      <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.13, 0.10, 0.36, 12, 1, true]} />
        <meshStandardMaterial
          color="#334155"
          metalness={0.8}
          roughness={0.35}
          side={2}
          flatShading
        />
      </mesh>
      {/* Base Plate */}
      <mesh position={[0, 0.008, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.10, 0.10, 0.015, 12]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} flatShading />
      </mesh>
      {/* Horizontal Top Rim Collar */}
      <mesh position={[0, 0.36, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.13, 0.006, 6, 16]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.85} flatShading />
      </mesh>
      {/* Discarded Wire Offcuts / Prototype PCB Scrap inside */}
      <group position={[0, 0.12, 0]}>
        <mesh position={[0.02, 0, 0.01]} rotation={[0.4, 0.3, 0.5]}>
          <boxGeometry args={[0.08, 0.002, 0.05]} />
          <meshStandardMaterial color="#1b4332" roughness={0.7} flatShading />
        </mesh>
        <mesh position={[-0.03, 0.02, -0.01]} rotation={[-0.3, 0.5, 0.2]}>
          <cylinderGeometry args={[0.003, 0.003, 0.14, 4]} />
          <meshStandardMaterial color="#ea580c" roughness={0.6} flatShading />
        </mesh>
      </group>
    </group>
  )
}

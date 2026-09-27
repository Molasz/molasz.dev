import React from 'react'

interface PegboardToolsProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
}

export const PegboardTools: React.FC<PegboardToolsProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}) => {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Screwdriver Hanging Rack */}
      <group position={[-0.45, 0.05, 0.02]}>
        <mesh castShadow>
          <boxGeometry args={[0.3, 0.012, 0.06]} />
          <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* 5 Precision Screwdrivers */}
        {[-0.1, -0.05, 0, 0.05, 0.1].map((sx, idx) => {
          const capColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']
          return (
            <group key={idx} position={[sx, -0.04, 0.01]}>
              {/* Shaft */}
              <mesh position={[0, -0.03, 0]} castShadow>
                <cylinderGeometry args={[0.003, 0.003, 0.1, 8]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
              </mesh>
              {/* Grip Handle */}
              <mesh position={[0, 0.04, 0]} castShadow>
                <cylinderGeometry args={[0.008, 0.008, 0.06, 12]} />
                <meshStandardMaterial color="#1e293b" roughness={0.7} />
              </mesh>
              {/* Swivel Top Cap */}
              <mesh position={[0, 0.075, 0]} castShadow>
                <cylinderGeometry args={[0.008, 0.008, 0.01, 12]} />
                <meshStandardMaterial color={capColors[idx]} roughness={0.4} />
              </mesh>
            </group>
          )
        })}
      </group>

      {/* Component Storage Bins (Red & Blue Bins) */}
      <group position={[0.45, 0.02, 0.04]}>
        {[-0.1, 0, 0.1].map((bx, idx) => {
          const binColor = idx === 1 ? '#0284c7' : '#dc2626'
          return (
            <group key={idx} position={[bx, 0, 0]}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[0.08, 0.05, 0.08]} />
                <meshStandardMaterial color={binColor} roughness={0.4} />
              </mesh>
            </group>
          )
        })}
      </group>

      {/* Rolls of Kapton Tape & Electrical Tape */}
      <group position={[0, 0.08, 0.03]}>
        {/* Metal Hanging Peg */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.004, 0.004, 0.08, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Amber Kapton Tape */}
        <mesh position={[0, 0, 0.02]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.015, 24]} />
          <meshStandardMaterial
            color="#d97706"
            transparent
            opacity={0.85}
            roughness={0.3}
          />
        </mesh>
        {/* Black PVC Electrical Tape */}
        <mesh position={[0, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.018, 24]} />
          <meshStandardMaterial color="#0f172a" roughness={0.5} />
        </mesh>
      </group>
    </group>
  )
}

import React from 'react'

interface ToolsProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
}

export const ElectronicsAndTools: React.FC<ToolsProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}) => {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* 1. Prototype Custom PCB Board on ESD Mat */}
      <group position={[0, 0.005, 0]} rotation={[0, 0.15, 0]}>
        {/* PCB Substrate (Matte Black / Dark Green FR4) */}
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.18, 0.003, 0.12]} />
          <meshStandardMaterial color="#064e3b" roughness={0.5} metalness={0.1} />
        </mesh>

        {/* Gold Plated Traces & Pads */}
        <mesh position={[0, 0.0018, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.17, 0.11]} />
          <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Microcontroller MCU (QFP / QFN IC Package) */}
        <mesh position={[-0.02, 0.004, -0.01]} castShadow>
          <boxGeometry args={[0.035, 0.004, 0.035]} />
          <meshStandardMaterial color="#111827" roughness={0.7} />
        </mesh>
        {/* MCU Pin 1 dot */}
        <mesh position={[-0.032, 0.0062, -0.022]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.002, 8]} />
          <meshBasicMaterial color="#94a3b8" />
        </mesh>

        {/* Pin Headers (Dual Row) */}
        <mesh position={[0.07, 0.008, 0]} castShadow>
          <boxGeometry args={[0.012, 0.012, 0.09]} />
          <meshStandardMaterial color="#1f2937" roughness={0.6} />
        </mesh>

        {/* Electrolytic & SMD Capacitors */}
        <mesh position={[-0.06, 0.01, -0.03]} castShadow>
          <cylinderGeometry args={[0.007, 0.007, 0.016, 16]} />
          <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[-0.06, 0.008, 0.02]} castShadow>
          <cylinderGeometry args={[0.006, 0.006, 0.012, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Status Indicator LED (Glowing Blue / Emerald) */}
        <mesh position={[0.03, 0.0045, 0.03]}>
          <boxGeometry args={[0.006, 0.004, 0.004]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#38bdf8"
            emissiveIntensity={1.5}
          />
        </mesh>
      </group>

      {/* 2. Precision ESD Tweezers */}
      <group position={[0.16, 0.004, -0.04]} rotation={[0, -0.4, 0]}>
        <mesh position={[0, 0.002, 0]} castShadow>
          <boxGeometry args={[0.008, 0.003, 0.12]} />
          <meshStandardMaterial color="#0f172a" roughness={0.6} />
        </mesh>
        {/* Fine curved metal tips */}
        <mesh position={[0, 0.002, -0.065]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <coneGeometry args={[0.003, 0.015, 8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* 3. Flush Diagonal Wire Cutters */}
      <group position={[-0.18, 0.008, 0.02]} rotation={[0, 0.6, 0]}>
        {/* Blue Comfort Grip Handles */}
        <mesh position={[-0.02, 0.005, 0.04]} rotation={[0.2, 0, 0.2]} castShadow>
          <cylinderGeometry args={[0.006, 0.008, 0.08, 12]} />
          <meshStandardMaterial color="#0284c7" roughness={0.6} />
        </mesh>
        <mesh position={[0.02, 0.005, 0.04]} rotation={[0.2, 0, -0.2]} castShadow>
          <cylinderGeometry args={[0.006, 0.008, 0.08, 12]} />
          <meshStandardMaterial color="#0284c7" roughness={0.6} />
        </mesh>
        {/* Steel Cutter Jaws & Pivot Joint */}
        <mesh position={[0, 0.006, -0.01]} castShadow>
          <boxGeometry args={[0.025, 0.008, 0.03]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.25} />
        </mesh>
      </group>

      {/* 4. Engineer Coffee Mug on Wood Coaster */}
      <group position={[0.32, 0, 0.15]}>
        {/* Cork / Wood Coaster */}
        <mesh position={[0, 0.002, 0]} receiveShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.004, 24]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>
        {/* Matte Ceramic Mug */}
        <mesh position={[0, 0.048, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.04, 0.036, 0.09, 24, 1, false]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} />
        </mesh>
        {/* Dark Hot Coffee Surface */}
        <mesh position={[0, 0.082, 0]}>
          <cylinderGeometry args={[0.036, 0.036, 0.002, 24]} />
          <meshStandardMaterial color="#2d1808" roughness={0.2} />
        </mesh>
        {/* Mug Handle */}
        <mesh position={[0.045, 0.048, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <torusGeometry args={[0.022, 0.006, 12, 24, Math.PI]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} />
        </mesh>
      </group>
    </group>
  )
}

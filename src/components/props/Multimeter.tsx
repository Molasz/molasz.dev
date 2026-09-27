import React from 'react'

interface MultimeterProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
}

export const Multimeter: React.FC<MultimeterProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}) => {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Yellow Protective Holster */}
      <mesh position={[0, 0.018, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.09, 0.032, 0.17]} />
        <meshStandardMaterial color="#eab308" roughness={0.5} />
      </mesh>

      {/* Dark Inner Body Face */}
      <mesh position={[0, 0.033, 0]}>
        <boxGeometry args={[0.078, 0.005, 0.155]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* LCD Display */}
      <mesh position={[0, 0.036, -0.045]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.065, 0.035]} />
        <meshBasicMaterial color="#a7f3d0" />
      </mesh>

      {/* Rotary Selector Dial */}
      <mesh position={[0, 0.038, 0.015]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.01, 20]} />
        <meshStandardMaterial color="#334155" roughness={0.4} />
      </mesh>

      {/* Banana Jacks (V/Ohm, COM, mA) */}
      <mesh position={[-0.022, 0.036, 0.06]}>
        <cylinderGeometry args={[0.005, 0.005, 0.004, 12]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      <mesh position={[0, 0.036, 0.06]}>
        <cylinderGeometry args={[0.005, 0.005, 0.004, 12]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.022, 0.036, 0.06]}>
        <cylinderGeometry args={[0.005, 0.005, 0.004, 12]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>

      {/* Test Leads / Probe wires */}
      <mesh position={[-0.03, 0.015, 0.1]} rotation={[0.2, 0.3, 0]}>
        <cylinderGeometry args={[0.002, 0.002, 0.09, 8]} />
        <meshStandardMaterial color="#dc2626" roughness={0.8} />
      </mesh>
      <mesh position={[0.02, 0.015, 0.1]} rotation={[0.2, -0.2, 0]}>
        <cylinderGeometry args={[0.002, 0.002, 0.09, 8]} />
        <meshStandardMaterial color="#111827" roughness={0.8} />
      </mesh>
    </group>
  )
}

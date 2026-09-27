import React from 'react'

interface KeyboardMouseProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
}

export const KeyboardMouse: React.FC<KeyboardMouseProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}) => {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Large Extended Deskpad */}
      <mesh position={[0, 0.001, 0]} receiveShadow>
        <boxGeometry args={[0.7, 0.002, 0.3]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>
      {/* Deskpad Accent Stitched Border */}
      <mesh position={[0, 0.0015, 0]}>
        <boxGeometry args={[0.706, 0.001, 0.306]} />
        <meshStandardMaterial color="#0284c7" roughness={0.7} />
      </mesh>

      {/* Compact Mechanical Keyboard */}
      <group position={[-0.1, 0.003, 0]}>
        {/* Aluminum Case */}
        <mesh position={[0, 0.008, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.32, 0.015, 0.13]} />
          <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.4} />
        </mesh>

        {/* Keycaps Array Matrix */}
        <mesh position={[0, 0.017, 0]} castShadow>
          <boxGeometry args={[0.3, 0.006, 0.11]} />
          <meshStandardMaterial
            color="#334155"
            roughness={0.5}
            emissive="#0284c7"
            emissiveIntensity={0.12}
          />
        </mesh>

        {/* Accent Keycaps (Enter, Esc, Space) */}
        <mesh position={[-0.13, 0.019, -0.04]}>
          <boxGeometry args={[0.02, 0.006, 0.018]} />
          <meshStandardMaterial color="#f97316" roughness={0.4} />
        </mesh>
        <mesh position={[0.13, 0.019, 0.01]}>
          <boxGeometry args={[0.025, 0.006, 0.018]} />
          <meshStandardMaterial color="#06b6d4" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.019, 0.04]}>
          <boxGeometry args={[0.12, 0.006, 0.018]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
        </mesh>
      </group>

      {/* Ergonomic Wireless Mouse */}
      <group position={[0.22, 0.003, 0.01]}>
        {/* Mouse Body */}
        <mesh position={[0, 0.015, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.065, 0.028, 0.115]} />
          <meshStandardMaterial color="#1e293b" metalness={0.4} roughness={0.4} />
        </mesh>
        {/* Scroll Wheel */}
        <mesh position={[0, 0.028, -0.025]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.005, 0.005, 0.008, 16]} />
          <meshStandardMaterial color="#0ea5e9" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Thumb Rest Side Accent */}
        <mesh position={[-0.035, 0.01, 0.01]} castShadow>
          <boxGeometry args={[0.01, 0.016, 0.07]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
      </group>
    </group>
  )
}

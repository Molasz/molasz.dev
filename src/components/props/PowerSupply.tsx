import React from 'react'

interface PowerSupplyProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
}

export const PowerSupply: React.FC<PowerSupplyProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}) => {
  const width = 0.22
  const height = 0.18
  const depth = 0.24

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Chassis Body */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Front Faceplate */}
      <mesh position={[0, height / 2, depth / 2 + 0.003]} castShadow>
        <boxGeometry args={[width - 0.01, height - 0.01, 0.005]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>

      {/* Digital LED Displays */}
      {/* Voltage Display (Red LED) */}
      <group position={[0, height - 0.045, depth / 2 + 0.007]}>
        <mesh>
          <boxGeometry args={[0.16, 0.035, 0.002]} />
          <meshBasicMaterial color="#050505" />
        </mesh>
        <mesh position={[0, 0, 0.002]}>
          <planeGeometry args={[0.14, 0.025]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
      </group>

      {/* Current Display (Green LED) */}
      <group position={[0, height - 0.09, depth / 2 + 0.007]}>
        <mesh>
          <boxGeometry args={[0.16, 0.035, 0.002]} />
          <meshBasicMaterial color="#050505" />
        </mesh>
        <mesh position={[0, 0, 0.002]}>
          <planeGeometry args={[0.14, 0.025]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
      </group>

      {/* Voltage & Current Knobs */}
      <mesh
        position={[-0.05, 0.048, depth / 2 + 0.018]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.012, 0.012, 0.018, 16]} />
        <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh
        position={[0.05, 0.048, depth / 2 + 0.018]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.012, 0.012, 0.018, 16]} />
        <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Output Binding Posts (+ Red, - Black, GND Green) */}
      <mesh
        position={[-0.06, 0.02, depth / 2 + 0.018]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.007, 0.007, 0.016, 16]} />
        <meshStandardMaterial color="#dc2626" roughness={0.4} />
      </mesh>
      <mesh
        position={[0, 0.02, depth / 2 + 0.018]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.007, 0.007, 0.016, 16]} />
        <meshStandardMaterial color="#16a34a" roughness={0.4} />
      </mesh>
      <mesh
        position={[0.06, 0.02, depth / 2 + 0.018]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.007, 0.007, 0.016, 16]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} />
      </mesh>
    </group>
  )
}

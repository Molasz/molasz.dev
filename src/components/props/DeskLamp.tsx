import React from 'react'

interface DeskLampProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
}

export const DeskLamp: React.FC<DeskLampProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}) => {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Table Edge Clamp Base */}
      <mesh position={[0, 0.02, 0]} castShadow>
        <boxGeometry args={[0.06, 0.08, 0.06]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Swivel Pivot */}
      <mesh position={[0, 0.07, 0]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.04, 16]} />
        <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Lower Arm (Angled) */}
      <group position={[0, 0.09, 0]} rotation={[0.4, 0.3, -0.4]}>
        <mesh position={[-0.01, 0.18, 0]} castShadow>
          <cylinderGeometry args={[0.005, 0.005, 0.38, 8]} />
          <meshStandardMaterial color="#0284c7" roughness={0.4} metalness={0.6} />
        </mesh>
        <mesh position={[0.01, 0.18, 0]} castShadow>
          <cylinderGeometry args={[0.005, 0.005, 0.38, 8]} />
          <meshStandardMaterial color="#0284c7" roughness={0.4} metalness={0.6} />
        </mesh>

        {/* Elbow Joint */}
        <group position={[0, 0.38, 0]} rotation={[-0.8, -0.1, 0.6]}>
          <mesh castShadow>
            <sphereGeometry args={[0.018, 16, 16]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>

          {/* Upper Arm */}
          <mesh position={[-0.01, 0.16, 0]} castShadow>
            <cylinderGeometry args={[0.005, 0.005, 0.34, 8]} />
            <meshStandardMaterial color="#0284c7" roughness={0.4} metalness={0.6} />
          </mesh>
          <mesh position={[0.01, 0.16, 0]} castShadow>
            <cylinderGeometry args={[0.005, 0.005, 0.34, 8]} />
            <meshStandardMaterial color="#0284c7" roughness={0.4} metalness={0.6} />
          </mesh>

          {/* Lamp Head Assembly */}
          <group position={[0, 0.34, 0]} rotation={[1.1, 0, -0.4]}>
            {/* Lamp Cone Shade */}
            <mesh position={[0, 0.04, 0]} castShadow>
              <coneGeometry args={[0.075, 0.1, 24, 1, true]} />
              <meshStandardMaterial color="#1e293b" side={2} metalness={0.7} roughness={0.3} />
            </mesh>

            {/* Glowing Bulb */}
            <mesh position={[0, 0.02, 0]}>
              <sphereGeometry args={[0.025, 16, 16]} />
              <meshStandardMaterial
                color="#fef08a"
                emissive="#fef08a"
                emissiveIntensity={1.2}
              />
            </mesh>

            {/* Focused Desk Spotlight */}
            <spotLight
              position={[0, 0, 0]}
              target-position={[0, -0.8, 0.3]}
              intensity={2.8}
              angle={0.6}
              penumbra={0.4}
              distance={2.5}
              color="#fef3c7"
              castShadow
            />
          </group>
        </group>
      </group>
    </group>
  )
}

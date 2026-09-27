import React from 'react'

interface SolderingStationProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
}

export const SolderingStation: React.FC<SolderingStationProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}) => {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Main Base Unit */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.16, 0.1, 0.18]} />
          <meshStandardMaterial color="#0284c7" roughness={0.5} metalness={0.2} />
        </mesh>

        {/* Front Dark Bezel */}
        <mesh position={[0, 0.05, 0.091]} castShadow>
          <boxGeometry args={[0.15, 0.09, 0.005]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>

        {/* Digital Temp Display (350 C) */}
        <mesh position={[0, 0.065, 0.094]}>
          <planeGeometry args={[0.08, 0.025]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>

        {/* Up / Down Temp Buttons */}
        <mesh position={[-0.03, 0.028, 0.095]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.007, 0.007, 0.008, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>
        <mesh position={[0.03, 0.028, 0.095]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.007, 0.007, 0.008, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>
      </group>

      {/* Soldering Iron Stand with Brass Tip Cleaner */}
      <group position={[0.16, 0, 0.02]}>
        {/* Heavy Iron Stand Base */}
        <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.12, 0.04, 0.16]} />
          <meshStandardMaterial color="#334155" roughness={0.6} metalness={0.4} />
        </mesh>

        {/* Angled Spring Holder Tube */}
        <group position={[0, 0.04, -0.02]} rotation={[-0.6, 0, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.022, 0.025, 0.12, 16, 1, true]} />
            <meshStandardMaterial
              color="#cbd5e1"
              metalness={0.9}
              roughness={0.2}
              side={2}
            />
          </mesh>

          {/* Soldering Iron inside Stand */}
          <group position={[0, 0.03, 0]}>
            {/* Handle */}
            <mesh position={[0, 0.08, 0]} castShadow>
              <cylinderGeometry args={[0.012, 0.015, 0.14, 16]} />
              <meshStandardMaterial color="#0284c7" roughness={0.6} />
            </mesh>
            {/* Metal Collar */}
            <mesh position={[0, -0.01, 0]} castShadow>
              <cylinderGeometry args={[0.008, 0.008, 0.04, 16]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Glowing Soldering Tip */}
            <mesh position={[0, -0.04, 0]} rotation={[Math.PI, 0, 0]}>
              <coneGeometry args={[0.004, 0.025, 16]} />
              <meshStandardMaterial
                color="#ea580c"
                emissive="#f97316"
                emissiveIntensity={0.6}
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
          </group>
        </group>

        {/* Brass Wire Sponge Cup */}
        <group position={[0, 0.04, 0.04]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.025, 0.022, 0.02, 20]} />
            <meshStandardMaterial color="#1e293b" roughness={0.5} />
          </mesh>
          {/* Golden Brass Curls */}
          <mesh position={[0, 0.012, 0]}>
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshStandardMaterial color="#ca8a04" metalness={0.8} roughness={0.5} />
          </mesh>
        </group>
      </group>

      {/* Solder Wire Spool Holder */}
      <group position={[-0.14, 0, 0.02]}>
        <mesh position={[0, 0.035, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.05, 24]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.3} />
        </mesh>
        {/* Spool Plastic Flanges */}
        <mesh position={[-0.027, 0.035, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.045, 0.045, 0.006, 24]} />
          <meshStandardMaterial color="#0284c7" roughness={0.5} />
        </mesh>
        <mesh position={[0.027, 0.035, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.045, 0.045, 0.006, 24]} />
          <meshStandardMaterial color="#0284c7" roughness={0.5} />
        </mesh>
        {/* Wire hanging out onto desk */}
        <mesh position={[0.02, 0.01, 0.04]} rotation={[0.4, 0.2, 0]}>
          <cylinderGeometry args={[0.0015, 0.0015, 0.07, 8]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    </group>
  )
}

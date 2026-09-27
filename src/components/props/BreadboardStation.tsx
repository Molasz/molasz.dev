import React, { useState, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { soundFx } from '../../utils/sound'

interface BreadboardStationProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  soundEnabled?: boolean
}

export const BreadboardStation: React.FC<BreadboardStationProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  soundEnabled = true,
}) => {
  const [hovered, setHovered] = useState(false)
  const [circuitActive, setCircuitActive] = useState(true)
  const timeRef = useRef(0)
  const ledRef1 = useRef<THREE.MeshStandardMaterial>(null)
  const ledRef2 = useRef<THREE.MeshStandardMaterial>(null)
  const ledRef3 = useRef<THREE.MeshStandardMaterial>(null)

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [hovered])

  useFrame((_, delta) => {
    timeRef.current += delta
    const t = timeRef.current

    if (ledRef1.current) {
      const pulse1 = circuitActive ? (Math.sin(t * 8) > 0 ? 2.2 : 0.2) : 0.05
      ledRef1.current.emissiveIntensity = pulse1
    }
    if (ledRef2.current) {
      const pulse2 = circuitActive ? (Math.sin(t * 12 + 1.2) > 0 ? 2.0 : 0.2) : 0.05
      ledRef2.current.emissiveIntensity = pulse2
    }
    if (ledRef3.current) {
      const pulse3 = circuitActive ? (Math.sin(t * 5 + 2.5) > 0 ? 2.4 : 0.2) : 0.05
      ledRef3.current.emissiveIntensity = pulse3
    }
  })

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    setCircuitActive((prev) => !prev)
    soundFx.click(soundEnabled)
  }

  const bbW = 0.12
  const bbD = 0.082
  const bbH = 0.008

  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* 1. White ABS Plastic Solderless Breadboard Base */}
      <mesh position={[0, bbH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[bbW, bbH, bbD]} />
        <meshStandardMaterial
          color={hovered ? '#ffffff' : '#f1f5f9'}
          roughness={0.7}
          metalness={0.05}
          flatShading
        />
      </mesh>

      {/* Red & Blue Power Rail Lines */}
      <mesh position={[0, bbH + 0.0003, -bbD / 2 + 0.006]}>
        <boxGeometry args={[bbW * 0.92, 0.0005, 0.002]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      <mesh position={[0, bbH + 0.0003, -bbD / 2 + 0.012]}>
        <boxGeometry args={[bbW * 0.92, 0.0005, 0.002]} />
        <meshBasicMaterial color="#3b82f6" />
      </mesh>
      <mesh position={[0, bbH + 0.0003, bbD / 2 - 0.012]}>
        <boxGeometry args={[bbW * 0.92, 0.0005, 0.002]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      <mesh position={[0, bbH + 0.0003, bbD / 2 - 0.006]}>
        <boxGeometry args={[bbW * 0.92, 0.0005, 0.002]} />
        <meshBasicMaterial color="#3b82f6" />
      </mesh>

      {/* Central Divider Notch */}
      <mesh position={[0, bbH + 0.0003, 0]}>
        <boxGeometry args={[bbW * 0.95, 0.0005, 0.004]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.9} flatShading />
      </mesh>

      {/* 2. DIP-8 Integrated Circuit (IC Chip: 555 Timer / OpAmp) */}
      <group position={[-0.02, bbH + 0.003, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.022, 0.004, 0.012]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} flatShading />
        </mesh>
        {/* Notch dot on Pin 1 */}
        <mesh position={[-0.008, 0.0022, -0.003]}>
          <circleGeometry args={[0.001, 6]} />
          <meshBasicMaterial color="#64748b" />
        </mesh>
        {/* Silver Legs */}
        {[-0.008, -0.003, 0.003, 0.008].map((lx, idx) => (
          <group key={idx}>
            <mesh position={[lx, -0.002, -0.007]}>
              <boxGeometry args={[0.0015, 0.003, 0.002]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.9} flatShading />
            </mesh>
            <mesh position={[lx, -0.002, 0.007]}>
              <boxGeometry args={[0.0015, 0.003, 0.002]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.9} flatShading />
            </mesh>
          </group>
        ))}
      </group>

      {/* 3. Blinking Indicator 3mm LEDs */}
      {/* LED 1: Amber */}
      <group position={[0.03, bbH + 0.006, -0.015]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.003, 0.003, 0.008, 6]} />
          <meshStandardMaterial
            ref={ledRef1}
            color="#f59e0b"
            emissive="#d97706"
            emissiveIntensity={1.5}
            transparent
            opacity={0.85}
          />
        </mesh>
      </group>

      {/* LED 2: Emerald Green */}
      <group position={[0.03, bbH + 0.006, 0.005]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.003, 0.003, 0.008, 6]} />
          <meshStandardMaterial
            ref={ledRef2}
            color="#10b981"
            emissive="#059669"
            emissiveIntensity={1.5}
            transparent
            opacity={0.85}
          />
        </mesh>
      </group>

      {/* LED 3: Cyan */}
      <group position={[0.03, bbH + 0.006, 0.022]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.003, 0.003, 0.008, 6]} />
          <meshStandardMaterial
            ref={ledRef3}
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={1.5}
            transparent
            opacity={0.85}
          />
        </mesh>
      </group>

      {/* 4. Mini Trimmer Potentiometer (Blue Box with White Dial) */}
      <group position={[0.045, bbH + 0.004, -0.022]}>
        <mesh castShadow>
          <boxGeometry args={[0.008, 0.007, 0.008]} />
          <meshStandardMaterial color="#2563eb" roughness={0.6} flatShading />
        </mesh>
        <mesh position={[0, 0.004, 0]} rotation={[0, circuitActive ? 0.6 : 0, 0]}>
          <cylinderGeometry args={[0.0025, 0.0025, 0.002, 6]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.5} flatShading />
        </mesh>
      </group>

      {/* 5. Tactile Momentary Push Button */}
      <group position={[-0.042, bbH + 0.003, -0.015]}>
        <mesh castShadow>
          <boxGeometry args={[0.009, 0.004, 0.009]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} flatShading />
        </mesh>
        <mesh position={[0, 0.003, 0]}>
          <cylinderGeometry args={[0.0025, 0.0025, 0.003, 6]} />
          <meshStandardMaterial color="#ea580c" roughness={0.5} flatShading />
        </mesh>
      </group>

      {/* 6. Colorful Curved Breadboard Jumper Wires */}
      {/* Wire 1: Red curved jumper from power rail to IC */}
      <mesh position={[-0.025, bbH + 0.008, -0.015]} rotation={[0.4, 0.2, 0.5]} castShadow>
        <torusGeometry args={[0.014, 0.0012, 6, 12, Math.PI * 0.8]} />
        <meshStandardMaterial color="#ef4444" roughness={0.6} flatShading />
      </mesh>

      {/* Wire 2: Blue curved jumper from IC to LED */}
      <mesh position={[0.005, bbH + 0.009, -0.005]} rotation={[-0.3, 0.6, 0.8]} castShadow>
        <torusGeometry args={[0.018, 0.0012, 6, 12, Math.PI * 0.9]} />
        <meshStandardMaterial color="#3b82f6" roughness={0.6} flatShading />
      </mesh>

      {/* Wire 3: Yellow jumper */}
      <mesh position={[0.01, bbH + 0.008, 0.018]} rotation={[0.6, -0.3, -0.4]} castShadow>
        <torusGeometry args={[0.016, 0.0012, 6, 12, Math.PI * 0.85]} />
        <meshStandardMaterial color="#eab308" roughness={0.6} flatShading />
      </mesh>

      {/* Wire 4: Black ground jumper */}
      <mesh position={[-0.035, bbH + 0.007, 0.02]} rotation={[-0.2, 0.1, 0.3]} castShadow>
        <torusGeometry args={[0.012, 0.0012, 6, 12, Math.PI * 0.8]} />
        <meshStandardMaterial color="#0f172a" roughness={0.7} flatShading />
      </mesh>
    </group>
  )
}

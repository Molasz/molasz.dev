import React, { useMemo, useState, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { getPcbTexture } from '../../utils/textures'
import { soundFx } from '../../utils/sound'

interface ToolsProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  soundEnabled?: boolean
  pcbActive?: boolean
  onPcbToggle?: () => void
}

export const ElectronicsAndTools: React.FC<ToolsProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  soundEnabled = true,
  pcbActive: externalPcbActive,
  onPcbToggle,
}) => {
  const pcbTexture = useMemo(() => getPcbTexture(), [])
  const [internalPcbActive, setInternalPcbActive] = useState(false)
  const isPcbActive = externalPcbActive !== undefined ? externalPcbActive : internalPcbActive

  const [mugWobble, setMugWobble] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [hovered])

  const mugRef = useRef<THREE.Group>(null)
  const wobbleAngle = useRef(0)
  const wobbleVel = useRef(0)
  const timeRef = useRef(0)

  const ledGreenRef = useRef<THREE.MeshStandardMaterial>(null)
  const ledBlueRef = useRef<THREE.MeshStandardMaterial>(null)

  useFrame((_, delta) => {
    timeRef.current += delta
    const t = timeRef.current

    // Mug wobble
    const targetAngle = mugWobble ? 0.15 : 0
    const force = (targetAngle - wobbleAngle.current) * 30 - wobbleVel.current * 8
    wobbleVel.current += force * delta
    wobbleAngle.current += wobbleVel.current * delta
    if (mugRef.current) {
      mugRef.current.rotation.z = wobbleAngle.current
    }
    if (mugWobble && Math.abs(wobbleAngle.current) > 0.1) {
      setMugWobble(false)
    }

    // Dynamic LED pulsing
    if (ledGreenRef.current) {
      ledGreenRef.current.emissiveIntensity = isPcbActive
        ? (Math.sin(t * 12) > 0 ? 2.2 : 0.2)
        : 0.8
    }
    if (ledBlueRef.current) {
      ledBlueRef.current.emissiveIntensity = isPcbActive
        ? (Math.sin(t * 12 + 1.5) > 0 ? 2.2 : 0.2)
        : 0.3
    }
  })

  const handlePcbClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    if (onPcbToggle) {
      onPcbToggle()
    } else {
      setInternalPcbActive((prev) => !prev)
    }
    soundFx.click(soundEnabled)
  }

  const handleMugClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    wobbleVel.current = 1.8
    setMugWobble(true)
    soundFx.click(soundEnabled)
  }

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* 1. Custom Moss Green Prototype PCB Board */}
      <group
        position={[-0.05, 0.005, 0]}
        rotation={[0, 0.15, 0]}
        onClick={handlePcbClick}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
        }}
        onPointerOut={() => setHovered(false)}
      >
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.18, 0.003, 0.12]} />
          <meshStandardMaterial
            color={hovered ? '#244532' : '#1b3325'}
            roughness={0.65}
            metalness={0.1}
            flatShading
          />
        </mesh>

        {/* Textured Copper/Gold Traces */}
        <mesh position={[0, 0.0018, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.17, 0.11]} />
          <meshStandardMaterial
            map={pcbTexture}
            color="#ffffff"
            metalness={0.5}
            roughness={0.4}
            flatShading
          />
        </mesh>

        {/* Microcontroller MCU Package */}
        <mesh position={[-0.02, 0.004, -0.01]} castShadow>
          <boxGeometry args={[0.035, 0.004, 0.035]} />
          <meshStandardMaterial color="#0c1015" roughness={0.8} flatShading />
        </mesh>

        {/* Pin Headers */}
        <mesh position={[0.07, 0.008, 0]} castShadow>
          <boxGeometry args={[0.012, 0.012, 0.09]} />
          <meshStandardMaterial color="#1a202c" roughness={0.6} flatShading />
        </mesh>

        {/* Capacitors */}
        <mesh position={[-0.06, 0.01, -0.03]} castShadow>
          <cylinderGeometry args={[0.007, 0.007, 0.016, 6]} />
          <meshStandardMaterial color="#2d4458" metalness={0.6} roughness={0.35} flatShading />
        </mesh>
        <mesh position={[-0.06, 0.008, 0.02]} castShadow>
          <cylinderGeometry args={[0.006, 0.006, 0.012, 6]} />
          <meshStandardMaterial color="#26384a" metalness={0.6} roughness={0.35} flatShading />
        </mesh>

        {/* Status LEDs */}
        <mesh position={[0.03, 0.0045, 0.03]}>
          <boxGeometry args={[0.006, 0.004, 0.004]} />
          <meshStandardMaterial
            ref={ledGreenRef}
            color="#34d399"
            emissive="#10b981"
            emissiveIntensity={1.0}
            flatShading
          />
        </mesh>
        <mesh position={[0.03, 0.0045, 0.042]}>
          <boxGeometry args={[0.006, 0.004, 0.004]} />
          <meshStandardMaterial
            ref={ledBlueRef}
            color="#38bdf8"
            emissive="#38bdf8"
            emissiveIntensity={0.4}
            flatShading
          />
        </mesh>
      </group>

      {/* 2. Ceramic Stoneware Coffee Mug on Timber Coaster */}
      <group
        ref={mugRef}
        position={[0.82, 0, 0.26]}
        onClick={handleMugClick}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
        }}
        onPointerOut={() => setHovered(false)}
      >
        <mesh position={[0, 0.002, 0]} receiveShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.004, 6]} />
          <meshStandardMaterial color="#78350f" roughness={0.85} flatShading />
        </mesh>
        <mesh position={[0, 0.048, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.04, 0.036, 0.09, 6]} />
          <meshStandardMaterial
            color={hovered ? '#e5dfd2' : '#d8d2c4'}
            roughness={0.55}
            flatShading
          />
        </mesh>
        {/* Coffee */}
        <mesh position={[0, 0.082, 0]}>
          <cylinderGeometry args={[0.036, 0.036, 0.002, 6]} />
          <meshStandardMaterial color="#2d1a10" roughness={0.3} flatShading />
        </mesh>
        {/* Handle */}
        <mesh position={[0.045, 0.048, 0]} castShadow>
          <boxGeometry args={[0.018, 0.05, 0.012]} />
          <meshStandardMaterial color="#d8d2c4" roughness={0.55} flatShading />
        </mesh>
      </group>
    </group>
  )
}

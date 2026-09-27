import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { soundFx } from '../../utils/sound'

interface SolderingStationProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  soundEnabled?: boolean
  tempIndex?: number
  onTempChange?: (idx: number) => void
}

const TEMPS = ['350 °C', '380 °C', '420 °C', 'STBY']

export const SolderingStation: React.FC<SolderingStationProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  soundEnabled = true,
  tempIndex: externalTemp,
  onTempChange,
}) => {
  const [internalTemp, setInternalTemp] = useState(0)
  const currentTemp = externalTemp !== undefined ? externalTemp : internalTemp
  const [isLifted, setIsLifted] = useState(false)
  const [hovered, setHovered] = useState(false)

  const ironGroupRef = useRef<THREE.Group>(null)
  const textureRef = useRef<THREE.CanvasTexture>(null)
  const ironLift = useRef(0)

  const canvas = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 128
    c.height = 36
    return c
  }, [])

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [hovered])

  useFrame(() => {
    const targetLift = isLifted ? 0.04 : 0
    ironLift.current = THREE.MathUtils.lerp(ironLift.current, targetLift, 0.12)
    if (ironGroupRef.current) {
      ironGroupRef.current.position.y = 0.03 + ironLift.current
      ironGroupRef.current.position.z = -ironLift.current * 0.5
    }
  })

  useEffect(() => {
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#0c1017'
      ctx.fillRect(0, 0, 128, 36)
      ctx.fillStyle = '#38bdf8'
      ctx.font = 'bold 20px monospace'
      ctx.fillText(TEMPS[currentTemp % TEMPS.length], 16, 26)
      if (textureRef.current) {
        textureRef.current.needsUpdate = true
      }
    }
  }, [currentTemp, canvas])

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    const next = (currentTemp + 1) % TEMPS.length
    if (onTempChange) {
      onTempChange(next)
    } else {
      setInternalTemp(next)
    }
    setIsLifted((prev) => !prev)
    soundFx.solderSizzle(soundEnabled)
  }

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
      {/* Forged Slate Station Base Unit */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.16, 0.1, 0.18]} />
          <meshStandardMaterial
            color={hovered ? '#354152' : '#28323f'}
            roughness={0.65}
            metalness={0.3}
            flatShading
          />
        </mesh>

        {/* Heat dissipation vents */}
        {[-0.02, 0, 0.02].map((sy, sIdx) => (
          <mesh key={`sol-vent-${sIdx}`} position={[-0.0805, 0.05 + sy, 0]}>
            <boxGeometry args={[0.001, 0.006, 0.08]} />
            <meshStandardMaterial color="#141922" roughness={0.9} flatShading />
          </mesh>
        ))}

        {/* Front Bezel */}
        <mesh position={[0, 0.05, 0.091]} castShadow>
          <boxGeometry args={[0.145, 0.088, 0.005]} />
          <meshStandardMaterial color="#141a22" roughness={0.8} flatShading />
        </mesh>

        {/* Digital Temp Display */}
        <mesh position={[0, 0.065, 0.094]}>
          <planeGeometry args={[0.085, 0.026]} />
          <meshBasicMaterial toneMapped={false}>
            <canvasTexture ref={textureRef} attach="map" image={canvas} />
          </meshBasicMaterial>
        </mesh>

        {/* Brass Temp Buttons */}
        <mesh position={[-0.03, 0.028, 0.095]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.007, 0.007, 0.008, 6]} />
          <meshStandardMaterial color="#b5935b" metalness={0.8} roughness={0.3} flatShading />
        </mesh>
        <mesh position={[0.03, 0.028, 0.095]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.007, 0.007, 0.008, 6]} />
          <meshStandardMaterial color="#b5935b" metalness={0.8} roughness={0.3} flatShading />
        </mesh>
      </group>

      {/* Soldering Iron Stand */}
      <group position={[0.16, 0, 0.02]}>
        <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.12, 0.04, 0.16]} />
          <meshStandardMaterial color="#212832" roughness={0.7} metalness={0.3} flatShading />
        </mesh>

        {/* Angled Brass Spring Cradle */}
        <group position={[0, 0.04, -0.02]} rotation={[-0.6, 0, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.022, 0.025, 0.12, 8, 1, true]} />
            <meshStandardMaterial
              color="#b5935b"
              metalness={0.75}
              roughness={0.35}
              side={2}
              flatShading
            />
          </mesh>

          {/* Soldering Iron */}
          <group ref={ironGroupRef} position={[0, 0.03, 0]}>
            <mesh position={[0, 0.08, 0]} castShadow>
              <cylinderGeometry args={[0.012, 0.015, 0.14, 8]} />
              <meshStandardMaterial color="#2d4458" roughness={0.6} flatShading />
            </mesh>
            <mesh position={[0, 0.02, 0]} castShadow>
              <cylinderGeometry args={[0.013, 0.013, 0.012, 8]} />
              <meshStandardMaterial color="#9a3412" roughness={0.7} flatShading />
            </mesh>
            <mesh position={[0, -0.01, 0]} castShadow>
              <cylinderGeometry args={[0.008, 0.008, 0.04, 8]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} flatShading />
            </mesh>
            <mesh position={[0, -0.04, 0]} rotation={[Math.PI, 0, 0]}>
              <coneGeometry args={[0.004, 0.025, 8]} />
              <meshStandardMaterial
                color="#ea580c"
                emissive="#f97316"
                emissiveIntensity={isLifted ? 1.5 : 0.7}
                metalness={0.7}
                roughness={0.3}
                flatShading
              />
            </mesh>
          </group>
        </group>

        {/* Brass Cleaner Pot */}
        <group position={[0, 0.04, 0.04]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.025, 0.022, 0.02, 8]} />
            <meshStandardMaterial color="#171e27" roughness={0.6} flatShading />
          </mesh>
          <mesh position={[0, 0.012, 0]}>
            <dodecahedronGeometry args={[0.016, 0]} />
            <meshStandardMaterial color="#c29b53" metalness={0.75} roughness={0.45} flatShading />
          </mesh>
        </group>
      </group>

      {/* Solder Spool */}
      <group position={[-0.14, 0, 0.02]}>
        <mesh position={[0, 0.035, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.05, 8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.3} flatShading />
        </mesh>
        <mesh position={[-0.027, 0.035, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.045, 0.045, 0.006, 8]} />
          <meshStandardMaterial color="#2d4458" roughness={0.6} flatShading />
        </mesh>
        <mesh position={[0.027, 0.035, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.045, 0.045, 0.006, 8]} />
          <meshStandardMaterial color="#2d4458" roughness={0.6} flatShading />
        </mesh>
      </group>
    </group>
  )
}

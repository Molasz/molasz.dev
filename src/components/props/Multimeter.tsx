import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { soundFx } from '../../utils/sound'

interface MultimeterProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  soundEnabled?: boolean
}

const MODES = [
  { val: '12.04 V', unit: 'DC V' },
  { val: '03.31 V', unit: 'DC V' },
  { val: '05.02 V', unit: 'DC V' },
  { val: '09.98 k', unit: 'OHM' },
  { val: '00.42 A', unit: 'DC A' },
]

export const Multimeter: React.FC<MultimeterProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  soundEnabled = true,
}) => {
  const [modeIdx, setModeIdx] = useState(0)
  const [hovered, setHovered] = useState(false)
  const dialRef = useRef<THREE.Mesh>(null)
  const textureRef = useRef<THREE.CanvasTexture>(null)
  const dialAngle = useRef(0)

  const canvas = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 128
    c.height = 64
    return c
  }, [])

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [hovered])

  useFrame(() => {
    const target = (modeIdx * Math.PI) / 4
    dialAngle.current = THREE.MathUtils.lerp(dialAngle.current, target, 0.15)
    if (dialRef.current) dialRef.current.rotation.y = dialAngle.current
  })

  useEffect(() => {
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#17222e'
      ctx.fillRect(0, 0, 128, 64)
      ctx.fillStyle = '#93c5fd'
      ctx.font = 'bold 24px monospace'
      ctx.fillText(MODES[modeIdx].val, 10, 36)
      ctx.font = 'bold 12px monospace'
      ctx.fillText(MODES[modeIdx].unit, 70, 54)
      if (textureRef.current) {
        textureRef.current.needsUpdate = true
      }
    }
  }, [modeIdx, canvas])

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    setModeIdx((prev) => (prev + 1) % MODES.length)
    soundFx.click(soundEnabled)
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
      {/* Rubber Protective Holster */}
      <mesh position={[0, 0.018, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.092, 0.034, 0.172]} />
        <meshStandardMaterial
          color={hovered ? '#c49a45' : '#b48a3c'}
          roughness={0.65}
          flatShading
        />
      </mesh>

      {/* Dark Inner Face */}
      <mesh position={[0, 0.031, 0]}>
        <boxGeometry args={[0.078, 0.004, 0.155]} />
        <meshStandardMaterial color="#1a202c" roughness={0.8} flatShading />
      </mesh>

      {/* LCD Bezel Frame */}
      <mesh position={[0, 0.034, -0.045]}>
        <boxGeometry args={[0.068, 0.002, 0.038]} />
        <meshStandardMaterial color="#0c1015" roughness={0.9} flatShading />
      </mesh>

      {/* LCD Screen Display */}
      <mesh position={[0, 0.0355, -0.045]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.064, 0.034]} />
        <meshBasicMaterial toneMapped={false}>
          <canvasTexture ref={textureRef} attach="map" image={canvas} />
        </meshBasicMaterial>
      </mesh>

      {/* Rotary Selector Dial */}
      <group position={[0, 0.036, 0.015]}>
        <mesh ref={dialRef} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.01, 8]} />
          <meshStandardMaterial color="#2d3748" roughness={0.5} flatShading />
        </mesh>
        <mesh position={[0, 0.006, 0]} castShadow>
          <cylinderGeometry args={[0.005, 0.005, 0.002, 6]} />
          <meshStandardMaterial color="#b5935b" metalness={0.8} roughness={0.3} flatShading />
        </mesh>
      </group>

      {/* 4 Shrouded Safety Banana Jacks */}
      {[-0.027, -0.009, 0.009, 0.027].map((jx, idx) => {
        const jackColors = ['#9a3412', '#9a3412', '#0c1015', '#9a3412']
        return (
          <group key={`jack-${idx}`} position={[jx, 0.034, 0.06]}>
            <mesh>
              <cylinderGeometry args={[0.0055, 0.0055, 0.004, 6]} />
              <meshStandardMaterial color={jackColors[idx]} flatShading />
            </mesh>
            <mesh position={[0, 0.0022, 0]}>
              <cylinderGeometry args={[0.003, 0.003, 0.001, 6]} />
              <meshStandardMaterial color="#000000" flatShading />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface PowerSupplyProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
}

const PRESET_VOLTAGES = [
  { v: '03.30 V', a: '0.45 A' },
  { v: '05.00 V', a: '1.20 A' },
  { v: '12.00 V', a: '2.15 A' },
  { v: '24.00 V', a: '0.80 A' },
]

export const PowerSupply: React.FC<PowerSupplyProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}) => {
  const [presetIndex, setPresetIndex] = useState(0)
  const [hovered, setHovered] = useState(false)
  const knobRef = useRef<THREE.Mesh>(null)
  const currentAngle = useRef(0)

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [hovered])

  useFrame(() => {
    const target = (presetIndex * Math.PI) / 3
    currentAngle.current = THREE.MathUtils.lerp(currentAngle.current, target, 0.15)
    if (knobRef.current) knobRef.current.rotation.y = currentAngle.current
  })

  const { vTexture, aTexture } = useMemo(() => {
    const vc = document.createElement('canvas')
    vc.width = 128
    vc.height = 32
    const vtex = new THREE.CanvasTexture(vc)

    const ac = document.createElement('canvas')
    ac.width = 128
    ac.height = 32
    const atex = new THREE.CanvasTexture(ac)

    return { vTexture: vtex, aTexture: atex }
  }, [])

  useEffect(() => {
    const cur = PRESET_VOLTAGES[presetIndex % PRESET_VOLTAGES.length]
    const vc = vTexture.image as HTMLCanvasElement
    const vctx = vc.getContext('2d')
    if (vctx) {
      vctx.fillStyle = '#0a0d14'
      vctx.fillRect(0, 0, 128, 32)
      vctx.fillStyle = '#ea580c'
      vctx.font = 'bold 20px monospace'
      vctx.fillText(cur.v, 14, 24)
      vTexture.needsUpdate = true
    }

    const ac = aTexture.image as HTMLCanvasElement
    const actx = ac.getContext('2d')
    if (actx) {
      actx.fillStyle = '#0a0d14'
      actx.fillRect(0, 0, 128, 32)
      actx.fillStyle = '#10b981'
      actx.font = 'bold 20px monospace'
      actx.fillText(cur.a, 14, 24)
      aTexture.needsUpdate = true
    }
  }, [presetIndex, vTexture, aTexture])

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    setPresetIndex((prev) => (prev + 1) % PRESET_VOLTAGES.length)
  }

  const width = 0.22
  const height = 0.18
  const depth = 0.24

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
      {/* Parchment Stoneware Enclosure with Side Cooling Vents */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color={hovered ? '#e5dfd2' : '#d8d2c4'}
          roughness={0.55}
          metalness={0.1}
          flatShading
        />
      </mesh>

      {/* Side Vents */}
      {[-0.04, -0.015, 0.01, 0.035].map((vy, idx) => (
        <group key={`ps-vent-${idx}`}>
          <mesh position={[-width / 2 - 0.0005, height / 2 + vy, 0]}>
            <boxGeometry args={[0.001, 0.006, 0.12]} />
            <meshStandardMaterial color="#1a222d" roughness={0.9} flatShading />
          </mesh>
          <mesh position={[width / 2 + 0.0005, height / 2 + vy, 0]}>
            <boxGeometry args={[0.001, 0.006, 0.12]} />
            <meshStandardMaterial color="#1a222d" roughness={0.9} flatShading />
          </mesh>
        </group>
      ))}

      {/* Forged Slate Faceplate */}
      <mesh position={[0, height / 2, depth / 2 + 0.003]} castShadow>
        <boxGeometry args={[width - 0.015, height - 0.015, 0.005]} />
        <meshStandardMaterial color="#1e2632" roughness={0.7} flatShading />
      </mesh>

      {/* Voltage Display Panel */}
      <mesh position={[0, height - 0.045, depth / 2 + 0.007]}>
        <planeGeometry args={[0.14, 0.026]} />
        <meshBasicMaterial map={vTexture} />
      </mesh>

      {/* Current Display Panel */}
      <mesh position={[0, height - 0.082, depth / 2 + 0.007]}>
        <planeGeometry args={[0.14, 0.026]} />
        <meshBasicMaterial map={aTexture} />
      </mesh>

      {/* CV / CC Status LEDs */}
      <mesh position={[-0.075, height - 0.045, depth / 2 + 0.007]}>
        <circleGeometry args={[0.003, 6]} />
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[-0.075, height - 0.082, depth / 2 + 0.007]}>
        <circleGeometry args={[0.003, 6]} />
        <meshStandardMaterial color="#ea580c" emissive="#ea580c" emissiveIntensity={0.8} />
      </mesh>

      {/* Brass Knobs with Index Markings */}
      <mesh
        ref={knobRef}
        position={[-0.05, 0.048, depth / 2 + 0.016]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.012, 0.012, 0.016, 8]} />
        <meshStandardMaterial color="#b5935b" metalness={0.8} roughness={0.3} flatShading />
      </mesh>
      <mesh
        position={[0.05, 0.048, depth / 2 + 0.016]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.012, 0.012, 0.016, 8]} />
        <meshStandardMaterial color="#b5935b" metalness={0.8} roughness={0.3} flatShading />
      </mesh>

      {/* Shrouded 5-Way Binding Posts */}
      <mesh position={[-0.06, 0.02, depth / 2 + 0.016]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.007, 0.007, 0.014, 6]} />
        <meshStandardMaterial color="#9a3412" roughness={0.4} flatShading />
      </mesh>
      <mesh position={[0, 0.02, depth / 2 + 0.016]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.007, 0.007, 0.014, 6]} />
        <meshStandardMaterial color="#1b4d3e" roughness={0.4} flatShading />
      </mesh>
      <mesh position={[0.06, 0.02, depth / 2 + 0.016]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.007, 0.007, 0.014, 6]} />
        <meshStandardMaterial color="#141a22" roughness={0.4} flatShading />
      </mesh>
    </group>
  )
}

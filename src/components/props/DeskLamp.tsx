import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { soundFx } from '../../utils/sound'

interface DeskLampProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  isOn?: boolean
  onToggle?: () => void
  soundEnabled?: boolean
}

export const DeskLamp: React.FC<DeskLampProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  isOn = true,
  onToggle,
  soundEnabled = true,
}) => {
  const [hovered, setHovered] = React.useState(false)
  const headRef = useRef<THREE.Group>(null)
  const recoilRef = useRef(0)

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [hovered])

  useFrame(() => {
    recoilRef.current = THREE.MathUtils.lerp(recoilRef.current, 0, 0.15)
    if (headRef.current) {
      headRef.current.rotation.x = 1.1 + recoilRef.current * 0.12
    }
  })

  const toggleLamp = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    recoilRef.current = 1
    soundFx.switchRelay(soundEnabled)
    if (onToggle) {
      onToggle()
    }
  }

  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={toggleLamp}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* Heavy C-Clamp Base with Hand Screw */}
      <mesh position={[0, 0.02, 0]} castShadow>
        <boxGeometry args={[0.06, 0.08, 0.06]} />
        <meshStandardMaterial
          color={hovered ? '#2d3748' : '#1e2430'}
          metalness={0.6}
          roughness={0.4}
          flatShading
        />
      </mesh>
      {/* Brass Clamp Tightener Screw Under Table */}
      <mesh position={[0, -0.03, 0]} castShadow>
        <cylinderGeometry args={[0.005, 0.005, 0.03, 6]} />
        <meshStandardMaterial color="#b5935b" metalness={0.8} roughness={0.3} flatShading />
      </mesh>
      <mesh position={[0, -0.045, 0]} castShadow>
        <boxGeometry args={[0.024, 0.004, 0.012]} />
        <meshStandardMaterial color="#b5935b" metalness={0.8} roughness={0.3} flatShading />
      </mesh>

      {/* Brass Swivel Joint */}
      <mesh position={[0, 0.07, 0]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.04, 8]} />
        <meshStandardMaterial color="#b5935b" metalness={0.8} roughness={0.3} flatShading />
      </mesh>

      {/* Articulated Lower Scissor Arms */}
      <group position={[0, 0.09, 0]} rotation={[0.4, 0.3, -0.4]}>
        <mesh position={[-0.012, 0.18, 0]} castShadow>
          <cylinderGeometry args={[0.005, 0.005, 0.38, 6]} />
          <meshStandardMaterial color="#2d4458" roughness={0.5} metalness={0.5} flatShading />
        </mesh>
        <mesh position={[0.012, 0.18, 0]} castShadow>
          <cylinderGeometry args={[0.005, 0.005, 0.38, 6]} />
          <meshStandardMaterial color="#2d4458" roughness={0.5} metalness={0.5} flatShading />
        </mesh>

        {/* Brass Tension Spring */}
        <mesh position={[0, 0.18, 0.008]} castShadow>
          <cylinderGeometry args={[0.004, 0.004, 0.22, 6]} />
          <meshStandardMaterial color="#b5935b" metalness={0.85} roughness={0.25} flatShading />
        </mesh>

        {/* Brass Elbow Joint */}
        <group position={[0, 0.38, 0]} rotation={[-0.8, -0.1, 0.6]}>
          <mesh castShadow>
            <dodecahedronGeometry args={[0.018, 0]} />
            <meshStandardMaterial color="#b5935b" metalness={0.8} flatShading />
          </mesh>

          {/* Upper Scissor Arms */}
          <mesh position={[-0.012, 0.16, 0]} castShadow>
            <cylinderGeometry args={[0.005, 0.005, 0.34, 6]} />
            <meshStandardMaterial color="#2d4458" roughness={0.5} metalness={0.5} flatShading />
          </mesh>
          <mesh position={[0.012, 0.16, 0]} castShadow>
            <cylinderGeometry args={[0.005, 0.005, 0.34, 6]} />
            <meshStandardMaterial color="#2d4458" roughness={0.5} metalness={0.5} flatShading />
          </mesh>

          {/* Lamp Head, Reflector Dome & Rotary Switch */}
          <group ref={headRef} position={[0, 0.34, 0]} rotation={[1.1, 0, -0.4]}>
            {/* Top Rotary Switch Key */}
            <mesh position={[0, 0.09, 0]} castShadow>
              <cylinderGeometry args={[0.008, 0.008, 0.014, 6]} />
              <meshStandardMaterial color="#b5935b" metalness={0.8} roughness={0.3} flatShading />
            </mesh>

            {/* Dome Reflector Shade */}
            <mesh position={[0, 0.04, 0]} castShadow>
              <coneGeometry args={[0.075, 0.1, 8, 1, true]} />
              <meshStandardMaterial
                color={hovered ? '#26303d' : '#1a222c'}
                side={2}
                metalness={0.6}
                roughness={0.4}
                flatShading
              />
            </mesh>

            {/* Bulb */}
            <mesh position={[0, 0.02, 0]}>
              <octahedronGeometry args={[0.022, 0]} />
              <meshStandardMaterial
                color={isOn ? '#fef3c7' : '#334155'}
                emissive={isOn ? '#fef3c7' : '#000000'}
                emissiveIntensity={isOn ? 1.4 : 0}
                flatShading
              />
            </mesh>

            {/* Warm Task Light */}
            {isOn && (
              <pointLight
                position={[0, -0.02, 0]}
                intensity={1.5}
                distance={2.8}
                color="#fde68a"
              />
            )}
          </group>
        </group>
      </group>
    </group>
  )
}

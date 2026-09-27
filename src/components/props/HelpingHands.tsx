import React, { useState, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { soundFx } from '../../utils/sound'

interface HelpingHandsProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  soundEnabled?: boolean
}

export const HelpingHands: React.FC<HelpingHandsProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  soundEnabled = true,
}) => {
  const [hovered, setHovered] = useState(false)
  const [active, setActive] = useState(false)

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [hovered])

  const armRefLeft = useRef<THREE.Group>(null)
  const armRefRight = useRef<THREE.Group>(null)
  const glassRef = useRef<THREE.Group>(null)
  const timeRef = useRef(0)
  const springVel = useRef(0)
  const springAngle = useRef(0)

  useFrame((_, delta) => {
    timeRef.current += delta

    const targetAngle = active ? 0.2 : 0
    const force = (targetAngle - springAngle.current) * 35 - springVel.current * 7
    springVel.current += force * delta
    springAngle.current += springVel.current * delta

    if (armRefLeft.current) {
      armRefLeft.current.rotation.z = -0.3 + springAngle.current
    }
    if (armRefRight.current) {
      armRefRight.current.rotation.z = 0.3 - springAngle.current
    }
    if (glassRef.current) {
      glassRef.current.rotation.x = 0.4 + Math.sin(springAngle.current * 2) * 0.1
    }
  })

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    setActive((prev) => !prev)
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
      {/* Heavy Hexagonal Cast Iron Base */}
      <mesh position={[0, 0.012, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.045, 0.05, 0.024, 6]} />
        <meshStandardMaterial
          color={hovered ? '#354152' : '#222a36'}
          metalness={0.7}
          roughness={0.4}
          flatShading
        />
      </mesh>

      {/* Brass Central Mast Post */}
      <mesh position={[0, 0.07, 0]} castShadow>
        <cylinderGeometry args={[0.005, 0.005, 0.10, 6]} />
        <meshStandardMaterial color="#b5935b" metalness={0.8} roughness={0.3} flatShading />
      </mesh>

      {/* Crossbar Clamping Collar */}
      <group position={[0, 0.09, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.016, 0.016, 0.016]} />
          <meshStandardMaterial color="#1e2530" roughness={0.6} flatShading />
        </mesh>
        {/* Brass Wing Nut */}
        <mesh position={[0, 0, 0.01]} rotation={[0, 0, active ? 0.7 : 0]} castShadow>
          <boxGeometry args={[0.024, 0.006, 0.004]} />
          <meshStandardMaterial color="#c29b53" metalness={0.85} flatShading />
        </mesh>
        {/* Horizontal Steel Rail */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.004, 0.004, 0.13, 6]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.25} flatShading />
        </mesh>
      </group>

      {/* Left Flexible Gooseneck Arm with Crocodile Clip */}
      <group position={[-0.06, 0.09, 0]} ref={armRefLeft}>
        <mesh position={[0, 0.03, 0.01]} castShadow>
          <cylinderGeometry args={[0.0035, 0.0035, 0.06, 6]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} flatShading />
        </mesh>
        {/* Ball Joint */}
        <mesh position={[0, 0.06, 0.01]} castShadow>
          <sphereGeometry args={[0.006, 6, 6]} />
          <meshStandardMaterial color="#b5935b" metalness={0.85} flatShading />
        </mesh>
        {/* Alligator Clip */}
        <group position={[0, 0.08, 0.01]} rotation={[0.4, 0, -0.3]}>
          <mesh castShadow>
            <boxGeometry args={[0.008, 0.032, 0.006]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} flatShading />
          </mesh>
          {/* Held Component: Resistor */}
          <group position={[0, 0.018, 0]} rotation={[0, 0, Math.PI / 2]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.003, 0.003, 0.016, 6]} />
              <meshStandardMaterial color="#d4b483" roughness={0.5} flatShading />
            </mesh>
            <mesh position={[0, 0.012, 0]}>
              <cylinderGeometry args={[0.0008, 0.0008, 0.014, 4]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.9} flatShading />
            </mesh>
            <mesh position={[0, -0.012, 0]}>
              <cylinderGeometry args={[0.0008, 0.0008, 0.014, 4]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.9} flatShading />
            </mesh>
          </group>
        </group>
      </group>

      {/* Right Flexible Gooseneck Arm with Crocodile Clip */}
      <group position={[0.06, 0.09, 0]} ref={armRefRight}>
        <mesh position={[0, 0.03, 0.01]} castShadow>
          <cylinderGeometry args={[0.0035, 0.0035, 0.06, 6]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} flatShading />
        </mesh>
        <mesh position={[0, 0.06, 0.01]} castShadow>
          <sphereGeometry args={[0.006, 6, 6]} />
          <meshStandardMaterial color="#b5935b" metalness={0.85} flatShading />
        </mesh>
        <group position={[0, 0.08, 0.01]} rotation={[0.4, 0, 0.3]}>
          <mesh castShadow>
            <boxGeometry args={[0.008, 0.032, 0.006]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} flatShading />
          </mesh>
        </group>
      </group>

      {/* Center Magnifying Glass with Brass Rim & Glass Lens */}
      <group position={[0, 0.11, 0.01]} ref={glassRef}>
        <mesh position={[0, 0.02, 0.015]} castShadow>
          <cylinderGeometry args={[0.004, 0.004, 0.04, 6]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.25} flatShading />
        </mesh>
        {/* Brass Lens Frame Ring */}
        <group position={[0, 0.055, 0.025]} rotation={[0.5, 0, 0]}>
          <mesh castShadow>
            <torusGeometry args={[0.026, 0.003, 6, 16]} />
            <meshStandardMaterial color="#c29b53" metalness={0.85} roughness={0.25} flatShading />
          </mesh>
          {/* Glass Lens (Translucent) */}
          <mesh>
            <cylinderGeometry args={[0.025, 0.025, 0.002, 12]} />
            <meshStandardMaterial
              color="#e0f2fe"
              transparent
              opacity={0.45}
              roughness={0.1}
              metalness={0.1}
            />
          </mesh>
        </group>
      </group>
    </group>
  )
}

import React, { useState, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { soundFx } from '../../utils/sound'

interface WorkshopStoolProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  soundEnabled?: boolean
}

export const WorkshopStool: React.FC<WorkshopStoolProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  soundEnabled = true,
}) => {
  const [hovered, setHovered] = useState(false)
  const seatRef = useRef<THREE.Group>(null)
  const [spinVel, setSpinVel] = useState(0)
  const currentAngle = useRef(0)

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [hovered])

  useFrame((_, delta) => {
    if (spinVel > 0.001) {
      currentAngle.current += spinVel * delta
      setSpinVel((prev) => prev * 0.95)
      if (seatRef.current) {
        seatRef.current.rotation.y = currentAngle.current
      }
    }
  })

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    setSpinVel(7.0)
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
      {/* 1. 5-STAR BASE ON CASTERS (At floor level y = 0.04) */}
      <group position={[0, 0.04, 0]}>
        {Array.from({ length: 5 }).map((_, idx) => {
          const angle = (idx / 5) * Math.PI * 2
          const legLen = 0.28
          return (
            <group key={idx} rotation={[0, angle, 0]}>
              {/* Star leg */}
              <mesh position={[legLen / 2, 0, 0]} rotation={[0, 0, -0.08]} castShadow>
                <boxGeometry args={[legLen, 0.018, 0.025]} />
                <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.35} flatShading />
              </mesh>
              {/* Caster Wheel */}
              <group position={[legLen, -0.02, 0]}>
                <mesh castShadow>
                  <cylinderGeometry args={[0.016, 0.016, 0.012, 8]} />
                  <meshStandardMaterial color="#0f172a" roughness={0.8} flatShading />
                </mesh>
                {/* Caster Fork */}
                <mesh position={[0, 0.012, 0]}>
                  <boxGeometry args={[0.012, 0.018, 0.016]} />
                  <meshStandardMaterial color="#cbd5e1" metalness={0.85} flatShading />
                </mesh>
              </group>
            </group>
          )
        })}

        {/* Central Hub */}
        <mesh position={[0, 0.02, 0]} castShadow>
          <cylinderGeometry args={[0.042, 0.048, 0.04, 8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} flatShading />
        </mesh>
      </group>

      {/* 2. CHROME PNEUMATIC CYLINDER & FOOTREST RING */}
      <mesh position={[0, 0.24, 0]} castShadow>
        <cylinderGeometry args={[0.018, 0.022, 0.36, 8]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.92} roughness={0.15} flatShading />
      </mesh>

      {/* Horizontal Footrest Ring with Support Spokes */}
      <group position={[0, 0.18, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.18, 0.009, 6, 18]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} flatShading />
        </mesh>
        {Array.from({ length: 4 }).map((_, i) => (
          <mesh key={i} rotation={[0, (i / 4) * Math.PI * 2, 0]} position={[0.09, 0, 0]} castShadow>
            <boxGeometry args={[0.18, 0.008, 0.012]} />
            <meshStandardMaterial color="#334155" metalness={0.7} flatShading />
          </mesh>
        ))}
      </group>

      {/* 3. ROTATING SEAT & BACKREST ASSEMBLY */}
      <group ref={seatRef} position={[0, 0.44, 0]}>
        {/* Seat Mechanism & Height Lever */}
        <mesh position={[0, 0.015, 0]} castShadow>
          <boxGeometry args={[0.14, 0.03, 0.14]} />
          <meshStandardMaterial color="#1e2430" roughness={0.7} flatShading />
        </mesh>
        <mesh position={[0.08, 0.015, 0.04]} rotation={[0, 0, -0.2]} castShadow>
          <cylinderGeometry args={[0.004, 0.004, 0.09, 6]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.85} flatShading />
        </mesh>
        <mesh position={[0.12, 0.025, 0.04]} castShadow>
          <sphereGeometry args={[0.008, 6, 6]} />
          <meshStandardMaterial color="#ea580c" roughness={0.5} flatShading />
        </mesh>

        {/* Ergonomic Cushioned Seat */}
        <mesh position={[0, 0.045, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.18, 0.19, 0.055, 16]} />
          <meshStandardMaterial
            color={hovered ? '#2d4357' : '#1e2d3d'}
            roughness={0.65}
            metalness={0.15}
            flatShading
          />
        </mesh>

        {/* Backrest Steel Upright Tube */}
        <group position={[0, 0.06, 0.16]}>
          <mesh position={[0, 0.12, 0]} rotation={[-0.15, 0, 0]} castShadow>
            <boxGeometry args={[0.035, 0.24, 0.018]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} flatShading />
          </mesh>
          {/* Cushioned Backrest */}
          <mesh position={[0, 0.22, -0.02]} rotation={[0.08, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.28, 0.14, 0.04]} />
            <meshStandardMaterial
              color={hovered ? '#2d4357' : '#1e2d3d'}
              roughness={0.65}
              metalness={0.15}
              flatShading
            />
          </mesh>
        </group>
      </group>
    </group>
  )
}

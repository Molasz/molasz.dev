import React, { useState, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { soundFx } from '../../utils/sound'

interface FigTreeProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  soundEnabled?: boolean
}

export const FigTree: React.FC<FigTreeProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  soundEnabled = true,
}) => {
  const [hovered, setHovered] = useState(false)
  const canopyRef = useRef<THREE.Group>(null)
  const [rustleVel, setRustleVel] = useState(0)
  const rustleAngle = useRef(0)
  const timeRef = useRef(0)

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [hovered])

  useFrame((_, delta) => {
    timeRef.current += delta
    const gentleBreeze = Math.sin(timeRef.current * 1.5) * 0.015

    if (rustleVel > 0.001) {
      rustleAngle.current = Math.sin(timeRef.current * 20) * rustleVel
      setRustleVel((prev) => prev * 0.94)
    } else {
      rustleAngle.current = 0
    }

    if (canopyRef.current) {
      canopyRef.current.rotation.z = rustleAngle.current + gentleBreeze
      canopyRef.current.rotation.x = gentleBreeze * 0.6
    }
  })

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    setRustleVel(0.12)
    soundFx.click(soundEnabled)
  }

  const trunkColor = '#524b44'
  const foliage1 = '#235940'
  const foliage2 = '#2d6a4f'
  const foliage3 = '#40916c'
  const foliageLight = '#52b788'
  const figColor = '#4c1d45'

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
      {/* 1. STONE PLANTER & MEDITERRANEAN HERB BED */}
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <cylinderGeometry args={[1.55, 1.75, 0.09, 16]} />
        <meshStandardMaterial color="#382b20" roughness={0.92} flatShading />
      </mesh>

      {/* Dry-stone wall border ring */}
      {Array.from({ length: 16 }).map((_, idx) => {
        const a = (idx / 16) * Math.PI * 2
        const rad = 1.65 + (idx % 2 === 0 ? 0.04 : -0.04)
        return (
          <mesh
            key={`border-stone-${idx}`}
            position={[Math.cos(a) * rad, 0.08, Math.sin(a) * rad]}
            rotation={[0.1, a, 0.15]}
            castShadow
            receiveShadow
          >
            <dodecahedronGeometry args={[0.15, 0]} />
            <meshStandardMaterial color="#6b7280" roughness={0.85} flatShading />
          </mesh>
        )
      })}

      {/* Rustic Circular Wood Bench */}
      <group position={[0, 0.28, 0]}>
        <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.25, 0.09, 6, 28]} />
          <meshStandardMaterial color="#6e4222" roughness={0.75} flatShading />
        </mesh>
        {/* Bench Wrought Iron Legs with Curved Brackets */}
        {Array.from({ length: 6 }).map((_, i) => {
          const a = (i / 6) * Math.PI * 2
          return (
            <group key={`leg-${i}`} position={[Math.cos(a) * 1.25, 0, Math.sin(a) * 1.25]} rotation={[0, -a, 0]}>
              <mesh position={[0, -0.14, 0]} castShadow>
                <boxGeometry args={[0.04, 0.28, 0.03]} />
                <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} flatShading />
              </mesh>
              <mesh position={[0, -0.26, 0.03]} castShadow>
                <boxGeometry args={[0.08, 0.02, 0.12]} />
                <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} flatShading />
              </mesh>
            </group>
          )
        })}
      </group>

      {/* Lavender & Rosemary plants around base */}
      {[
        [-1.1, 0.12, 0.9, '#7c3aed'],
        [1.2, 0.12, 0.7, '#8b5cf6'],
        [-0.8, 0.12, -1.2, '#6d28d9'],
        [1.0, 0.12, -1.0, '#15803d'],
      ].map(([lx, ly, lz, col], idx) => (
        <group key={`herb-${idx}`} position={[Number(lx), Number(ly), Number(lz)]}>
          <mesh castShadow>
            <dodecahedronGeometry args={[0.22, 0]} />
            <meshStandardMaterial color="#2d6a4f" roughness={0.8} flatShading />
          </mesh>
          <mesh position={[0, 0.16, 0]} castShadow>
            <dodecahedronGeometry args={[0.16, 0]} />
            <meshStandardMaterial color={String(col)} roughness={0.7} flatShading />
          </mesh>
        </group>
      ))}

      {/* 2. GNARLED SCULPTED FIG TRUNK & ROOT BUTTRESSES */}
      <group position={[0, 0, 0]}>
        {/* Root Flairs Ground Anchors */}
        {[
          [0.35, 0.1, 0.35, [0.3, 0.2, -0.3]],
          [-0.38, 0.1, 0.25, [0.2, -0.4, 0.3]],
          [-0.1, 0.1, -0.42, [-0.4, 0.1, 0.1]],
          [0.32, 0.1, -0.28, [-0.2, 0.3, -0.3]],
        ].map(([rx, ry, rz, rrot], i) => (
          <mesh
            key={`root-${i}`}
            position={[Number(rx), Number(ry), Number(rz)]}
            rotation={rrot as [number, number, number]}
            castShadow
            receiveShadow
          >
            <cylinderGeometry args={[0.14, 0.26, 0.5, 6]} />
            <meshStandardMaterial color={trunkColor} roughness={0.85} flatShading />
          </mesh>
        ))}

        {/* Lower Main Trunk */}
        <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.38, 0.56, 1.3, 8]} />
          <meshStandardMaterial color={trunkColor} roughness={0.85} flatShading />
        </mesh>

        {/* Middle Knotted Crotch */}
        <mesh position={[0.02, 1.35, 0.02]} castShadow receiveShadow>
          <dodecahedronGeometry args={[0.48, 0]} />
          <meshStandardMaterial color={trunkColor} roughness={0.85} flatShading />
        </mesh>

        {/* Branch 1 (North-East Spreading Limb) */}
        <group position={[0.35, 1.45, 0.32]} rotation={[0.45, 0.3, -0.45]}>
          <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.18, 0.28, 1.1, 7]} />
            <meshStandardMaterial color={trunkColor} roughness={0.85} flatShading />
          </mesh>
          <mesh position={[0.2, 1.1, 0]} rotation={[0.2, 0, -0.3]} castShadow receiveShadow>
            <cylinderGeometry args={[0.12, 0.18, 0.9, 6]} />
            <meshStandardMaterial color={trunkColor} roughness={0.85} flatShading />
          </mesh>
        </group>

        {/* Branch 2 (North-West Spreading Limb) */}
        <group position={[-0.42, 1.5, 0.22]} rotation={[0.4, -0.5, 0.5]}>
          <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.17, 0.26, 1.2, 7]} />
            <meshStandardMaterial color={trunkColor} roughness={0.85} flatShading />
          </mesh>
          <mesh position={[-0.2, 1.15, 0.1]} rotation={[0.1, -0.2, 0.35]} castShadow receiveShadow>
            <cylinderGeometry args={[0.11, 0.17, 0.85, 6]} />
            <meshStandardMaterial color={trunkColor} roughness={0.85} flatShading />
          </mesh>
        </group>

        {/* Branch 3 (South Spreading Limb) */}
        <group position={[0.05, 1.55, -0.48]} rotation={[-0.55, 0.1, 0.1]}>
          <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.18, 0.28, 1.2, 7]} />
            <meshStandardMaterial color={trunkColor} roughness={0.85} flatShading />
          </mesh>
          <mesh position={[0.05, 1.2, -0.15]} rotation={[-0.3, 0.1, -0.2]} castShadow receiveShadow>
            <cylinderGeometry args={[0.12, 0.18, 0.9, 6]} />
            <meshStandardMaterial color={trunkColor} roughness={0.85} flatShading />
          </mesh>
        </group>

        {/* Branch 4 (Central Upper Canopy Limb) */}
        <mesh position={[0.02, 1.85, 0.05]} rotation={[0.1, 0.2, -0.15]} castShadow receiveShadow>
          <cylinderGeometry args={[0.20, 0.32, 1.2, 7]} />
          <meshStandardMaterial color={trunkColor} roughness={0.85} flatShading />
        </mesh>
      </group>

      {/* 3. MULTI-LAYERED FIG FOLIAGE CANOPY & HANGING FRUITS */}
      <group ref={canopyRef} position={[0, 2.1, 0]}>
        {/* Top Dome Foliage */}
        <mesh position={[0, 1.35, 0]} castShadow receiveShadow>
          <dodecahedronGeometry args={[1.55, 1]} />
          <meshStandardMaterial color={foliage1} roughness={0.8} flatShading />
        </mesh>

        {/* North-East Canopy */}
        <mesh position={[1.4, 0.95, 1.0]} castShadow receiveShadow>
          <dodecahedronGeometry args={[1.38, 1]} />
          <meshStandardMaterial color={foliage2} roughness={0.8} flatShading />
        </mesh>
        <mesh position={[1.9, 0.55, 0.8]} castShadow receiveShadow>
          <dodecahedronGeometry args={[1.1, 1]} />
          <meshStandardMaterial color={foliageLight} roughness={0.8} flatShading />
        </mesh>

        {/* North-West Canopy */}
        <mesh position={[-1.45, 1.0, 0.9]} castShadow receiveShadow>
          <dodecahedronGeometry args={[1.42, 1]} />
          <meshStandardMaterial color={foliage3} roughness={0.8} flatShading />
        </mesh>
        <mesh position={[-1.95, 0.55, 0.7]} castShadow receiveShadow>
          <dodecahedronGeometry args={[1.15, 1]} />
          <meshStandardMaterial color={foliage2} roughness={0.8} flatShading />
        </mesh>

        {/* South Canopy */}
        <mesh position={[0.3, 1.05, -1.45]} castShadow receiveShadow>
          <dodecahedronGeometry args={[1.48, 1]} />
          <meshStandardMaterial color={foliage2} roughness={0.8} flatShading />
        </mesh>
        <mesh position={[0.4, 0.6, -2.0]} castShadow receiveShadow>
          <dodecahedronGeometry args={[1.18, 1]} />
          <meshStandardMaterial color={foliage3} roughness={0.8} flatShading />
        </mesh>

        {/* Lower Shaded Perimeter Wings */}
        <mesh position={[-1.1, 0.45, -1.1]} castShadow receiveShadow>
          <dodecahedronGeometry args={[1.22, 1]} />
          <meshStandardMaterial color={foliage1} roughness={0.8} flatShading />
        </mesh>
        <mesh position={[1.2, 0.5, -0.9]} castShadow receiveShadow>
          <dodecahedronGeometry args={[1.25, 1]} />
          <meshStandardMaterial color={foliage3} roughness={0.8} flatShading />
        </mesh>
        <mesh position={[0, 0.55, 1.55]} castShadow receiveShadow>
          <dodecahedronGeometry args={[1.30, 1]} />
          <meshStandardMaterial color={foliageLight} roughness={0.8} flatShading />
        </mesh>

        {/* Hanging Fig Fruits (Figues) */}
        {[
          [-0.8, 0.15, 0.9],
          [0.9, 0.2, 0.8],
          [-0.6, 0.25, -1.1],
          [0.7, 0.1, -0.9],
          [0.2, 0.05, 1.3],
          [-1.0, 0.15, -0.3],
          [1.1, 0.1, -0.2],
          [-0.2, 0.05, -1.5],
        ].map(([fx, fy, fz], idx) => (
          <mesh key={`fig-${idx}`} position={[fx, fy, fz]} castShadow>
            <sphereGeometry args={[0.08, 6, 6]} />
            <meshStandardMaterial color={figColor} roughness={0.45} metalness={0.1} flatShading />
          </mesh>
        ))}
      </group>
    </group>
  )
}

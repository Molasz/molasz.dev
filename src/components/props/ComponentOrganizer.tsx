import React, { useState, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { soundFx } from '../../utils/sound'

interface ComponentOrganizerProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  soundEnabled?: boolean
}

const COLS = 3
const ROWS = 3
const BOX_W = 0.18
const BOX_H = 0.15
const BOX_D = 0.10
const DRAWER_W = 0.048
const DRAWER_H = 0.038
const DRAWER_D = 0.09

const DRAWER_COLORS = [
  '#f59e0b', '#3b82f6', '#10b981',
  '#8b5cf6', '#06b6d4', '#ef4444',
  '#ec4899', '#f97316', '#64748b',
]

export const ComponentOrganizer: React.FC<ComponentOrganizerProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  soundEnabled = true,
}) => {
  const [hovered, setHovered] = useState(false)
  const [openDrawer, setOpenDrawer] = useState<number | null>(4)

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [hovered])

  const drawerGroupRefs = useRef<(THREE.Group | null)[]>([])
  const drawerOffsets = useRef<number[]>([0, 0, 0, 0, 0.025, 0, 0, 0, 0])

  useFrame(() => {
    for (let i = 0; i < 9; i++) {
      const target = openDrawer === i ? 0.035 : 0
      drawerOffsets.current[i] = THREE.MathUtils.lerp(drawerOffsets.current[i], target, 0.15)
      const grp = drawerGroupRefs.current[i]
      if (grp) {
        grp.position.z = BOX_D / 2 - DRAWER_D / 2 + drawerOffsets.current[i]
      }
    }
  })

  const handleToggle = (idx: number, e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    setOpenDrawer((prev) => (prev === idx ? null : idx))
    soundFx.click(soundEnabled)
  }

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Outer Slate Cabinet Frame */}
      <mesh position={[0, BOX_H / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[BOX_W, BOX_H, BOX_D]} />
        <meshStandardMaterial
          color={hovered ? '#2d3748' : '#1e2530'}
          metalness={0.6}
          roughness={0.45}
          flatShading
        />
      </mesh>

      {/* 9 Component Drawers in a 3x3 Grid */}
      {Array.from({ length: ROWS }).map((_, r) => {
        return Array.from({ length: COLS }).map((_, c) => {
          const idx = r * COLS + c
          const posX = -BOX_W / 2 + 0.015 + c * (DRAWER_W + 0.007) + DRAWER_W / 2
          const posY = BOX_H / 2 + 0.045 - r * (DRAWER_H + 0.006)

          return (
            <group
              key={idx}
              ref={(el) => {
                drawerGroupRefs.current[idx] = el
              }}
              position={[posX, posY, BOX_D / 2 - DRAWER_D / 2]}
              onClick={(e) => handleToggle(idx, e)}
              onPointerOver={(e) => {
                e.stopPropagation()
                setHovered(true)
              }}
              onPointerOut={() => setHovered(false)}
            >
              {/* Semi-translucent Drawer Bin */}
              <mesh position={[0, 0, 0]} castShadow>
                <boxGeometry args={[DRAWER_W, DRAWER_H, DRAWER_D]} />
                <meshStandardMaterial
                  color="#334155"
                  metalness={0.2}
                  roughness={0.3}
                  transparent
                  opacity={0.88}
                  flatShading
                />
              </mesh>

              {/* Drawer Pull Handle */}
              <mesh position={[0, -0.002, DRAWER_D / 2 + 0.003]} castShadow>
                <boxGeometry args={[0.02, 0.006, 0.004]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.2} flatShading />
              </mesh>

              {/* Color coded label badge */}
              <mesh position={[0, 0.008, DRAWER_D / 2 + 0.001]}>
                <planeGeometry args={[0.034, 0.010]} />
                <meshBasicMaterial color={DRAWER_COLORS[idx]} />
              </mesh>

              {/* Tiny SMD Parts inside if drawer is slid out */}
              {openDrawer === idx && (
                <group position={[0, -0.01, 0.02]}>
                  {[-0.01, 0, 0.01].map((sx, pi) => (
                    <mesh key={pi} position={[sx, 0, 0]} castShadow>
                      <boxGeometry args={[0.004, 0.002, 0.008]} />
                      <meshStandardMaterial color="#1e293b" metalness={0.7} flatShading />
                    </mesh>
                  ))}
                </group>
              )}
            </group>
          )
        })
      })}
    </group>
  )
}

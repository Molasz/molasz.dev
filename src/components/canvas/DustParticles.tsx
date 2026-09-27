import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface DustParticlesProps {
  count?: number
}

function generateInitialParticles(count: number): [Float32Array, Float32Array] {
  const pos = new Float32Array(count * 3)
  const spd = new Float32Array(count * 3)

  let seed = 42
  const pseudoRandom = () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }

  for (let i = 0; i < count; i++) {
    pos[i * 3] = (pseudoRandom() - 0.5) * 3.0
    pos[i * 3 + 1] = 0.8 + pseudoRandom() * 1.5
    pos[i * 3 + 2] = (pseudoRandom() - 0.5) * 2.0

    spd[i * 3] = (pseudoRandom() - 0.5) * 0.04
    spd[i * 3 + 1] = 0.02 + pseudoRandom() * 0.04
    spd[i * 3 + 2] = (pseudoRandom() - 0.5) * 0.04
  }
  return [pos, spd]
}

export const DustParticles: React.FC<DustParticlesProps> = ({ count = 65 }) => {
  const pointsRef = useRef<THREE.Points>(null)

  const [positions, speeds] = useMemo(() => {
    return generateInitialParticles(count)
  }, [count])

  useFrame((_, delta) => {
    if (!pointsRef.current) return
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const array = posAttr.array as Float32Array

    for (let i = 0; i < count; i++) {
      array[i * 3] += speeds[i * 3] * delta
      array[i * 3 + 1] += speeds[i * 3 + 1] * delta
      array[i * 3 + 2] += speeds[i * 3 + 2] * delta

      if (array[i * 3 + 1] > 2.3) {
        array[i * 3 + 1] = 0.82
        array[i * 3] = ((i % 10) / 10 - 0.5) * 2.6
        array[i * 3 + 2] = (((i * 7) % 10) / 10 - 0.5) * 1.8
      }
    }
    posAttr.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#e0f2fe"
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

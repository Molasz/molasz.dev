import React, { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

export type ViewPreset = 'overview' | 'laptop' | 'instruments' | 'soldering'

interface CameraControllerProps {
  view: ViewPreset
  controlsRef: React.RefObject<OrbitControlsImpl | null>
}

const VIEW_CONFIGS: Record<ViewPreset, { pos: [number, number, number]; target: [number, number, number] }> = {
  overview: {
    pos: [0, 1.45, 1.85],
    target: [0, 0.95, 0],
  },
  laptop: {
    pos: [-0.65, 1.12, 0.48],
    target: [-0.65, 0.94, 0.05],
  },
  instruments: {
    pos: [-0.3, 1.6, 0.35],
    target: [-0.3, 1.46, -0.32],
  },
  soldering: {
    pos: [0.45, 1.18, 0.48],
    target: [0.35, 0.9, 0.05],
  },
}

export const CameraController: React.FC<CameraControllerProps> = ({ view, controlsRef }) => {
  const { camera } = useThree()
  const targetPos = useRef(new THREE.Vector3())
  const targetLookAt = useRef(new THREE.Vector3())
  const isTransitioning = useRef(true)
  const currentView = useRef(view)

  if (currentView.current !== view) {
    currentView.current = view
    isTransitioning.current = true
  }

  useFrame(() => {
    if (!isTransitioning.current) return

    const config = VIEW_CONFIGS[view]
    targetPos.current.set(...config.pos)
    targetLookAt.current.set(...config.target)

    camera.position.lerp(targetPos.current, 0.06)

    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLookAt.current, 0.06)
      controlsRef.current.update()
    }

    if (
      camera.position.distanceTo(targetPos.current) < 0.01 &&
      (controlsRef.current ? controlsRef.current.target.distanceTo(targetLookAt.current) < 0.01 : true)
    ) {
      isTransitioning.current = false
    }
  })

  return null
}

import React, { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

export type ViewPreset = 'overview' | 'laptop' | 'instruments' | 'pcb' | 'soldering'

interface CameraControllerProps {
  view: ViewPreset
  controlsRef: React.RefObject<OrbitControlsImpl | null>
}

const VIEW_CONFIGS: Record<ViewPreset, { pos: [number, number, number]; target: [number, number, number] }> = {
  overview: {
    pos: [0, 1.85, 3.10],
    target: [0, 0.98, -0.05],
  },
  laptop: {
    pos: [-0.68, 1.15, 0.52],
    target: [-0.68, 0.94, 0.08],
  },
  instruments: {
    pos: [-0.18, 1.65, 0.40],
    target: [-0.20, 1.46, -0.32],
  },
  pcb: {
    pos: [-0.05, 1.25, 0.35],
    target: [-0.05, 0.88, -0.04],
  },
  soldering: {
    pos: [0.72, 1.18, 0.38],
    target: [0.72, 0.94, -0.08],
  },
}

export const CameraController: React.FC<CameraControllerProps> = ({ view, controlsRef }) => {
  const { camera, size } = useThree()
  const targetPos = useRef(new THREE.Vector3())
  const targetLookAt = useRef(new THREE.Vector3())
  const isTransitioning = useRef(true)
  const currentView = useRef(view)

  if (currentView.current !== view) {
    currentView.current = view
    isTransitioning.current = true
  }

  useFrame(() => {
    const aspect = size.width / Math.max(1, size.height)
    const config = VIEW_CONFIGS[view]

    // Calculate responsive camera position based on screen aspect ratio
    let [px, py, pz] = config.pos
    if (view === 'overview') {
      if (aspect < 1.0) {
        // Mobile portrait: pull back to keep the whole workbench in view
        const factor = Math.min(2.4, 1.6 / aspect)
        py = 1.85 + factor * 0.25
        pz = 2.80 * factor
      } else if (aspect < 1.6) {
        // Tablet / 4:3 screens
        const factor = 1.6 / aspect
        py = 1.85 + (factor - 1) * 0.15
        pz = 3.10 * factor
      }
    }

    targetPos.current.set(px, py, pz)
    targetLookAt.current.set(...config.target)

    if (isTransitioning.current) {
      camera.position.lerp(targetPos.current, 0.07)

      if (controlsRef.current) {
        controlsRef.current.target.lerp(targetLookAt.current, 0.07)
        controlsRef.current.update()
      }

      if (
        camera.position.distanceTo(targetPos.current) < 0.01 &&
        (controlsRef.current ? controlsRef.current.target.distanceTo(targetLookAt.current) < 0.01 : true)
      ) {
        isTransitioning.current = false
      }
    }
  })

  return null
}

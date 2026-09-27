import React, { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { type ViewPreset, VIEW_CONFIGS } from '../../types/lab'

interface CameraControllerProps {
  view: ViewPreset
  controlsRef: React.RefObject<OrbitControlsImpl | null>
  autoTour?: boolean
  onViewChange?: (view: ViewPreset) => void
}

export const CameraController: React.FC<CameraControllerProps> = ({
  view,
  controlsRef,
  autoTour = false,
  onViewChange,
}) => {
  const { camera, size } = useThree()
  const targetPos = useRef(new THREE.Vector3())
  const targetLookAt = useRef(new THREE.Vector3())
  const isTransitioning = useRef(true)
  const autoTourTimer = useRef(0)
  const tourIndex = useRef(0)

  useEffect(() => {
    isTransitioning.current = true
  }, [view])

  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return

    const handleUserInteraction = () => {
      isTransitioning.current = false
    }

    controls.addEventListener('start', handleUserInteraction)
    return () => {
      controls.removeEventListener('start', handleUserInteraction)
    }
  }, [controlsRef])

  useFrame((_, delta) => {
    if (autoTour) {
      autoTourTimer.current += delta
      if (autoTourTimer.current > 7.0) {
        autoTourTimer.current = 0
        const tourPresets: ViewPreset[] = ['overview', 'laptop', 'pcb', 'instruments', 'soldering', 'pegboard']
        tourIndex.current = (tourIndex.current + 1) % tourPresets.length
        const nextView = tourPresets[tourIndex.current]
        if (onViewChange) {
          onViewChange(nextView)
        }
      }
    }

    if (!isTransitioning.current) {
      if (autoTour && controlsRef.current) {
        controlsRef.current.autoRotate = true
        controlsRef.current.autoRotateSpeed = 0.6
      } else if (controlsRef.current) {
        controlsRef.current.autoRotate = false
      }
      return
    }

    if (controlsRef.current) {
      controlsRef.current.autoRotate = false
    }

    const aspect = size.width / Math.max(1, size.height)
    const config = VIEW_CONFIGS[view]

    let [px, py, pz] = config.pos
    if (view === 'overview') {
      if (aspect < 1.0) {
        const factor = Math.min(2.4, 1.6 / aspect)
        py = 1.85 + factor * 0.25
        pz = 2.80 * factor
      } else if (aspect < 1.6) {
        const factor = 1.6 / aspect
        py = 1.85 + (factor - 1) * 0.15
        pz = 3.10 * factor
      }
    } else if (view === 'topdown') {
      if (aspect < 1.0) {
        py = 3.6
      }
    }

    targetPos.current.set(px, py, pz)
    targetLookAt.current.set(...config.target)

    camera.position.lerp(targetPos.current, 0.075)

    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLookAt.current, 0.075)
      controlsRef.current.update()
    }

    if (
      camera.position.distanceTo(targetPos.current) < 0.025 &&
      (controlsRef.current ? controlsRef.current.target.distanceTo(targetLookAt.current) < 0.025 : true)
    ) {
      isTransitioning.current = false
    }
  })

  return null
}

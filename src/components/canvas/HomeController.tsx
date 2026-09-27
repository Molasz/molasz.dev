import React, { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { type HomeViewPreset, HOME_VIEW_CONFIGS } from '../../types/lab'

interface HomeControllerProps {
  view: HomeViewPreset
  controlsRef: React.RefObject<OrbitControlsImpl | null>
}

export const HomeController: React.FC<HomeControllerProps> = ({ view, controlsRef }) => {
  const { camera } = useThree()
  const targetPos = useRef(new THREE.Vector3())
  const targetLookAt = useRef(new THREE.Vector3())
  const isTransitioning = useRef(true)

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

  useFrame(() => {
    if (!isTransitioning.current) return

    const config = HOME_VIEW_CONFIGS[view]
    targetPos.current.set(...config.pos)
    targetLookAt.current.set(...config.target)

    camera.position.lerp(targetPos.current, 0.075)

    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLookAt.current, 0.075)
      controlsRef.current.update()
    }

    if (
      camera.position.distanceTo(targetPos.current) < 0.03 &&
      (controlsRef.current ? controlsRef.current.target.distanceTo(targetLookAt.current) < 0.03 : true)
    ) {
      isTransitioning.current = false
    }
  })

  return null
}

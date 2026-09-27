import React from 'react'
import type { LightingTheme } from '../../types/lab'

interface LightingProps {
  theme?: LightingTheme
  lampOn?: boolean
}

export const Lighting: React.FC<LightingProps> = ({ theme = 'cyber', lampOn = true }) => {
  const config = {
    cyber: {
      ambient: '#dbeafe',
      ambientIntensity: 0.65,
      keyLight: '#f8fafc',
      keyIntensity: 1.35,
      overhead: '#e0f2fe',
      overheadIntensity: lampOn ? 0.85 : 0.65,
      warmFill: '#fed7aa',
      warmFillIntensity: lampOn ? 0.35 : 0.15,
      coolRim: '#60a5fa',
      coolRimIntensity: 0.55,
    },
    warm: {
      ambient: '#fed7aa',
      ambientIntensity: 0.75,
      keyLight: '#fffbeb',
      keyIntensity: 1.4,
      overhead: '#fef3c7',
      overheadIntensity: lampOn ? 1.0 : 0.75,
      warmFill: '#f97316',
      warmFillIntensity: lampOn ? 0.6 : 0.25,
      coolRim: '#fdba74',
      coolRimIntensity: 0.35,
    },
    clean: {
      ambient: '#f8fafc',
      ambientIntensity: 0.9,
      keyLight: '#ffffff',
      keyIntensity: 1.5,
      overhead: '#f1f5f9',
      overheadIntensity: lampOn ? 1.1 : 0.85,
      warmFill: '#e2e8f0',
      warmFillIntensity: lampOn ? 0.4 : 0.2,
      coolRim: '#93c5fd',
      coolRimIntensity: 0.45,
    },
    matrix: {
      ambient: '#064e3b',
      ambientIntensity: 0.6,
      keyLight: '#ecfdf5',
      keyIntensity: 1.25,
      overhead: '#10b981',
      overheadIntensity: lampOn ? 0.95 : 0.7,
      warmFill: '#047857',
      warmFillIntensity: lampOn ? 0.4 : 0.15,
      coolRim: '#34d399',
      coolRimIntensity: 0.7,
    },
  }[theme]

  return (
    <>
      <ambientLight intensity={config.ambientIntensity} color={config.ambient} />

      <directionalLight
        position={[3.5, 5, 3]}
        intensity={config.keyIntensity}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0002}
        shadow-camera-near={0.5}
        shadow-camera-far={12}
        shadow-camera-left={-2.2}
        shadow-camera-right={2.2}
        shadow-camera-top={2.2}
        shadow-camera-bottom={-2.2}
        color={config.keyLight}
      />

      <pointLight
        position={[0, 1.62, -0.1]}
        intensity={config.overheadIntensity}
        distance={3.2}
        color={config.overhead}
      />

      <pointLight
        position={[-2, 1.3, 1.2]}
        intensity={config.warmFillIntensity}
        color={config.warmFill}
      />

      <pointLight
        position={[2, 1.6, -1.5]}
        intensity={config.coolRimIntensity}
        color={config.coolRim}
      />
    </>
  )
}

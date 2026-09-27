import React, { useMemo } from 'react'
import * as THREE from 'three'

interface OscilloscopeProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
}

export const Oscilloscope: React.FC<OscilloscopeProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}) => {
  const screenTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 340
    const ctx = canvas.getContext('2d')
    if (ctx) {
      // Dark oscilloscope screen background
      ctx.fillStyle = '#060d13'
      ctx.fillRect(0, 0, 512, 340)

      // Oscilloscope graticule grid (8x10 divs)
      ctx.strokeStyle = '#0f2938'
      ctx.lineWidth = 1
      for (let x = 0; x <= 512; x += 51.2) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, 340)
        ctx.stroke()
      }
      for (let y = 0; y <= 340; y += 34) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(512, y)
        ctx.stroke()
      }

      // Top Status Bar
      ctx.fillStyle = '#10b981'
      ctx.font = 'bold 12px monospace'
      ctx.fillText('TRIG\'D  AUTO', 16, 20)
      ctx.fillStyle = '#38bdf8'
      ctx.fillText('M 2.00ms  1.00GSa/s', 150, 20)
      ctx.fillStyle = '#facc15'
      ctx.fillText('f = 10.000 kHz', 380, 20)

      // Waveform 1: Yellow Sine Wave (CH1)
      ctx.strokeStyle = '#facc15'
      ctx.lineWidth = 2.5
      ctx.beginPath()
      for (let px = 0; px <= 512; px++) {
        const py = 150 + Math.sin(px * 0.04) * 65
        if (px === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.stroke()

      // Waveform 2: Cyan Square / Clock Wave (CH2)
      ctx.strokeStyle = '#06b6d4'
      ctx.lineWidth = 2
      ctx.beginPath()
      for (let px = 0; px <= 512; px++) {
        const cycle = Math.floor(px / 32) % 2
        const py = 240 + (cycle === 0 ? -35 : 35)
        if (px === 0) ctx.moveTo(px, py)
        else {
          ctx.lineTo(px, py)
        }
      }
      ctx.stroke()

      // Bottom Channel Info Badges
      ctx.fillStyle = '#facc15'
      ctx.fillRect(16, 310, 60, 20)
      ctx.fillStyle = '#000000'
      ctx.font = 'bold 11px monospace'
      ctx.fillText('1 1.00V', 22, 324)

      ctx.fillStyle = '#06b6d4'
      ctx.fillRect(86, 310, 60, 20)
      ctx.fillStyle = '#000000'
      ctx.fillText('2 3.30V', 92, 324)
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.minFilter = THREE.LinearFilter
    return texture
  }, [])

  const width = 0.38
  const height = 0.22
  const depth = 0.16

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Main Enclosure Body */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Front Bezel Frame (Dark Grey) */}
      <mesh position={[0, height / 2, depth / 2 + 0.005]} castShadow>
        <boxGeometry args={[width - 0.01, height - 0.01, 0.01]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} />
      </mesh>

      {/* TFT Display */}
      <mesh position={[-0.05, height / 2 + 0.01, depth / 2 + 0.011]}>
        <planeGeometry args={[0.22, 0.15]} />
        <meshBasicMaterial map={screenTexture} />
      </mesh>

      {/* Side Handle / Rubber Bumpers */}
      <mesh position={[-width / 2 - 0.005, height / 2, 0]} castShadow>
        <boxGeometry args={[0.015, height + 0.01, depth + 0.01]} />
        <meshStandardMaterial color="#0284c7" roughness={0.7} />
      </mesh>
      <mesh position={[width / 2 + 0.005, height / 2, 0]} castShadow>
        <boxGeometry args={[0.015, height + 0.01, depth + 0.01]} />
        <meshStandardMaterial color="#0284c7" roughness={0.7} />
      </mesh>

      {/* Rotary Knobs Area on Right Side */}
      {/* Large Timebase Dial */}
      <mesh
        position={[0.11, height / 2 + 0.045, depth / 2 + 0.02]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.016, 0.016, 0.018, 24]} />
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* CH1 Knob (Yellow) */}
      <mesh
        position={[0.08, height / 2 - 0.01, depth / 2 + 0.02]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.012, 0.012, 0.016, 20]} />
        <meshStandardMaterial color="#facc15" roughness={0.4} />
      </mesh>
      {/* CH2 Knob (Cyan) */}
      <mesh
        position={[0.13, height / 2 - 0.01, depth / 2 + 0.02]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.012, 0.012, 0.016, 20]} />
        <meshStandardMaterial color="#06b6d4" roughness={0.4} />
      </mesh>

      {/* BNC Channel Inputs along bottom right */}
      {[-0.03, 0.02, 0.07, 0.12].map((bx, idx) => (
        <group key={idx} position={[bx, 0.035, depth / 2 + 0.018]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.008, 0.008, 0.015, 16]} />
            <meshStandardMaterial color="#d1d5db" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Power Button with LED */}
      <mesh position={[-0.14, height - 0.03, depth / 2 + 0.012]}>
        <circleGeometry args={[0.008, 16]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.8} />
      </mesh>

      {/* Probe Lead Cable attached to CH1 */}
      <mesh position={[-0.03, 0.02, depth / 2 + 0.08]} rotation={[0.6, 0.3, 0]}>
        <cylinderGeometry args={[0.004, 0.004, 0.12, 8]} />
        <meshStandardMaterial color="#111827" roughness={0.8} />
      </mesh>
    </group>
  )
}

import React, { useMemo, useState, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
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
  const [mode, setMode] = useState(0)
  const [knobRot, setKnobRot] = useState(0)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [hovered])

  const timebaseKnobRef = useRef<THREE.Mesh>(null)
  const ch1KnobRef = useRef<THREE.Mesh>(null)
  const ch2KnobRef = useRef<THREE.Mesh>(null)
  const currentKnobAngle = useRef(0)

  const { ctx, screenTexture } = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 256
    c.height = 160
    const context = c.getContext('2d')
    const tex = new THREE.CanvasTexture(c)
    tex.minFilter = THREE.NearestFilter
    tex.magFilter = THREE.NearestFilter
    return { ctx: context, screenTexture: tex }
  }, [])

  const timeRef = useRef(0)
  const lastUpdate = useRef(0)

  useFrame((_, delta) => {
    timeRef.current += delta

    currentKnobAngle.current = THREE.MathUtils.lerp(currentKnobAngle.current, knobRot, 0.15)
    if (timebaseKnobRef.current) timebaseKnobRef.current.rotation.y = currentKnobAngle.current
    if (ch1KnobRef.current) ch1KnobRef.current.rotation.y = -currentKnobAngle.current * 0.8
    if (ch2KnobRef.current) ch2KnobRef.current.rotation.y = currentKnobAngle.current * 1.2

    if (ctx && timeRef.current - lastUpdate.current > 0.03) {
      lastUpdate.current = timeRef.current
      const t = timeRef.current

      // Outer Wilds scientific CRT display
      ctx.fillStyle = '#0a1018'
      ctx.fillRect(0, 0, 256, 160)

      // Graticule grid
      ctx.strokeStyle = '#14202d'
      ctx.lineWidth = 1
      for (let x = 0; x <= 256; x += 32) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, 160)
        ctx.stroke()
      }
      for (let y = 0; y <= 160; y += 20) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(256, y)
        ctx.stroke()
      }

      const modes = [
        { name: '48.00 MHz', ch1: '1.00V', ch2: '3.30V' },
        { name: 'SOLAR PK', ch1: '500mV', ch2: '1.80V' },
        { name: 'HARMONIC', ch1: '2.00V', ch2: '5.00V' },
        { name: 'BEACON', ch1: '3.30V', ch2: '3.30V' },
      ]
      const curMode = modes[mode % modes.length]

      ctx.fillStyle = '#10b981'
      ctx.font = 'bold 9px monospace'
      ctx.fillText(`SIGNAL SCOPE: ${curMode.name}`, 10, 12)

      // CH1 Waveform (Amber Ember)
      ctx.strokeStyle = '#d97706'
      ctx.lineWidth = 2
      ctx.beginPath()
      for (let px = 0; px <= 256; px += 3) {
        let py = 68
        if (mode === 0) {
          py += Math.sin(px * 0.06 - t * 6) * 30
        } else if (mode === 1) {
          py += Math.sin(px * 0.18 - t * 14) * 24
        } else if (mode === 2) {
          const phase = ((px * 0.04 - t * 4) % 2 + 2) % 2
          py += (phase < 1 ? phase * 2 - 1 : (2 - phase) * 2 - 1) * 32
        } else {
          py += Math.sin(px * 0.04 - t * 4) * Math.cos(px * 0.12 - t * 8) * 32
        }

        if (px === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.stroke()

      // CH2 Waveform (Cyan Starfield)
      ctx.strokeStyle = '#0d9488'
      ctx.lineWidth = 1.8
      ctx.beginPath()
      for (let px = 0; px <= 256; px += 2) {
        let py = 120
        if (mode === 0 || mode === 1) {
          const cycle = Math.floor((px - t * 60) / 24) % 2
          py += (cycle === 0 ? -18 : 18)
        } else if (mode === 2) {
          py += Math.sin(px * 0.08 - t * 8) * 20
        } else {
          const saw = ((px * 0.03 - t * 3) % 1 + 1) % 1
          py += (saw * 2 - 1) * 20
        }

        if (px === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.stroke()

      // Badges
      ctx.fillStyle = '#9a3412'
      ctx.fillRect(8, 144, 46, 12)
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 8px monospace'
      ctx.fillText(`1 ${curMode.ch1}`, 12, 153)

      ctx.fillStyle = '#1b4d3e'
      ctx.fillRect(58, 144, 46, 12)
      ctx.fillStyle = '#ffffff'
      ctx.fillText(`2 ${curMode.ch2}`, 62, 153)

      screenTexture.needsUpdate = true
    }
  })

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    setMode((prev) => (prev + 1) % 4)
    setKnobRot((prev) => prev + Math.PI / 4)
  }

  const width = 0.38
  const height = 0.22
  const depth = 0.16

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
      {/* Outer Enclosure (Parchment Stoneware Finish with Ventilation Louvers) */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color={hovered ? '#e5dfd2' : '#d8d2c4'}
          roughness={0.55}
          metalness={0.1}
          flatShading
        />
      </mesh>

      {/* Top Leather / Brass Carrying Handle */}
      <group position={[0, height + 0.012, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.16, 0.008, 0.02]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} flatShading />
        </mesh>
        <mesh position={[-0.075, -0.006, 0]} castShadow>
          <cylinderGeometry args={[0.005, 0.005, 0.014, 6]} />
          <meshStandardMaterial color="#b5935b" metalness={0.85} roughness={0.25} flatShading />
        </mesh>
        <mesh position={[0.075, -0.006, 0]} castShadow>
          <cylinderGeometry args={[0.005, 0.005, 0.014, 6]} />
          <meshStandardMaterial color="#b5935b" metalness={0.85} roughness={0.25} flatShading />
        </mesh>
      </group>

      {/* Side Ventilation Slots */}
      {[-0.04, -0.02, 0, 0.02, 0.04].map((ly, idx) => (
        <group key={`louver-${idx}`}>
          <mesh position={[-width / 2 - 0.0005, height / 2 + ly, 0]}>
            <boxGeometry args={[0.001, 0.005, 0.08]} />
            <meshStandardMaterial color="#1a222d" roughness={0.9} flatShading />
          </mesh>
          <mesh position={[width / 2 + 0.0005, height / 2 + ly, 0]}>
            <boxGeometry args={[0.001, 0.005, 0.08]} />
            <meshStandardMaterial color="#1a222d" roughness={0.9} flatShading />
          </mesh>
        </group>
      ))}

      {/* Front Bezel Frame */}
      <mesh position={[0, height / 2, depth / 2 + 0.005]} castShadow>
        <boxGeometry args={[width - 0.015, height - 0.015, 0.01]} />
        <meshStandardMaterial color="#1e2632" roughness={0.7} flatShading />
      </mesh>

      {/* TFT Display Panel */}
      <mesh position={[-0.05, height / 2 + 0.01, depth / 2 + 0.011]}>
        <planeGeometry args={[0.22, 0.15]} />
        <meshBasicMaterial map={screenTexture} toneMapped={false} />
      </mesh>

      {/* Side Protective Armor Bumpers */}
      <mesh position={[-width / 2 - 0.004, height / 2, 0]} castShadow>
        <boxGeometry args={[0.012, height + 0.01, depth + 0.01]} />
        <meshStandardMaterial color="#2d3d4e" roughness={0.65} flatShading />
      </mesh>
      <mesh position={[width / 2 + 0.004, height / 2, 0]} castShadow>
        <boxGeometry args={[0.012, height + 0.01, depth + 0.01]} />
        <meshStandardMaterial color="#2d3d4e" roughness={0.65} flatShading />
      </mesh>

      {/* Animated Timebase Dial (Knurled Brass) */}
      <mesh
        ref={timebaseKnobRef}
        position={[0.11, height / 2 + 0.045, depth / 2 + 0.02]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.016, 0.016, 0.018, 8]} />
        <meshStandardMaterial color="#b5935b" metalness={0.8} roughness={0.3} flatShading />
      </mesh>

      {/* Channel Knobs with Indicator Pointers */}
      <mesh
        ref={ch1KnobRef}
        position={[0.08, height / 2 - 0.01, depth / 2 + 0.02]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.012, 0.012, 0.016, 8]} />
        <meshStandardMaterial color="#9a3412" roughness={0.45} flatShading />
      </mesh>
      <mesh
        ref={ch2KnobRef}
        position={[0.13, height / 2 - 0.01, depth / 2 + 0.02]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.012, 0.012, 0.016, 8]} />
        <meshStandardMaterial color="#1b4d3e" roughness={0.45} flatShading />
      </mesh>

      {/* 4 Brass BNC Channel Inputs with Bayonet Pins */}
      {[-0.03, 0.02, 0.07, 0.12].map((bx, idx) => (
        <group key={idx} position={[bx, 0.035, depth / 2 + 0.016]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.008, 0.008, 0.012, 8]} />
            <meshStandardMaterial color="#c29b53" metalness={0.85} roughness={0.25} flatShading />
          </mesh>
          <mesh position={[0, 0, 0.006]}>
            <cylinderGeometry args={[0.003, 0.003, 0.002, 6]} />
            <meshStandardMaterial color="#1e2430" roughness={0.8} flatShading />
          </mesh>
        </group>
      ))}

      {/* Power Indicator LED */}
      <mesh position={[-0.14, height - 0.03, depth / 2 + 0.012]}>
        <boxGeometry args={[0.01, 0.01, 0.002]} />
        <meshStandardMaterial color="#059669" emissive="#047857" emissiveIntensity={0.6} />
      </mesh>
    </group>
  )
}

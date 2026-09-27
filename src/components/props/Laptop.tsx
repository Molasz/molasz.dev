import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { soundFx } from '../../utils/sound'

interface LaptopProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  soundEnabled?: boolean
  onOpenProjects?: () => void
}

export const Laptop: React.FC<LaptopProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  soundEnabled = true,
  onOpenProjects,
}) => {
  const [hovered, setHovered] = useState(false)

  const canvas = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 512
    c.height = 320
    return c
  }, [])

  const textureRef = useRef<THREE.CanvasTexture>(null)

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [hovered])

  // Screen Spring Tilt Physics
  const lidRef = useRef<THREE.Group>(null)
  const baseAngle = -0.26
  const tiltAngle = useRef(baseAngle)
  const tiltVel = useRef(0)

  const timeRef = useRef(0)
  const buildStartTime = useRef(-10)
  const lastCanvasUpdate = useRef(0)
  const buildCount = useRef(0)

  useFrame((_, delta) => {
    timeRef.current += delta

    const springK = 85
    const dampingK = 10
    const force = (baseAngle - tiltAngle.current) * springK - tiltVel.current * dampingK
    tiltVel.current += force * delta
    tiltAngle.current += tiltVel.current * delta

    if (lidRef.current) {
      lidRef.current.rotation.x = tiltAngle.current
    }

    if (timeRef.current - lastCanvasUpdate.current > 0.035) {
      lastCanvasUpdate.current = timeRef.current
      const t = timeRef.current
      const currentBuild = buildCount.current
      const ctx = canvas.getContext('2d')

      if (ctx) {
        // Editor Background
        ctx.fillStyle = '#0f1722'
        ctx.fillRect(0, 0, 512, 320)

        // Top Title Bar
        ctx.fillStyle = '#172230'
        ctx.fillRect(0, 0, 512, 26)

        // Window Dots
        ctx.fillStyle = '#9a3412'
        ctx.beginPath()
        ctx.arc(14, 13, 3.5, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#b45309'
        ctx.beginPath()
        ctx.arc(26, 13, 3.5, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#2d5a3f'
        ctx.beginPath()
        ctx.arc(38, 13, 3.5, 0, Math.PI * 2)
        ctx.fill()

        // Tab Header
        ctx.fillStyle = '#0f1722'
        ctx.fillRect(54, 4, 150, 22)
        ctx.fillStyle = '#d8d2c4'
        ctx.font = 'bold 10px monospace'
        ctx.fillText('⚡ firmware_core.c', 64, 18)

        // Typing loop simulation
        const typingPhrases = [
          'Telemetry_Broadcast(freq);',
          'Signal_Filter_FIR(&input);',
          'PWM_SetDutyCycle(75);     ',
          'Status_LED_Heartbeat();   ',
        ]
        const phraseIdx = Math.floor(t / 4) % typingPhrases.length
        const charCount = Math.min(
          typingPhrases[phraseIdx].length,
          Math.floor(((t % 4) / 2.5) * typingPhrases[phraseIdx].length)
        )
        const currentTypingText = typingPhrases[phraseIdx].substring(0, charCount)
        const cursor = Math.floor(t * 3) % 2 === 0 ? '█' : ' '

        const codeLines = [
          { num: '01', text: '#include <cortex_m7.h>', col: '#a78bfa' },
          { num: '02', text: '#include "observatory.h"', col: '#a78bfa' },
          { num: '03', text: '', col: '#fff' },
          { num: '04', text: 'void System_Init(void) {', col: '#93c5fd' },
          { num: '05', text: '  Clock_Config(216MHz);', col: '#38bdf8' },
          { num: '06', text: '  Radio_Attach(CH1, CH2);', col: '#6ee7b7' },
          { num: '07', text: '}', col: '#93c5fd' },
          { num: '08', text: '', col: '#fff' },
          { num: '09', text: 'int main(void) {', col: '#93c5fd' },
          { num: '10', text: '  System_Init();', col: '#38bdf8' },
          { num: '11', text: `    ${currentTypingText}${cursor}`, col: '#fcd34d' },
          { num: '12', text: '}', col: '#93c5fd' },
        ]

        let y = 46
        codeLines.forEach((l) => {
          ctx.fillStyle = '#334155'
          ctx.font = '10px monospace'
          ctx.fillText(l.num, 12, y)

          ctx.fillStyle = l.col
          ctx.font = 'bold 11px monospace'
          ctx.fillText(l.text, 36, y)
          y += 14
        })

        // Interactive Build Terminal
        const buildElapsed = t - buildStartTime.current
        const isCurrentlyBuilding = buildElapsed < 2.4 && buildStartTime.current > 0

        if (isCurrentlyBuilding || currentBuild > 0) {
          ctx.fillStyle = '#090e15'
          ctx.fillRect(0, 195, 512, 125)
          ctx.strokeStyle = '#1e2837'
          ctx.strokeRect(0, 195, 512, 1)

          ctx.fillStyle = '#38bdf8'
          ctx.font = 'bold 10px monospace'
          ctx.fillText(`[molasz@dev ~]$ make flash-target --release (Build #${currentBuild})`, 14, 214)

          const progress = Math.min(1.0, buildElapsed / 1.8)
          const percent = Math.floor(progress * 100)

          if (progress < 0.35) {
            ctx.fillStyle = '#94a3b8'
            ctx.fillText(`[1/3] Compiling firmware_core.c & hal_driver.c...`, 14, 234)
          } else if (progress < 0.8) {
            ctx.fillStyle = '#94a3b8'
            ctx.fillText(`[2/3] Linking firmware.elf (Flash: 34.2 KB)...`, 14, 234)
            ctx.fillStyle = '#fbbf24'
            ctx.fillText(`Optimizations: -O3 • Architecture: ARM Cortex-M7`, 14, 250)
          } else {
            ctx.fillStyle = '#34d399'
            ctx.fillText(`[3/3] ✓ FLASH VERIFIED! Target running firmware #${currentBuild}`, 14, 234)
            ctx.fillText(`⚡ Output: 0 errors, 0 warnings (0.38s)`, 14, 250)
          }

          ctx.fillStyle = '#1e293b'
          ctx.fillRect(14, 268, 484, 8)
          ctx.fillStyle = progress >= 1.0 ? '#2d5a3f' : '#b45309'
          ctx.fillRect(14, 268, Math.min(484, 484 * progress), 8)

          ctx.fillStyle = '#64748b'
          ctx.font = '9px monospace'
          ctx.fillText(
            progress >= 1.0
              ? `[✓ Build finalitzada • Fes clic per compilar de nou]`
              : `[Compilant... ${percent}%]`,
            14,
            296
          )
        } else {
          ctx.fillStyle = '#0c121a'
          ctx.fillRect(0, 280, 512, 40)
          ctx.strokeStyle = '#1e2837'
          ctx.strokeRect(0, 280, 512, 1)

          ctx.fillStyle = '#64748b'
          ctx.font = '10px monospace'
          ctx.fillText('● Ready  |  UTF-8  |  Cortex-M7  |  molasz.dev', 14, 298)

          ctx.fillStyle = '#38bdf8'
          ctx.fillText('[Fes clic per compilar / obrir projectes]', 270, 298)
        }

        if (textureRef.current) {
          textureRef.current.needsUpdate = true
        }
      }
    }
  })

  const handleLaptopClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    tiltVel.current = 1.6
    buildStartTime.current = timeRef.current
    buildCount.current += 1
    soundFx.keyboardKey(soundEnabled)
    if (onOpenProjects) {
      onOpenProjects()
    }
  }

  const baseW = 0.35
  const baseD = 0.23
  const baseH = 0.012

  const keyRows = [
    { count: 13, w: 0.018, d: 0.009, zOffset: -0.065, color: '#1e2530' },
    { count: 14, w: 0.017, d: 0.012, zOffset: -0.048, color: '#1e2530' },
    { count: 14, w: 0.017, d: 0.012, zOffset: -0.032, color: '#1e2530' },
    { count: 13, w: 0.018, d: 0.012, zOffset: -0.016, color: '#1e2530' },
    { count: 12, w: 0.020, d: 0.012, zOffset: 0.0, color: '#1e2530' },
  ]

  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={handleLaptopClick}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* 1. CNC UNIBODY LAPTOP BASE */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, baseH / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[baseW, baseH, baseD]} />
          <meshStandardMaterial
            color={hovered ? '#364252' : '#28323f'}
            metalness={0.65}
            roughness={0.4}
            flatShading
          />
        </mesh>

        {/* Front Opening Notch */}
        <mesh position={[0, baseH - 0.001, baseD / 2]}>
          <boxGeometry args={[0.06, 0.003, 0.004]} />
          <meshStandardMaterial color="#171e27" roughness={0.7} flatShading />
        </mesh>

        {/* Stereo Speaker Grilles */}
        {[-baseW / 2 + 0.018, baseW / 2 - 0.018].map((gx, idx) => (
          <group key={`spk-${idx}`} position={[gx, baseH + 0.0005, -0.03]}>
            {[-0.04, -0.02, 0, 0.02, 0.04].map((gz, sIdx) => (
              <mesh key={`slot-${sIdx}`} position={[0, 0, gz]}>
                <boxGeometry args={[0.006, 0.001, 0.012]} />
                <meshStandardMaterial color="#141922" roughness={0.9} flatShading />
              </mesh>
            ))}
          </group>
        ))}

        {/* 4 Rubber Feet */}
        {[
          [-baseW / 2 + 0.025, -baseD / 2 + 0.025],
          [baseW / 2 - 0.025, -baseD / 2 + 0.025],
          [-baseW / 2 + 0.025, baseD / 2 - 0.025],
          [baseW / 2 - 0.025, baseD / 2 - 0.025],
        ].map(([fx, fz], i) => (
          <mesh key={i} position={[fx, -0.001, fz]} castShadow>
            <cylinderGeometry args={[0.007, 0.007, 0.002, 6]} />
            <meshStandardMaterial color="#0c1015" roughness={0.9} flatShading />
          </mesh>
        ))}

        {/* Ports */}
        <mesh position={[-baseW / 2 - 0.0005, baseH / 2, -baseD / 2 + 0.04]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.003, 0.001, 0.008]} />
          <meshStandardMaterial color="#c29b53" metalness={0.8} roughness={0.3} flatShading />
        </mesh>
        {[-0.058, -0.075].map((pz, idx) => (
          <mesh key={idx} position={[-baseW / 2 - 0.0005, baseH / 2, pz]} rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.0025, 0.001, 0.007]} />
            <meshStandardMaterial color="#0c1015" metalness={0.8} roughness={0.3} flatShading />
          </mesh>
        ))}
        <mesh position={[baseW / 2 + 0.0005, baseH / 2, -baseD / 2 + 0.045]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.0035, 0.001, 0.012]} />
          <meshStandardMaterial color="#0c1015" metalness={0.8} roughness={0.3} flatShading />
        </mesh>

        {/* Recessed Keyboard Well */}
        <mesh position={[0, baseH + 0.0006, -0.03]} receiveShadow>
          <boxGeometry args={[0.275, 0.001, 0.125]} />
          <meshStandardMaterial color="#161c24" roughness={0.8} flatShading />
        </mesh>

        {/* Keycaps */}
        {keyRows.map((row, rIdx) => {
          const totalRowWidth = 0.26
          const spacing = totalRowWidth / row.count
          return (
            <group key={rIdx} position={[0, baseH + 0.002, row.zOffset]}>
              {Array.from({ length: row.count }).map((_, kIdx) => {
                const kx = -totalRowWidth / 2 + spacing * kIdx + spacing / 2
                const isAccent = (rIdx === 0 && kIdx === 0) || (rIdx === 3 && kIdx === row.count - 1)
                return (
                  <mesh key={kIdx} position={[kx, 0, 0]} castShadow>
                    <boxGeometry args={[row.w, 0.0025, row.d]} />
                    <meshStandardMaterial
                      color={isAccent ? '#9a3412' : row.color}
                      roughness={0.5}
                      metalness={0.2}
                      flatShading
                    />
                  </mesh>
                )
              })}
            </group>
          )
        })}

        {/* Spacebar Row */}
        <group position={[0, baseH + 0.002, 0.016]}>
          {[-0.115, -0.092, -0.07].map((kx, idx) => (
            <mesh key={`mod-l-${idx}`} position={[kx, 0, 0]} castShadow>
              <boxGeometry args={[0.018, 0.0025, 0.013]} />
              <meshStandardMaterial color="#1e2530" roughness={0.5} flatShading />
            </mesh>
          ))}
          <mesh position={[-0.01, 0, 0]} castShadow>
            <boxGeometry args={[0.095, 0.0025, 0.013]} />
            <meshStandardMaterial color="#d8d2c4" roughness={0.45} flatShading />
          </mesh>
          {[0.052, 0.074].map((kx, idx) => (
            <mesh key={`mod-r-${idx}`} position={[kx, 0, 0]} castShadow>
              <boxGeometry args={[0.018, 0.0025, 0.013]} />
              <meshStandardMaterial color="#1e2530" roughness={0.5} flatShading />
            </mesh>
          ))}
          {[0.096, 0.112, 0.128].map((kx, idx) => (
            <mesh key={`arr-${idx}`} position={[kx, 0, 0.003]} castShadow>
              <boxGeometry args={[0.013, 0.0025, 0.007]} />
              <meshStandardMaterial color="#141923" roughness={0.5} flatShading />
            </mesh>
          ))}
          <mesh position={[0.112, 0, -0.004]} castShadow>
            <boxGeometry args={[0.013, 0.0025, 0.007]} />
            <meshStandardMaterial color="#141923" roughness={0.5} flatShading />
          </mesh>
        </group>

        {/* Glass Trackpad */}
        <group position={[0, baseH + 0.001, 0.062]}>
          <mesh receiveShadow>
            <boxGeometry args={[0.12, 0.0012, 0.075]} />
            <meshStandardMaterial color="#1c242f" metalness={0.4} roughness={0.35} flatShading />
          </mesh>
          <mesh position={[0, 0.0003, 0]}>
            <boxGeometry args={[0.122, 0.0006, 0.077]} />
            <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.4} flatShading />
          </mesh>
        </group>
      </group>

      {/* 2. DUAL BARREL HINGE */}
      <group position={[0, baseH + 0.004, -baseD / 2 + 0.006]}>
        <mesh position={[-0.07, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.0045, 0.0045, 0.09, 6]} />
          <meshStandardMaterial color="#171e27" metalness={0.8} roughness={0.3} flatShading />
        </mesh>
        <mesh position={[0.07, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.0045, 0.0045, 0.09, 6]} />
          <meshStandardMaterial color="#171e27" metalness={0.8} roughness={0.3} flatShading />
        </mesh>
        <mesh position={[-0.116, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.005, 0.005, 0.006, 6]} />
          <meshStandardMaterial color="#c29b53" metalness={0.8} roughness={0.3} flatShading />
        </mesh>
        <mesh position={[0.116, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.005, 0.005, 0.006, 6]} />
          <meshStandardMaterial color="#c29b53" metalness={0.8} roughness={0.3} flatShading />
        </mesh>
      </group>

      {/* 3. SPRING-ANIMATED SCREEN DISPLAY */}
      <group ref={lidRef} position={[0, baseH + 0.004, -baseD / 2 + 0.006]}>
        <mesh position={[0, 0.115, -0.003]} castShadow>
          <boxGeometry args={[baseW, 0.23, 0.006]} />
          <meshStandardMaterial
            color={hovered ? '#364252' : '#28323f'}
            metalness={0.65}
            roughness={0.4}
            flatShading
          />
        </mesh>

        <mesh position={[0, 0.115, -0.0065]}>
          <octahedronGeometry args={[0.015, 0]} />
          <meshStandardMaterial
            color="#c29b53"
            emissive="#38bdf8"
            emissiveIntensity={hovered ? 0.9 : 0.4}
            flatShading
          />
        </mesh>

        <mesh position={[0, 0.115, 0.0006]}>
          <boxGeometry args={[baseW * 0.985, 0.224, 0.001]} />
          <meshStandardMaterial color="#0b1017" roughness={0.85} flatShading />
        </mesh>

        <mesh position={[0, 0.115, 0.002]}>
          <planeGeometry args={[baseW * 0.92, 0.205]} />
          <meshBasicMaterial toneMapped={false}>
            <canvasTexture ref={textureRef} attach="map" image={canvas} />
          </meshBasicMaterial>
        </mesh>

        <mesh position={[0, 0.22, 0.0022]}>
          <circleGeometry args={[0.002, 6]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
        <mesh position={[0.008, 0.22, 0.0022]}>
          <circleGeometry args={[0.0008, 6]} />
          <meshBasicMaterial color="#2d5a3f" />
        </mesh>
      </group>
    </group>
  )
}

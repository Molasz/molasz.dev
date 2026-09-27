import React, { useMemo } from 'react'
import * as THREE from 'three'

interface LaptopProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
}

export const Laptop: React.FC<LaptopProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}) => {
  const screenTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 320
    const ctx = canvas.getContext('2d')
    if (ctx) {
      // Dark IDE background
      ctx.fillStyle = '#0f141c'
      ctx.fillRect(0, 0, 512, 320)

      // Window header bar
      ctx.fillStyle = '#1e2430'
      ctx.fillRect(0, 0, 512, 28)

      // Window controls
      ctx.fillStyle = '#ef4444'
      ctx.beginPath()
      ctx.arc(16, 14, 5, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#f59e0b'
      ctx.beginPath()
      ctx.arc(32, 14, 5, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#10b981'
      ctx.beginPath()
      ctx.arc(48, 14, 5, 0, Math.PI * 2)
      ctx.fill()

      // Header title
      ctx.fillStyle = '#94a3b8'
      ctx.font = '11px monospace'
      ctx.fillText('molasz@workstation: ~/firmware/main.c', 70, 18)

      // Code editor lines
      ctx.font = '13px monospace'
      const lines = [
        { text: '#include <stdio.h>', color: '#f472b6' },
        { text: '#include "stm32f4xx_hal.h"', color: '#f472b6' },
        { text: '', color: '#fff' },
        { text: 'int main(void) {', color: '#60a5fa' },
        { text: '  HAL_Init();', color: '#38bdf8' },
        { text: '  SystemClock_Config();', color: '#38bdf8' },
        { text: '  MX_GPIO_Init();', color: '#38bdf8' },
        { text: '  MX_USART1_UART_Init();', color: '#38bdf8' },
        { text: '', color: '#fff' },
        { text: '  while (1) {', color: '#60a5fa' },
        { text: '    HAL_GPIO_TogglePin(GPIOC, GPIO_PIN_13);', color: '#4ade80' },
        { text: '    HAL_Delay(500); // 1Hz blink', color: '#94a3b8' },
        { text: '  }', color: '#60a5fa' },
        { text: '}', color: '#60a5fa' },
      ]

      let y = 52
      lines.forEach((line) => {
        ctx.fillStyle = line.color
        ctx.fillText(line.text, 24, y)
        y += 18
      })
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.minFilter = THREE.LinearFilter
    return texture
  }, [])

  const baseW = 0.36
  const baseD = 0.24
  const baseH = 0.012

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Laptop Base */}
      <mesh position={[0, baseH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[baseW, baseH, baseD]} />
        <meshStandardMaterial color="#2d3748" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Keyboard Bed */}
      <mesh position={[0, baseH + 0.0005, -0.02]} receiveShadow>
        <boxGeometry args={[baseW * 0.88, 0.001, baseD * 0.48]} />
        <meshStandardMaterial color="#171923" roughness={0.9} />
      </mesh>

      {/* Keys Simulation Grid */}
      <mesh position={[0, baseH + 0.002, -0.02]}>
        <boxGeometry args={[baseW * 0.84, 0.002, baseD * 0.44]} />
        <meshStandardMaterial
          color="#1a202c"
          emissive="#38bdf8"
          emissiveIntensity={0.15}
          roughness={0.6}
        />
      </mesh>

      {/* Trackpad */}
      <mesh position={[0, baseH + 0.0006, 0.065]}>
        <boxGeometry args={[0.11, 0.001, 0.07]} />
        <meshStandardMaterial color="#232936" metalness={0.4} roughness={0.3} />
      </mesh>

      {/* Laptop Screen Assembly (Angled Open ~112 deg) */}
      <group position={[0, baseH, -baseD / 2]}>
        <group rotation={[-1.95, 0, 0]}>
          {/* Screen Lid Back Cover */}
          <mesh position={[0, 0.12, 0.004]} castShadow>
            <boxGeometry args={[baseW, 0.24, 0.008]} />
            <meshStandardMaterial color="#2d3748" metalness={0.8} roughness={0.3} />
          </mesh>

          {/* Screen Bezel */}
          <mesh position={[0, 0.12, 0.008]}>
            <boxGeometry args={[baseW * 0.98, 0.23, 0.001]} />
            <meshStandardMaterial color="#0f172a" roughness={0.8} />
          </mesh>

          {/* Active Screen Surface */}
          <mesh position={[0, 0.12, 0.009]}>
            <planeGeometry args={[baseW * 0.92, 0.21]} />
            <meshBasicMaterial map={screenTexture} />
          </mesh>

          {/* Webcam dot */}
          <mesh position={[0, 0.232, 0.0085]}>
            <circleGeometry args={[0.002, 16]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
        </group>
      </group>
    </group>
  )
}

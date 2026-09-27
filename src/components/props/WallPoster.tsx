import React, { useMemo } from 'react'
import * as THREE from 'three'

interface WallPosterProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
}

export const WallPoster: React.FC<WallPosterProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}) => {
  // Generate a procedural schematic blueprint texture
  const posterTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 340
    const ctx = canvas.getContext('2d')
    if (ctx) {
      // Blueprint deep navy background
      ctx.fillStyle = '#0f172a'
      ctx.fillRect(0, 0, 512, 340)

      // Blueprint Grid
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)'
      ctx.lineWidth = 1
      for (let x = 0; x <= 512; x += 20) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, 340)
        ctx.stroke()
      }
      for (let y = 0; y <= 340; y += 20) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(512, y)
        ctx.stroke()
      }

      // Title Box
      ctx.strokeStyle = '#38bdf8'
      ctx.lineWidth = 2
      ctx.strokeRect(15, 15, 482, 310)

      ctx.fillStyle = '#38bdf8'
      ctx.font = 'bold 16px monospace'
      ctx.fillText('SYSTEM ARCHITECTURE & PINOUT SCHEMATIC', 30, 45)

      ctx.fillStyle = '#94a3b8'
      ctx.font = '10px monospace'
      ctx.fillText('DOC-ID: MLZ-LAB-2026 // ARM CORTEX-M7 & HIGH-SPEED RF', 30, 62)

      // Microcontroller diagram block
      ctx.strokeStyle = '#0284c7'
      ctx.lineWidth = 1.5
      ctx.strokeRect(180, 100, 150, 140)
      ctx.fillStyle = '#38bdf8'
      ctx.font = 'bold 12px monospace'
      ctx.fillText('MCU CORE', 220, 160)
      ctx.font = '9px monospace'
      ctx.fillText('STM32H7 / 480MHz', 205, 180)

      // Pin lines & labels
      const leftPins = ['VDD (3.3V)', 'GND (0V)', 'NRST', 'PA0 (ADC1)', 'PA1 (ADC2)', 'PA2 (USART_TX)', 'PA3 (USART_RX)']
      leftPins.forEach((pin, i) => {
        const py = 115 + i * 16
        ctx.beginPath()
        ctx.moveTo(80, py)
        ctx.lineTo(180, py)
        ctx.stroke()
        ctx.fillStyle = '#7dd3fc'
        ctx.font = '8px monospace'
        ctx.fillText(pin, 30, py + 3)
      })

      const rightPins = ['PB6 (I2C_SCL)', 'PB7 (I2C_SDA)', 'PB13 (SPI_SCK)', 'PB14 (SPI_MISO)', 'PB15 (SPI_MOSI)', 'SWDIO', 'SWCLK']
      rightPins.forEach((pin, i) => {
        const py = 115 + i * 16
        ctx.beginPath()
        ctx.moveTo(330, py)
        ctx.lineTo(430, py)
        ctx.stroke()
        ctx.fillStyle = '#7dd3fc'
        ctx.font = '8px monospace'
        ctx.fillText(pin, 360, py + 3)
      })

      // Footer stamp
      ctx.fillStyle = '#f59e0b'
      ctx.font = 'bold 10px monospace'
      ctx.fillText('[APPROVED FOR PROTOTYPING // molasz.dev]', 30, 305)
    }

    const tex = new THREE.CanvasTexture(canvas)
    tex.minFilter = THREE.LinearMipmapLinearFilter
    tex.magFilter = THREE.LinearFilter
    tex.generateMipmaps = true
    return tex
  }, [])

  return (
    <group position={position} rotation={rotation}>
      {/* Paper Sheet */}
      <mesh castShadow receiveShadow>
        <planeGeometry args={[0.34, 0.23]} />
        <meshStandardMaterial map={posterTexture} roughness={0.7} metalness={0.05} />
      </mesh>

      {/* 4 Brass Thumbtacks / Magnets */}
      {[
        [-0.155, 0.10],
        [0.155, 0.10],
        [-0.155, -0.10],
        [0.155, -0.10],
      ].map(([tx, ty], idx) => (
        <mesh key={idx} position={[tx, ty, 0.002]} castShadow>
          <cylinderGeometry args={[0.004, 0.004, 0.003, 6]} />
          <meshStandardMaterial color="#c29b53" metalness={0.85} roughness={0.25} flatShading />
        </mesh>
      ))}
    </group>
  )
}

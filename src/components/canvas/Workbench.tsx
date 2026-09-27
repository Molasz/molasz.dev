import React from 'react'
import { Laptop } from '../props/Laptop'
import { KeyboardMouse } from '../props/KeyboardMouse'
import { Oscilloscope } from '../props/Oscilloscope'
import { PowerSupply } from '../props/PowerSupply'
import { SolderingStation } from '../props/SolderingStation'
import { Multimeter } from '../props/Multimeter'
import { DeskLamp } from '../props/DeskLamp'
import { ElectronicsAndTools } from '../props/ElectronicsAndTools'
import { PegboardTools } from '../props/PegboardTools'

export const Workbench: React.FC = () => {
  const tableWidth = 2.4
  const tableDepth = 1.05
  const tableHeight = 0.82
  const topThickness = 0.05
  const legThickness = 0.07
  const shelfHeight = 0.52
  const shelfDepth = 0.36
  const surfaceY = tableHeight + topThickness / 2
  const shelfSurfaceY = tableHeight + shelfHeight + 0.02

  return (
    <group position={[0, 0, 0]}>
      {/* 1. SOLID WOODEN TABLETOP */}
      <mesh position={[0, tableHeight, 0]} castShadow receiveShadow>
        <boxGeometry args={[tableWidth, topThickness, tableDepth]} />
        <meshStandardMaterial
          color="#d4a373"
          roughness={0.35}
          metalness={0.05}
        />
      </mesh>

      {/* Industrial Table Edge Trim */}
      <mesh position={[0, tableHeight - 0.005, 0]}>
        <boxGeometry args={[tableWidth + 0.015, topThickness * 0.8, tableDepth + 0.015]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.8} />
      </mesh>

      {/* 2. ESD ANTI-STATIC WORK MAT */}
      <group position={[0, surfaceY + 0.002, 0.06]}>
        <mesh receiveShadow>
          <boxGeometry args={[1.5, 0.004, 0.72]} />
          <meshStandardMaterial
            color="#1d4ed8"
            roughness={0.85}
            metalness={0.05}
          />
        </mesh>
        {/* ESD Grounding Snaps & Wrist Strap Terminal */}
        <mesh position={[-0.68, 0.003, -0.3]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.006, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0.68, 0.003, -0.3]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.006, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* 3. HEAVY-DUTY STEEL LEGS & FRAME */}
      {[
        [-tableWidth / 2 + 0.12, tableDepth / 2 - 0.1],
        [tableWidth / 2 - 0.12, tableDepth / 2 - 0.1],
        [-tableWidth / 2 + 0.12, -tableDepth / 2 + 0.1],
        [tableWidth / 2 - 0.12, -tableDepth / 2 + 0.1],
      ].map(([x, z], idx) => (
        <group key={idx} position={[x, tableHeight / 2, z]}>
          {/* Main Steel Leg */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[legThickness, tableHeight - topThickness, legThickness]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.85} />
          </mesh>
          {/* Rubber / Chrome Leveling Foot */}
          <mesh position={[0, -tableHeight / 2 + 0.015, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.048, 0.03, 16]} />
            <meshStandardMaterial color="#020617" roughness={0.9} />
          </mesh>
          <mesh position={[0, -tableHeight / 2 + 0.035, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.025, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Under-table Steel Rails */}
      <mesh position={[0, tableHeight - 0.05, tableDepth / 2 - 0.1]} castShadow receiveShadow>
        <boxGeometry args={[tableWidth - 0.18, 0.05, 0.04]} />
        <meshStandardMaterial color="#0f172a" roughness={0.5} metalness={0.8} />
      </mesh>
      <mesh position={[0, tableHeight - 0.05, -tableDepth / 2 + 0.1]} castShadow receiveShadow>
        <boxGeometry args={[tableWidth - 0.18, 0.05, 0.04]} />
        <meshStandardMaterial color="#0f172a" roughness={0.5} metalness={0.8} />
      </mesh>

      {/* Lower H-Frame Crossbars */}
      <mesh position={[-tableWidth / 2 + 0.12, 0.18, 0]} castShadow receiveShadow>
        <boxGeometry args={[legThickness * 0.8, 0.04, tableDepth - 0.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.85} />
      </mesh>
      <mesh position={[tableWidth / 2 - 0.12, 0.18, 0]} castShadow receiveShadow>
        <boxGeometry args={[legThickness * 0.8, 0.04, tableDepth - 0.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.85} />
      </mesh>
      <mesh position={[0, 0.18, -tableDepth / 2 + 0.1]} castShadow receiveShadow>
        <boxGeometry args={[tableWidth - 0.24, 0.04, legThickness * 0.8]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.85} />
      </mesh>

      {/* 4. REAR UPRIGHTS & INSTRUMENT SHELF */}
      {[-tableWidth / 2 + 0.12, tableWidth / 2 - 0.12].map((x, idx) => (
        <mesh
          key={`upright-${idx}`}
          position={[x, tableHeight + shelfHeight / 2 + 0.05, -tableDepth / 2 + 0.1]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.05, shelfHeight + 0.18, 0.05]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.85} />
        </mesh>
      ))}

      {/* Pegboard Tool Wall */}
      <mesh
        position={[0, tableHeight + shelfHeight * 0.42, -tableDepth / 2 + 0.11]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[tableWidth - 0.3, shelfHeight * 0.65, 0.015]} />
        <meshStandardMaterial color="#334155" roughness={0.7} metalness={0.3} />
      </mesh>

      {/* Pegboard Tools Rack */}
      <PegboardTools position={[0, tableHeight + shelfHeight * 0.42, -tableDepth / 2 + 0.12]} />

      {/* Upper Equipment Shelf */}
      <mesh
        position={[0, tableHeight + shelfHeight, -tableDepth / 2 + shelfDepth / 2 + 0.02]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[tableWidth - 0.15, 0.035, shelfDepth]} />
        <meshStandardMaterial color="#d4a373" roughness={0.35} metalness={0.05} />
      </mesh>

      {/* Power Strip with Sockets under Upper Shelf */}
      <group position={[0, tableHeight + shelfHeight - 0.045, -tableDepth / 2 + 0.12]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.8, 0.05, 0.04]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
        {/* Master Switch */}
        <mesh position={[-0.8, 0, 0.021]}>
          <boxGeometry args={[0.03, 0.03, 0.005]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.8} />
        </mesh>
        {/* Sockets & Green LEDs */}
        {[-0.5, -0.25, 0, 0.25, 0.5, 0.75].map((sx, i) => (
          <group key={i} position={[sx, 0, 0.021]}>
            <mesh>
              <circleGeometry args={[0.014, 16]} />
              <meshStandardMaterial color="#0f172a" roughness={0.8} />
            </mesh>
            <mesh position={[0.035, 0.01, 0]}>
              <circleGeometry args={[0.003, 8]} />
              <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.9} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Overhead LED Workbench Light Arm */}
      <group position={[0, tableHeight + shelfHeight + 0.32, -tableDepth / 2 + 0.3]}>
        <mesh position={[-tableWidth / 2 + 0.2, -0.15, -0.15]} castShadow>
          <boxGeometry args={[0.025, 0.3, 0.025]} />
          <meshStandardMaterial color="#334155" metalness={0.7} />
        </mesh>
        <mesh position={[tableWidth / 2 - 0.2, -0.15, -0.15]} castShadow>
          <boxGeometry args={[0.025, 0.3, 0.025]} />
          <meshStandardMaterial color="#334155" metalness={0.7} />
        </mesh>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[tableWidth - 0.6, 0.03, 0.1]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.8} />
        </mesh>
        <mesh position={[0, -0.016, 0]}>
          <boxGeometry args={[tableWidth - 0.64, 0.004, 0.08]} />
          <meshStandardMaterial color="#ffffff" emissive="#f8fafc" emissiveIntensity={1.0} />
        </mesh>
      </group>

      {/* 5. WORKBENCH PROPS & INSTRUMENTS */}

      {/* UPPER SHELF INSTRUMENTS */}
      {/* Digital Storage Oscilloscope */}
      <Oscilloscope
        position={[-0.52, shelfSurfaceY, -tableDepth / 2 + shelfDepth / 2 + 0.02]}
        rotation={[0, 0.12, 0]}
      />

      {/* DC Bench Power Supply */}
      <PowerSupply
        position={[-0.08, shelfSurfaceY, -tableDepth / 2 + shelfDepth / 2 + 0.02]}
        rotation={[0, 0.02, 0]}
      />

      {/* TABLETOP / WORKBENCH SURFACE PROPS */}
      {/* Open Laptop (Left Side Workstation) */}
      <Laptop
        position={[-0.65, surfaceY, 0.08]}
        rotation={[0, 0.28, 0]}
      />

      {/* Soldering Station (Right Side) */}
      <SolderingStation
        position={[0.72, surfaceY, -0.08]}
        rotation={[0, -0.22, 0]}
      />

      {/* Articulated Desk Lamp (Right Rear Clamp) */}
      <DeskLamp
        position={[tableWidth / 2 - 0.15, surfaceY, -tableDepth / 2 + 0.15]}
        rotation={[0, -0.5, 0]}
      />

      {/* Mechanical Keyboard & Mouse on Deskpad */}
      <KeyboardMouse
        position={[-0.08, surfaceY + 0.003, 0.28]}
        rotation={[0, 0.02, 0]}
      />

      {/* Fluke Multimeter */}
      <Multimeter
        position={[0.38, surfaceY + 0.003, 0.06]}
        rotation={[0, -0.25, 0]}
      />

      {/* Center Prototype PCB, Tweezers, Cutters & Coffee Mug */}
      <ElectronicsAndTools
        position={[0, surfaceY + 0.003, 0.02]}
      />
    </group>
  )
}

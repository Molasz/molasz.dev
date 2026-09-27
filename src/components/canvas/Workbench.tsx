import React, { useMemo } from 'react'
import { getWoodTexture, getEsdMatTexture } from '../../utils/textures'
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
  const woodTexture = useMemo(() => getWoodTexture(), [])
  const esdTexture = useMemo(() => getEsdMatTexture(), [])

  const tableW = 2.4
  const tableD = 1.05
  const tableH = 0.82
  const topThick = 0.05
  const legThick = 0.07
  const shelfH = 0.54
  const shelfD = 0.36
  const surfaceY = tableH + topThick / 2
  const matSurfaceY = surfaceY + 0.004
  const shelfSurfaceY = tableH + shelfH + 0.02

  return (
    <group position={[0, 0, 0]}>
      {/* 1. SOLID HANDCRAFTED TIMBER TABLETOP */}
      <mesh position={[0, tableH, 0]} castShadow receiveShadow>
        <boxGeometry args={[tableW, topThick, tableD]} />
        <meshStandardMaterial
          map={woodTexture}
          color="#aa865f"
          roughness={0.65}
          metalness={0.02}
          flatShading
        />
      </mesh>

      {/* Forged Steel Table Edge Trim & Corner Brackets */}
      <mesh position={[0, tableH - 0.006, 0]}>
        <boxGeometry args={[tableW + 0.014, topThick * 0.72, tableD + 0.014]} />
        <meshStandardMaterial color="#1f242b" roughness={0.7} metalness={0.4} flatShading />
      </mesh>

      {/* Brass Corner Reinforcement Rivets */}
      {[
        [-tableW / 2 + 0.02, tableD / 2 - 0.02],
        [tableW / 2 - 0.02, tableD / 2 - 0.02],
        [-tableW / 2 + 0.02, -tableD / 2 + 0.02],
        [tableW / 2 - 0.02, -tableD / 2 + 0.02],
      ].map(([rx, rz], idx) => (
        <mesh key={`rivet-${idx}`} position={[rx, tableH + topThick / 2 + 0.001, rz]} castShadow>
          <cylinderGeometry args={[0.008, 0.008, 0.003, 6]} />
          <meshStandardMaterial color="#c29b53" metalness={0.8} roughness={0.3} flatShading />
        </mesh>
      ))}

      {/* 2. VINTAGE SLATE WORK MAT (Sitting cleanly on wood surface with zero z-fighting) */}
      <group position={[0, surfaceY + 0.002, 0.06]}>
        <mesh receiveShadow>
          <boxGeometry args={[1.55, 0.004, 0.72]} />
          <meshStandardMaterial
            map={esdTexture}
            color="#ffffff"
            roughness={0.75}
            metalness={0.05}
            flatShading
          />
        </mesh>
        {/* Brass Grounding Snap Terminals */}
        <mesh position={[-0.71, 0.004, -0.3]} castShadow>
          <cylinderGeometry args={[0.014, 0.014, 0.006, 6]} />
          <meshStandardMaterial color="#c29b53" metalness={0.8} roughness={0.25} flatShading />
        </mesh>
        <mesh position={[0.71, 0.004, -0.3]} castShadow>
          <cylinderGeometry args={[0.014, 0.014, 0.006, 6]} />
          <meshStandardMaterial color="#c29b53" metalness={0.8} roughness={0.25} flatShading />
        </mesh>
      </group>

      {/* 3. FORGED IRON LEGS & FRAME */}
      {[
        [-tableW / 2 + 0.12, tableD / 2 - 0.1],
        [tableW / 2 - 0.12, tableD / 2 - 0.1],
        [-tableW / 2 + 0.12, -tableD / 2 + 0.1],
        [tableW / 2 - 0.12, -tableD / 2 + 0.1],
      ].map(([x, z], idx) => (
        <group key={idx} position={[x, tableH / 2, z]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[legThick, tableH - topThick, legThick]} />
            <meshStandardMaterial color="#1a1f26" roughness={0.7} metalness={0.5} flatShading />
          </mesh>
          {/* Leveling Foot */}
          <mesh position={[0, -tableH / 2 + 0.015, 0]} castShadow>
            <cylinderGeometry args={[0.038, 0.046, 0.03, 6]} />
            <meshStandardMaterial color="#0c1015" roughness={0.9} flatShading />
          </mesh>
          <mesh position={[0, -tableH / 2 + 0.035, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.025, 6]} />
            <meshStandardMaterial color="#c29b53" metalness={0.8} roughness={0.3} flatShading />
          </mesh>
        </group>
      ))}

      {/* Under-table Steel Rails */}
      <mesh position={[0, tableH - 0.05, tableD / 2 - 0.1]} castShadow receiveShadow>
        <boxGeometry args={[tableW - 0.18, 0.05, 0.04]} />
        <meshStandardMaterial color="#1a1f26" roughness={0.7} metalness={0.5} flatShading />
      </mesh>
      <mesh position={[0, tableH - 0.05, -tableD / 2 + 0.1]} castShadow receiveShadow>
        <boxGeometry args={[tableW - 0.18, 0.05, 0.04]} />
        <meshStandardMaterial color="#1a1f26" roughness={0.7} metalness={0.5} flatShading />
      </mesh>

      {/* Lower H-Frame Crossbars */}
      <mesh position={[-tableW / 2 + 0.12, 0.18, 0]} castShadow receiveShadow>
        <boxGeometry args={[legThick * 0.8, 0.04, tableD - 0.2]} />
        <meshStandardMaterial color="#1a1f26" roughness={0.7} metalness={0.5} flatShading />
      </mesh>
      <mesh position={[tableW / 2 - 0.12, 0.18, 0]} castShadow receiveShadow>
        <boxGeometry args={[legThick * 0.8, 0.04, tableD - 0.2]} />
        <meshStandardMaterial color="#1a1f26" roughness={0.7} metalness={0.5} flatShading />
      </mesh>
      <mesh position={[0, 0.18, -tableD / 2 + 0.1]} castShadow receiveShadow>
        <boxGeometry args={[tableW - 0.24, 0.04, legThick * 0.8]} />
        <meshStandardMaterial color="#1a1f26" roughness={0.7} metalness={0.5} flatShading />
      </mesh>

      {/* 4. REAR UPRIGHTS & TIMBER INSTRUMENT SHELF */}
      {[-tableW / 2 + 0.12, tableW / 2 - 0.12].map((x, idx) => (
        <mesh
          key={`upright-${idx}`}
          position={[x, tableH + shelfH / 2 + 0.05, -tableD / 2 + 0.1]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.05, shelfH + 0.18, 0.05]} />
          <meshStandardMaterial color="#1a1f26" roughness={0.7} metalness={0.5} flatShading />
        </mesh>
      ))}

      {/* Pegboard Backing */}
      <mesh
        position={[0, tableH + shelfH * 0.42, -tableD / 2 + 0.11]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[tableW - 0.3, shelfH * 0.65, 0.015]} />
        <meshStandardMaterial color="#283340" roughness={0.8} metalness={0.2} flatShading />
      </mesh>

      {/* Pegboard Tools */}
      <PegboardTools position={[0, tableH + shelfH * 0.42, -tableD / 2 + 0.12]} />

      {/* Timber Equipment Shelf */}
      <mesh
        position={[0, tableH + shelfH, -tableD / 2 + shelfD / 2 + 0.02]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[tableW - 0.15, 0.035, shelfD]} />
        <meshStandardMaterial map={woodTexture} color="#aa865f" roughness={0.65} metalness={0.02} flatShading />
      </mesh>

      {/* Power Distribution Strip under Shelf */}
      <group position={[0, tableH + shelfH - 0.045, -tableD / 2 + 0.12]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.8, 0.05, 0.04]} />
          <meshStandardMaterial color="#d6d3cb" roughness={0.5} flatShading />
        </mesh>
        {/* Power Switch (Muted Terracotta) */}
        <mesh position={[-0.8, 0, 0.021]}>
          <boxGeometry args={[0.03, 0.03, 0.005]} />
          <meshStandardMaterial color="#9a3412" emissive="#9a3412" emissiveIntensity={0.6} />
        </mesh>
        {/* Sockets */}
        {[-0.5, -0.25, 0, 0.25, 0.5, 0.75].map((sx, i) => (
          <group key={i} position={[sx, 0, 0.021]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.013, 0.013, 0.004, 6]} />
              <meshStandardMaterial color="#1e242b" roughness={0.8} flatShading />
            </mesh>
            <mesh position={[0.035, 0.01, 0]}>
              <boxGeometry args={[0.004, 0.004, 0.004]} />
              <meshStandardMaterial color="#2d5a3f" emissive="#2d5a3f" emissiveIntensity={0.6} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Overhead Luminaire Fixture */}
      <group position={[0, tableH + shelfH + 0.32, -tableD / 2 + 0.3]}>
        <mesh position={[-tableW / 2 + 0.2, -0.15, -0.15]} castShadow>
          <boxGeometry args={[0.025, 0.3, 0.025]} />
          <meshStandardMaterial color="#283340" metalness={0.6} flatShading />
        </mesh>
        <mesh position={[tableW / 2 - 0.2, -0.15, -0.15]} castShadow>
          <boxGeometry args={[0.025, 0.3, 0.025]} />
          <meshStandardMaterial color="#283340" metalness={0.6} flatShading />
        </mesh>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[tableW - 0.6, 0.03, 0.1]} />
          <meshStandardMaterial color="#1a1f26" roughness={0.6} metalness={0.5} flatShading />
        </mesh>
        <mesh position={[0, -0.016, 0]}>
          <boxGeometry args={[tableW - 0.64, 0.004, 0.08]} />
          <meshStandardMaterial color="#fef3c7" emissive="#fef3c7" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* 5. ALL INSTRUMENTS & PROPS (Cleanly spaced, zero collisions) */}

      {/* UPPER SHELF INSTRUMENTS */}
      <Oscilloscope
        position={[-0.45, shelfSurfaceY, -tableD / 2 + shelfD / 2 + 0.02]}
        rotation={[0, 0.12, 0]}
      />

      <PowerSupply
        position={[0.08, shelfSurfaceY, -tableD / 2 + shelfD / 2 + 0.02]}
        rotation={[0, 0.02, 0]}
      />

      {/* TABLETOP WORKSTATION & HARDWARE PROPS */}
      {/* Left Workstation: Portable Terminal */}
      <Laptop
        position={[-0.68, surfaceY, 0.08]}
        rotation={[0, 0.22, 0]}
      />

      {/* Center-Left: Mechanical Keyboard & Ergonomic Mouse */}
      <KeyboardMouse
        position={[-0.06, matSurfaceY, 0.25]}
        rotation={[0, 0.02, 0]}
      />

      {/* Center: Prototype PCB Board */}
      <ElectronicsAndTools
        position={[0, matSurfaceY, -0.06]}
      />

      {/* Center-Right: Multimeter */}
      <Multimeter
        position={[0.34, matSurfaceY, -0.06]}
        rotation={[0, -0.28, 0]}
      />

      {/* Right Bay: Soldering Station */}
      <SolderingStation
        position={[0.74, surfaceY, -0.10]}
        rotation={[0, -0.22, 0]}
      />

      {/* Right Rear: Articulated Desk Lamp */}
      <DeskLamp
        position={[tableW / 2 - 0.16, surfaceY, -tableD / 2 + 0.16]}
        rotation={[0, -0.5, 0]}
      />
    </group>
  )
}

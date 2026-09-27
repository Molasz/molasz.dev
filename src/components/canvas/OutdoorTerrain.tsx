import React, { useMemo, useState, useEffect } from 'react'
import * as THREE from 'three'
import { FigTree } from '../props/FigTree'
import { soundFx } from '../../utils/sound'

interface OutdoorTerrainProps {
  onSelectTaller?: () => void
  soundEnabled?: boolean
}

export const OutdoorTerrain: React.FC<OutdoorTerrainProps> = ({ onSelectTaller, soundEnabled = true }) => {
  const [tallerHovered, setTallerHovered] = useState(false)
  const [habitacioHovered, setHabitacioHovered] = useState(false)

  useEffect(() => {
    document.body.style.cursor = tallerHovered || habitacioHovered ? 'pointer' : 'auto'
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [tallerHovered, habitacioHovered])

  // Outer rolling landscape
  const outerTerrainGeo = useMemo(() => {
    const width = 70
    const height = 70
    const segments = 45
    const geo = new THREE.PlaneGeometry(width, height, segments, segments)
    geo.rotateX(-Math.PI / 2)

    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      const dist = Math.sqrt(x * x + z * z)

      if (Math.abs(x) < 9.0 && Math.abs(z) < 10.5) {
        pos.setY(i, 0)
      } else {
        const hillElevation =
          Math.sin(x * 0.15) * Math.cos(z * 0.13) * 2.2 +
          Math.sin(x * 0.06 + z * 0.06) * 3.5 +
          Math.cos(x * 0.25) * 0.6
        const edgeFactor = Math.min(3.5, Math.pow(dist / 12, 1.5))
        pos.setY(i, Math.max(-0.2, hillElevation * (edgeFactor * 0.35)))
      }
    }
    geo.computeVertexNormals()
    return geo
  }, [])

  // Stepping stone pathway
  const pathStones = [
    [-4.0, -2.6, 0.6, 0.45],
    [-3.3, -2.0, 0.55, 0.42],
    [-2.6, -1.4, 0.58, 0.45],
    [-1.9, -0.9, 0.52, 0.40],
    [-1.0, -0.5, 0.62, 0.48],
    [0.0, -0.3, 0.65, 0.50],
    [0.9, -0.3, 0.60, 0.46],
    [-0.7, 0.5, 0.56, 0.44],
    [-1.3, 1.3, 0.58, 0.45],
    [-1.9, 2.1, 0.62, 0.48],
    [-2.5, 2.8, 0.58, 0.44],
    [-3.1, 3.4, 0.60, 0.46],
    [-3.6, 4.0, 0.64, 0.48],
    [1.8, 0.8, 0.55, 0.42],
    [2.3, 2.0, 0.58, 0.44],
    [2.6, 3.4, 0.60, 0.46],
    [2.7, 5.0, 0.58, 0.45],
    [2.6, 6.8, 0.62, 0.48],
  ]

  const handleTallerClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    soundFx.cameraSwoosh(soundEnabled)
    if (onSelectTaller) {
      onSelectTaller()
    }
  }

  const handleHabitacioClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    soundFx.click(soundEnabled)
  }

  return (
    <group position={[0, 0, 0]}>
      {/* 1. COUNTRYSIDE TERRAIN */}
      <mesh geometry={outerTerrainGeo} receiveShadow castShadow>
        <meshStandardMaterial
          color="#385e3c"
          roughness={0.82}
          metalness={0.04}
          flatShading
        />
      </mesh>

      {/* 2. MAIN PROPERTY COURTYARD & PERIMETER WALLS (home.jpg) */}
      <group position={[0, 0.02, 0]}>
        {/* Courtyard Grass Surface */}
        <mesh position={[-0.5, 0, 0]} receiveShadow>
          <boxGeometry args={[15.2, 0.03, 18.2]} />
          <meshStandardMaterial color="#416e49" roughness={0.78} flatShading />
        </mesh>

        {/* Garden Soil Flowerbeds */}
        <mesh position={[-6.2, 0.015, 0]} receiveShadow>
          <boxGeometry args={[1.6, 0.02, 16.5]} />
          <meshStandardMaterial color="#35281e" roughness={0.9} flatShading />
        </mesh>
        <mesh position={[-0.5, 0.015, -7.6]} receiveShadow>
          <boxGeometry args={[12.5, 0.02, 1.4]} />
          <meshStandardMaterial color="#35281e" roughness={0.9} flatShading />
        </mesh>

        {/* Dry-stone Perimeter Walls */}
        <group position={[-7.5, 0.5, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.42, 1.0, 18.0]} />
            <meshStandardMaterial color="#64748b" roughness={0.88} flatShading />
          </mesh>
          <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.48, 0.06, 18.0]} />
            <meshStandardMaterial color="#475569" roughness={0.8} flatShading />
          </mesh>
        </group>

        <group position={[-0.5, 0.5, -8.9]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[14.6, 1.0, 0.42]} />
            <meshStandardMaterial color="#64748b" roughness={0.88} flatShading />
          </mesh>
          <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
            <boxGeometry args={[14.6, 0.06, 0.48]} />
            <meshStandardMaterial color="#475569" roughness={0.8} flatShading />
          </mesh>
        </group>

        <group position={[6.8, 0.5, -4.5]} rotation={[0, -0.15, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.42, 1.0, 9.2]} />
            <meshStandardMaterial color="#64748b" roughness={0.88} flatShading />
          </mesh>
          <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.48, 0.06, 9.2]} />
            <meshStandardMaterial color="#475569" roughness={0.8} flatShading />
          </mesh>
        </group>
        <group position={[4.6, 0.5, 3.8]} rotation={[0, -0.45, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.42, 1.0, 9.8]} />
            <meshStandardMaterial color="#64748b" roughness={0.88} flatShading />
          </mesh>
          <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.48, 0.06, 9.8]} />
            <meshStandardMaterial color="#475569" roughness={0.8} flatShading />
          </mesh>
        </group>

        <group position={[-3.0, 0.5, 8.9]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[9.8, 1.0, 0.42]} />
            <meshStandardMaterial color="#64748b" roughness={0.88} flatShading />
          </mesh>
          <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
            <boxGeometry args={[9.8, 0.06, 0.48]} />
            <meshStandardMaterial color="#475569" roughness={0.8} flatShading />
          </mesh>
        </group>

        {/* Entrance Gate with Stone Pillars */}
        <group position={[2.6, 0, 8.9]}>
          <mesh position={[-0.85, 0.65, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.55, 1.3, 0.55]} />
            <meshStandardMaterial color="#475569" roughness={0.85} flatShading />
          </mesh>
          <mesh position={[0.85, 0.65, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.55, 1.3, 0.55]} />
            <meshStandardMaterial color="#475569" roughness={0.85} flatShading />
          </mesh>
          <group position={[0, 0.55, 0]} rotation={[0, 0.25, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.4, 1.05, 0.06]} />
              <meshStandardMaterial color="#6e3c1a" roughness={0.7} flatShading />
            </mesh>
            <mesh position={[0, 0, 0.035]} castShadow>
              <boxGeometry args={[1.35, 0.05, 0.015]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} flatShading />
            </mesh>
          </group>
        </group>

        {/* Stepping Stone Pathway */}
        {pathStones.map(([px, pz, pw, pd], idx) => (
          <mesh key={`path-${idx}`} position={[px, 0.025, pz]} receiveShadow castShadow>
            <boxGeometry args={[pw, 0.02, pd]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.72} flatShading />
          </mesh>
        ))}
      </group>

      {/* ========================================================================= */}
      {/* 3. EDIFICI: TALLER (Teulada triangular clàssica a dues aigües)           */}
      {/* ========================================================================= */}
      <group
        position={[-4.5, 0, -4.8]}
        onClick={handleTallerClick}
        onPointerOver={(e) => {
          e.stopPropagation()
          setTallerHovered(true)
        }}
        onPointerOut={() => setTallerHovered(false)}
      >
        {/* Foundation */}
        <mesh position={[0, 0.08, 0]} receiveShadow castShadow>
          <boxGeometry args={[5.2, 0.16, 4.2]} />
          <meshStandardMaterial color="#334155" roughness={0.8} flatShading />
        </mesh>

        {/* Main Walls (Height = 2.8m) */}
        <mesh position={[0, 1.48, 0]} castShadow receiveShadow>
          <boxGeometry args={[5.0, 2.8, 4.0]} />
          <meshStandardMaterial
            color={tallerHovered ? '#64748b' : '#475569'}
            roughness={0.85}
            metalness={0.05}
            flatShading
          />
        </mesh>

        {/* Corner Stone Quoins */}
        {[
          [-2.45, -1.95],
          [2.45, -1.95],
          [-2.45, 1.95],
          [2.45, 1.95],
        ].map(([qx, qz], idx) => (
          <mesh key={`quoin-${idx}`} position={[qx, 1.48, qz]} castShadow receiveShadow>
            <boxGeometry args={[0.22, 2.8, 0.22]} />
            <meshStandardMaterial color="#334155" roughness={0.8} flatShading />
          </mesh>
        ))}

        {/* TEULADA TRIANGULAR CLÀSSICA (Clean Flat Gabled Roof) */}
        <group position={[0, 2.88, 0]}>
          {/* South Roof Slope */}
          <mesh position={[0, 0.48, 1.15]} rotation={[0.40, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[5.4, 0.10, 2.5]} />
            <meshStandardMaterial color="#b44b1c" roughness={0.7} flatShading />
          </mesh>

          {/* North Roof Slope */}
          <mesh position={[0, 0.48, -1.15]} rotation={[-0.40, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[5.4, 0.10, 2.5]} />
            <meshStandardMaterial color="#b44b1c" roughness={0.7} flatShading />
          </mesh>
        </group>

        {/* Wooden Entrance Porch */}
        <group position={[0.9, 0, 2.1]}>
          <mesh position={[-0.8, 1.2, 0.8]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 2.4, 6]} />
            <meshStandardMaterial color="#5c381e" roughness={0.8} flatShading />
          </mesh>
          <mesh position={[0.8, 1.2, 0.8]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 2.4, 6]} />
            <meshStandardMaterial color="#5c381e" roughness={0.8} flatShading />
          </mesh>
          {/* Sloped Porch Roof */}
          <mesh position={[0, 2.45, 0.45]} rotation={[0.22, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.95, 0.06, 1.15]} />
            <meshStandardMaterial color="#b44b1c" roughness={0.7} flatShading />
          </mesh>
        </group>

        {/* Industrial Workshop Entrance Door */}
        <group position={[0.9, 1.05, 2.02]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.3, 2.1, 0.06]} />
            <meshStandardMaterial color="#1e293b" roughness={0.7} flatShading />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[1.15, 2.0, 0.04]} />
            <meshStandardMaterial color="#334155" roughness={0.6} flatShading />
          </mesh>
          <mesh position={[0, -0.85, 0.045]} castShadow>
            <boxGeometry args={[1.0, 0.22, 0.01]} />
            <meshStandardMaterial color="#b5935b" metalness={0.85} flatShading />
          </mesh>
          <mesh position={[-0.45, 0, 0.06]} castShadow>
            <boxGeometry args={[0.08, 0.02, 0.04]} />
            <meshStandardMaterial color="#b5935b" metalness={0.85} flatShading />
          </mesh>
        </group>

        {/* Large Factory Window */}
        <group position={[-1.4, 1.6, 2.02]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.6, 1.3, 0.08]} />
            <meshStandardMaterial color="#1e293b" roughness={0.6} flatShading />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <planeGeometry args={[1.45, 1.15]} />
            <meshStandardMaterial
              color="#fef3c7"
              emissive="#fef3c7"
              emissiveIntensity={1.4}
              transparent
              opacity={0.9}
            />
          </mesh>
          <mesh position={[0, -0.68, 0.06]} castShadow receiveShadow>
            <boxGeometry args={[1.7, 0.06, 0.14]} />
            <meshStandardMaterial color="#1e293b" roughness={0.7} flatShading />
          </mesh>
        </group>

        {/* "TALLER / LAB" Sign */}
        <group position={[0.9, 2.7, 2.04]}>
          <mesh castShadow>
            <boxGeometry args={[1.3, 0.28, 0.05]} />
            <meshStandardMaterial color="#1e293b" metalness={0.7} flatShading />
          </mesh>
          <mesh position={[0, 0, 0.03]}>
            <planeGeometry args={[1.1, 0.18]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </group>

        {/* Exterior Gooseneck Lamp */}
        <mesh position={[0.9, 2.95, 2.15]}>
          <sphereGeometry args={[0.09, 8, 8]} />
          <meshStandardMaterial color="#fef3c7" emissive="#fef3c7" emissiveIntensity={2.0} />
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* 4. EDIFICI: HABITACIÓ (Teulada triangular clàssica a dues aigües)        */}
      {/* ========================================================================= */}
      <group
        position={[-3.8, 0, 5.0]}
        onClick={handleHabitacioClick}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHabitacioHovered(true)
        }}
        onPointerOut={() => setHabitacioHovered(false)}
      >
        {/* Foundation */}
        <mesh position={[0, 0.08, 0]} receiveShadow castShadow>
          <boxGeometry args={[4.8, 0.16, 4.0]} />
          <meshStandardMaterial color="#334155" roughness={0.8} flatShading />
        </mesh>

        {/* Whitewashed Mediterranean House Walls */}
        <mesh position={[0, 1.38, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.6, 2.6, 3.8]} />
          <meshStandardMaterial
            color={habitacioHovered ? '#94a3b8' : '#cbd5e1'}
            roughness={0.9}
            metalness={0.02}
            flatShading
          />
        </mesh>

        {/* TEULADA TRIANGULAR CLÀSSICA (Clean Flat Gabled Roof) */}
        <group position={[0, 2.68, 0]}>
          {/* South Roof Slope */}
          <mesh position={[0, 0.45, 1.08]} rotation={[0.38, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[5.0, 0.10, 2.4]} />
            <meshStandardMaterial color="#c2410c" roughness={0.68} flatShading />
          </mesh>

          {/* North Roof Slope */}
          <mesh position={[0, 0.45, -1.08]} rotation={[-0.38, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[5.0, 0.10, 2.4]} />
            <meshStandardMaterial color="#c2410c" roughness={0.68} flatShading />
          </mesh>
        </group>

        {/* Domestic Entrance Door */}
        <group position={[-0.8, 1.0, -1.92]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.1, 2.0, 0.06]} />
            <meshStandardMaterial color="#1e293b" roughness={0.7} flatShading />
          </mesh>
          <mesh position={[0, 0, -0.02]}>
            <boxGeometry args={[0.98, 1.9, 0.04]} />
            <meshStandardMaterial color="#6e3c1a" roughness={0.65} flatShading />
          </mesh>
          <mesh position={[0.36, 0, -0.05]} castShadow>
            <boxGeometry args={[0.06, 0.02, 0.03]} />
            <meshStandardMaterial color="#b5935b" metalness={0.85} flatShading />
          </mesh>
        </group>

        {/* Bedroom Window with Wooden Shutters */}
        <group position={[1.2, 1.5, -1.92]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.3, 1.1, 0.06]} />
            <meshStandardMaterial color="#1e293b" roughness={0.6} flatShading />
          </mesh>
          <mesh position={[0, 0, -0.02]}>
            <planeGeometry args={[1.15, 0.95]} />
            <meshStandardMaterial
              color="#fed7aa"
              emissive="#fed7aa"
              emissiveIntensity={1.2}
              transparent
              opacity={0.85}
            />
          </mesh>
          {/* Left Shutter */}
          <mesh position={[-0.72, 0, 0.02]} rotation={[0, -0.4, 0]} castShadow>
            <boxGeometry args={[0.32, 1.1, 0.03]} />
            <meshStandardMaterial color="#1e3a5f" roughness={0.7} flatShading />
          </mesh>
          {/* Right Shutter */}
          <mesh position={[0.72, 0, 0.02]} rotation={[0, 0.4, 0]} castShadow>
            <boxGeometry args={[0.32, 1.1, 0.03]} />
            <meshStandardMaterial color="#1e3a5f" roughness={0.7} flatShading />
          </mesh>
        </group>
      </group>

      {/* 5. ARBRE: LA FIGUERA MEDITERRÀNIA */}
      <FigTree
        position={[2.4, 0, -0.8]}
        scale={1.3}
        soundEnabled={soundEnabled}
      />

      {/* 6. TRADITIONAL STONE WATER WELL */}
      <group position={[0.5, 0, 3.2]}>
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.65, 0.70, 0.7, 12]} />
          <meshStandardMaterial color="#64748b" roughness={0.88} flatShading />
        </mesh>
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 0.05, 12]} />
          <meshStandardMaterial color="#0284c7" roughness={0.2} metalness={0.3} />
        </mesh>
        {/* Wooden Well Posts */}
        <mesh position={[-0.55, 1.0, 0]} castShadow>
          <boxGeometry args={[0.08, 1.3, 0.08]} />
          <meshStandardMaterial color="#5c381e" roughness={0.8} flatShading />
        </mesh>
        <mesh position={[0.55, 1.0, 0]} castShadow>
          <boxGeometry args={[0.08, 1.3, 0.08]} />
          <meshStandardMaterial color="#5c381e" roughness={0.8} flatShading />
        </mesh>
        <group position={[0, 1.65, 0]}>
          <mesh position={[-0.32, 0, 0]} rotation={[0, 0, 0.5]} castShadow>
            <boxGeometry args={[0.75, 0.04, 0.9]} />
            <meshStandardMaterial color="#78350f" roughness={0.7} flatShading />
          </mesh>
          <mesh position={[0.32, 0, 0]} rotation={[0, 0, -0.5]} castShadow>
            <boxGeometry args={[0.75, 0.04, 0.9]} />
            <meshStandardMaterial color="#78350f" roughness={0.7} flatShading />
          </mesh>
        </group>
      </group>

      {/* 7. OUTDOOR PATIO FURNITURE & PLANTERS */}
      <group position={[4.5, 0, -4.8]} rotation={[0, 0.3, 0]}>
        <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.3, 0.06, 0.7]} />
          <meshStandardMaterial color="#6e3c1a" roughness={0.75} flatShading />
        </mesh>
        {[-0.5, 0.5].map((tx, idx) => (
          <mesh key={`tleg-${idx}`} position={[tx, 0.2, 0]} castShadow>
            <boxGeometry args={[0.06, 0.4, 0.55]} />
            <meshStandardMaterial color="#362215" roughness={0.9} flatShading />
          </mesh>
        ))}
        {[-0.55, 0.55].map((bz, idx) => (
          <mesh key={`tbench-${idx}`} position={[0, 0.24, bz]} castShadow receiveShadow>
            <boxGeometry args={[1.3, 0.04, 0.26]} />
            <meshStandardMaterial color="#6e3c1a" roughness={0.75} flatShading />
          </mesh>
        ))}
      </group>

      {/* Terracotta Planter Pots */}
      {[
        [-1.6, -3.4, 0.26, '#7c3aed'],
        [-1.6, -4.4, 0.24, '#15803d'],
        [-1.6, 4.2, 0.28, '#8b5cf6'],
        [-1.6, 5.2, 0.25, '#7c3aed'],
        [4.2, -1.8, 0.32, '#15803d'],
        [4.8, 1.0, 0.28, '#8b5cf6'],
      ].map(([px, pz, pRad, pCol], idx) => (
        <group key={`pot-${idx}`} position={[Number(px), 0.02, Number(pz)]}>
          <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[Number(pRad), Number(pRad) * 0.7, 0.36, 10]} />
            <meshStandardMaterial color="#c2410c" roughness={0.75} flatShading />
          </mesh>
          <mesh position={[0, 0.42, 0]} castShadow>
            <dodecahedronGeometry args={[Number(pRad) * 1.15, 0]} />
            <meshStandardMaterial color={String(pCol)} roughness={0.8} flatShading />
          </mesh>
        </group>
      ))}

      {/* Rounded Mediterranean Olive & Cypress Trees */}
      {[
        [-13, 5, 1.3],
        [-15, -6, 1.5],
        [12, -12, 1.4],
        [15, 3, 1.6],
        [10, 12, 1.2],
        [-9, 15, 1.5],
        [-15, 13, 1.6],
      ].map(([tx, tz, tScale], idx) => (
        <group key={`tree-med-${idx}`} position={[tx, 0, tz]} scale={tScale}>
          <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.16, 0.24, 1.4, 8]} />
            <meshStandardMaterial color="#452618" roughness={0.85} flatShading />
          </mesh>
          <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
            <dodecahedronGeometry args={[1.05, 1]} />
            <meshStandardMaterial color="#2d6a4f" roughness={0.8} flatShading />
          </mesh>
          <mesh position={[0.4, 2.3, 0.2]} castShadow receiveShadow>
            <dodecahedronGeometry args={[0.85, 1]} />
            <meshStandardMaterial color="#40916c" roughness={0.8} flatShading />
          </mesh>
          <mesh position={[-0.3, 2.2, -0.2]} castShadow receiveShadow>
            <dodecahedronGeometry args={[0.8, 1]} />
            <meshStandardMaterial color="#52b788" roughness={0.8} flatShading />
          </mesh>
        </group>
      ))}
    </group>
  )
}

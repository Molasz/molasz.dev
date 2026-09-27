import React from 'react'
import * as THREE from 'three'

export const WorkshopRoom: React.FC = () => {
  const roomW = 6.4
  const roomD = 5.2
  const roomH = 3.2

  const wallColor = '#475569'
  const wallAccent = '#334155'
  const beamColor = '#1e293b'
  const skirtingColor = '#0f172a'
  const windowGlow = '#bae6fd'
  const windowFrame = '#1e293b'
  const conduitColor = '#94a3b8'
  const ceilingTube = '#ffffff'
  const doorColor = '#334155'

  return (
    <group position={[0, 0, 0]}>
      {/* 1. REAR WALL (With Central Industrial Factory Window) */}
      <group position={[0, roomH / 2, -roomD / 2 + 0.4]}>
        <mesh receiveShadow>
          <planeGeometry args={[roomW, roomH]} />
          <meshStandardMaterial
            color={wallColor}
            roughness={0.85}
            metalness={0.05}
            flatShading
          />
        </mesh>

        {/* Lower Wall Wainscot Accent Strip */}
        <mesh position={[0, -roomH / 2 + 0.45, 0.005]} receiveShadow>
          <planeGeometry args={[roomW, 0.9]} />
          <meshStandardMaterial
            color={wallAccent}
            roughness={0.8}
            metalness={0.1}
            flatShading
          />
        </mesh>

        {/* Baseboard Skirting Trim */}
        <mesh position={[0, -roomH / 2 + 0.04, 0.015]} castShadow receiveShadow>
          <boxGeometry args={[roomW, 0.08, 0.02]} />
          <meshStandardMaterial color={skirtingColor} roughness={0.7} flatShading />
        </mesh>

        {/* Central Factory Window on Rear Wall */}
        <group position={[0, 0.45, 0.02]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[2.4, 1.5, 0.06]} />
            <meshStandardMaterial color={windowFrame} roughness={0.5} metalness={0.5} flatShading />
          </mesh>

          {/* Window Glass Pane */}
          <mesh position={[0, 0, 0.005]}>
            <planeGeometry args={[2.3, 1.4]} />
            <meshStandardMaterial
              color={windowGlow}
              emissive={windowGlow}
              emissiveIntensity={0.85}
              transparent
              opacity={0.65}
            />
          </mesh>

          {/* Window Mullions Grid (Quarterons industrials) */}
          {[-0.6, 0, 0.6].map((wx, i) => (
            <mesh key={`wm-${i}`} position={[wx, 0, 0.015]}>
              <boxGeometry args={[0.025, 1.4, 0.02]} />
              <meshStandardMaterial color={windowFrame} roughness={0.5} flatShading />
            </mesh>
          ))}
          {[-0.35, 0.35].map((wy, i) => (
            <mesh key={`hm-${i}`} position={[0, wy, 0.015]}>
              <boxGeometry args={[2.3, 0.025, 0.02]} />
              <meshStandardMaterial color={windowFrame} roughness={0.5} flatShading />
            </mesh>
          ))}

          {/* Heavy Stone Window Sill */}
          <mesh position={[0, -0.78, 0.05]} castShadow receiveShadow>
            <boxGeometry args={[2.5, 0.06, 0.15]} />
            <meshStandardMaterial color={windowFrame} roughness={0.6} flatShading />
          </mesh>
        </group>
      </group>

      {/* 2. LEFT WALL (With Entrance Door next to the Workbench) */}
      <group position={[-roomW / 2, roomH / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh receiveShadow>
          <planeGeometry args={[roomD, roomH]} />
          <meshStandardMaterial
            color={wallColor}
            roughness={0.85}
            metalness={0.05}
            side={THREE.DoubleSide}
            flatShading
          />
        </mesh>

        {/* Baseboard Trim */}
        <mesh position={[0, -roomH / 2 + 0.04, 0.015]} castShadow receiveShadow>
          <boxGeometry args={[roomD, 0.08, 0.02]} />
          <meshStandardMaterial color={skirtingColor} roughness={0.7} flatShading />
        </mesh>

        {/* Entrance Door Unit (Positioned next to workbench at z = -0.8) */}
        <group position={[-0.8, -roomH / 2 + 1.15, 0.01]}>
          {/* Heavy Steel Door Frame */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.15, 2.3, 0.06]} />
            <meshStandardMaterial color="#0f172a" roughness={0.6} metalness={0.6} flatShading />
          </mesh>
          {/* Top Transom Window */}
          <mesh position={[0, 0.92, 0.005]}>
            <planeGeometry args={[0.95, 0.32]} />
            <meshStandardMaterial color="#bae6fd" emissive="#bae6fd" emissiveIntensity={0.6} transparent opacity={0.6} />
          </mesh>
          {/* Door Leaf (Slightly ajar 15°) */}
          <group position={[0.48, -0.16, 0]} rotation={[0, 0.25, 0]}>
            <mesh position={[-0.48, 0, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.96, 1.95, 0.04]} />
              <meshStandardMaterial color={doorColor} roughness={0.65} metalness={0.2} flatShading />
            </mesh>
            {/* Brass Door Lever Handle & Plate */}
            <mesh position={[-0.86, 0, 0.035]} castShadow>
              <boxGeometry args={[0.08, 0.02, 0.04]} />
              <meshStandardMaterial color="#b5935b" metalness={0.85} roughness={0.25} flatShading />
            </mesh>
            <mesh position={[-0.86, 0, 0.022]} castShadow>
              <boxGeometry args={[0.04, 0.16, 0.006]} />
              <meshStandardMaterial color="#b5935b" metalness={0.85} roughness={0.25} flatShading />
            </mesh>
          </group>
        </group>

        {/* Electrical Conduit Running to Entrance Switch */}
        <group position={[-0.1, -roomH / 2 + 1.2, 0.02]}>
          <mesh position={[0, 0.4, 0]} castShadow>
            <cylinderGeometry args={[0.008, 0.008, 0.8, 6]} />
            <meshStandardMaterial color={conduitColor} metalness={0.8} flatShading />
          </mesh>
          <mesh castShadow>
            <boxGeometry args={[0.09, 0.12, 0.04]} />
            <meshStandardMaterial color="#1e293b" metalness={0.7} flatShading />
          </mesh>
        </group>
      </group>

      {/* 3. RIGHT WALL (With Conduits, Breaker Panel & Storage Area) */}
      <group position={[roomW / 2, roomH / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh receiveShadow>
          <planeGeometry args={[roomD, roomH]} />
          <meshStandardMaterial
            color={wallColor}
            roughness={0.85}
            metalness={0.05}
            side={THREE.DoubleSide}
            flatShading
          />
        </mesh>

        {/* Baseboard Trim */}
        <mesh position={[0, -roomH / 2 + 0.04, 0.015]} castShadow receiveShadow>
          <boxGeometry args={[roomD, 0.08, 0.02]} />
          <meshStandardMaterial color={skirtingColor} roughness={0.7} flatShading />
        </mesh>

        {/* Main Industrial Breaker Unit & Conduits */}
        <group position={[-1.2, 0.15, 0.02]}>
          {/* Vertical Conduit Pipes */}
          {[-0.06, 0, 0.06].map((cx, idx) => (
            <mesh key={`pipe-${idx}`} position={[cx, 0.5, 0]} castShadow>
              <cylinderGeometry args={[0.01, 0.01, 1.8, 6]} />
              <meshStandardMaterial color={conduitColor} metalness={0.8} flatShading />
            </mesh>
          ))}
          {/* Main Electrical Box */}
          <mesh position={[0, 0.25, 0.03]} castShadow receiveShadow>
            <boxGeometry args={[0.32, 0.48, 0.12]} />
            <meshStandardMaterial color="#1e293b" metalness={0.65} roughness={0.35} flatShading />
          </mesh>
          {/* High-Voltage Warning Decal */}
          <mesh position={[0, 0.35, 0.095]}>
            <planeGeometry args={[0.12, 0.08]} />
            <meshBasicMaterial color="#f59e0b" />
          </mesh>
          {/* Master Throw Switch Handle */}
          <mesh position={[0.12, 0.22, 0.09]} rotation={[0, 0, -0.4]} castShadow>
            <boxGeometry args={[0.025, 0.12, 0.025]} />
            <meshStandardMaterial color="#dc2626" roughness={0.5} flatShading />
          </mesh>
        </group>
      </group>

      {/* 4. OVERHEAD CEILING BEAMS, TRUSSES & INDUSTRIAL LIGHTING */}
      <group position={[0, roomH - 0.05, 0]}>
        {/* Steel I-Beams with Diagonal Web Braces */}
        {[-1.8, -0.6, 0.6, 1.8].map((bx, idx) => (
          <group key={`beam-${idx}`} position={[bx, 0, -0.2]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.12, 0.18, roomD - 0.8]} />
              <meshStandardMaterial color={beamColor} metalness={0.75} roughness={0.4} flatShading />
            </mesh>
            {/* Diagonal Truss Supports */}
            {[-1.4, 0, 1.4].map((tz, ti) => (
              <mesh key={`truss-${ti}`} position={[0, -0.12, tz]} rotation={[0.4, 0, 0]} castShadow>
                <boxGeometry args={[0.06, 0.24, 0.04]} />
                <meshStandardMaterial color={beamColor} metalness={0.75} flatShading />
              </mesh>
            ))}
          </group>
        ))}

        {/* Industrial Spiral Ventilation Duct */}
        <group position={[1.4, -0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.16, 0.16, roomD - 0.6, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.25} flatShading />
          </mesh>
        </group>

        {/* Dual Industrial Fluorescent Light Fixtures */}
        {[-1.2, 1.2].map((lx, idx) => (
          <group key={`fluor-${idx}`} position={[lx, -0.14, 0.2]}>
            <mesh castShadow>
              <boxGeometry args={[0.22, 0.04, 1.8]} />
              <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.5} flatShading />
            </mesh>
            <mesh position={[-0.05, -0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 1.7, 8]} />
              <meshStandardMaterial
                color={ceilingTube}
                emissive={ceilingTube}
                emissiveIntensity={2.0}
              />
            </mesh>
            <mesh position={[0.05, -0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 1.7, 8]} />
              <meshStandardMaterial
                color={ceilingTube}
                emissive={ceilingTube}
                emissiveIntensity={2.0}
              />
            </mesh>
          </group>
        ))}

        {/* Galvanized Cable Tray */}
        <mesh position={[0, -0.06, -0.3]} castShadow>
          <boxGeometry args={[roomW - 0.4, 0.04, 0.14]} />
          <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.4} flatShading />
        </mesh>
      </group>
    </group>
  )
}

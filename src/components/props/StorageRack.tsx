import React from 'react'

interface StorageRackProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
}

export const StorageRack: React.FC<StorageRackProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}) => {
  const rackW = 1.15
  const rackD = 0.42
  const rackH = 1.85
  const shelfYPositions = [0.12, 0.65, 1.18, 1.70]

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* 1. 4 UPRIGHT STEEL CORNER POSTS */}
      {[
        [-rackW / 2 + 0.02, -rackD / 2 + 0.02],
        [rackW / 2 - 0.02, -rackD / 2 + 0.02],
        [-rackW / 2 + 0.02, rackD / 2 - 0.02],
        [rackW / 2 - 0.02, rackD / 2 - 0.02],
      ].map(([x, z], idx) => (
        <group key={`post-${idx}`} position={[x, rackH / 2, z]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.035, rackH, 0.035]} />
            <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.4} flatShading />
          </mesh>
          {/* Post Foot Pad */}
          <mesh position={[0, -rackH / 2 + 0.005, 0]} castShadow>
            <boxGeometry args={[0.05, 0.01, 0.05]} />
            <meshStandardMaterial color="#0f172a" roughness={0.8} flatShading />
          </mesh>
        </group>
      ))}

      {/* 2. 4 STEEL SHELVES & CROSS BEAMS */}
      {shelfYPositions.map((sy, sIdx) => (
        <group key={`shelf-${sIdx}`} position={[0, sy, 0]}>
          {/* Shelf Surface Panel */}
          <mesh position={[0, 0.01, 0]} castShadow receiveShadow>
            <boxGeometry args={[rackW, 0.018, rackD]} />
            <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.5} flatShading />
          </mesh>
          {/* Front & Back Beams */}
          <mesh position={[0, -0.01, rackD / 2 - 0.01]} castShadow>
            <boxGeometry args={[rackW, 0.03, 0.018]} />
            <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.4} flatShading />
          </mesh>
          <mesh position={[0, -0.01, -rackD / 2 + 0.01]} castShadow>
            <boxGeometry args={[rackW, 0.03, 0.018]} />
            <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.4} flatShading />
          </mesh>
        </group>
      ))}

      {/* 3. STORED PROPS ON SHELVES */}
      {/* Tier 1 (Bottom, sy = 0.12): Heavy Equipment Cases & Hard Cases */}
      <group position={[-0.24, 0.26, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.42, 0.24, 0.32]} />
          <meshStandardMaterial color="#1c2430" roughness={0.6} metalness={0.4} flatShading />
        </mesh>
        {/* Latches */}
        <mesh position={[0, 0, 0.162]} castShadow>
          <boxGeometry args={[0.08, 0.04, 0.008]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.85} flatShading />
        </mesh>
      </group>

      <group position={[0.26, 0.22, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.36, 0.18, 0.28]} />
          <meshStandardMaterial color="#9a3412" roughness={0.7} flatShading />
        </mesh>
      </group>

      {/* Tier 2 (sy = 0.65): Stacked Toolboxes & Parts Storage Bins */}
      {[-0.34, -0.11, 0.11, 0.34].map((bx, idx) => {
        const binColors = ['#0284c7', '#2563eb', '#16a34a', '#d97706']
        return (
          <group key={`bin-${idx}`} position={[bx, 0.74, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.18, 0.14, 0.32]} />
              <meshStandardMaterial color={binColors[idx]} roughness={0.65} flatShading />
            </mesh>
            {/* Front Label Slot */}
            <mesh position={[0, 0.02, 0.161]}>
              <planeGeometry args={[0.10, 0.04]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        )
      })}

      {/* Tier 3 (sy = 1.18): Filament Spools & Cable Reels */}
      {[-0.32, -0.16, 0.05, 0.28].map((sx, idx) => {
        const reelColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b']
        return (
          <group key={`reel-${idx}`} position={[sx, 1.30, 0]} rotation={[0, 0, Math.PI / 2]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.10, 0.10, 0.08, 12]} />
              <meshStandardMaterial color={reelColors[idx]} roughness={0.6} flatShading />
            </mesh>
            <mesh position={[0, 0.042, 0]} castShadow>
              <cylinderGeometry args={[0.11, 0.11, 0.006, 12]} />
              <meshStandardMaterial color="#0f172a" roughness={0.8} flatShading />
            </mesh>
            <mesh position={[0, -0.042, 0]} castShadow>
              <cylinderGeometry args={[0.11, 0.11, 0.006, 12]} />
              <meshStandardMaterial color="#0f172a" roughness={0.8} flatShading />
            </mesh>
          </group>
        )
      })}

      {/* Tier 4 (Top, sy = 1.70): Lightweight Hardware Boxes */}
      <group position={[-0.20, 1.80, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.38, 0.16, 0.30]} />
          <meshStandardMaterial color="#92400e" roughness={0.8} flatShading />
        </mesh>
      </group>
      <group position={[0.22, 1.82, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.32, 0.20, 0.28]} />
          <meshStandardMaterial color="#b45309" roughness={0.8} flatShading />
        </mesh>
      </group>
    </group>
  )
}

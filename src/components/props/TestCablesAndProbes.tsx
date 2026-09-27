import React, { useMemo } from 'react'
import * as THREE from 'three'

interface TestCablesAndProbesProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
}

export const TestCablesAndProbes: React.FC<TestCablesAndProbesProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}) => {
  // 1. Oscilloscope Probe Cable (Curves from upper shelf CH1 down to PCB test pin)
  const probeCurve = useMemo(() => {
    // Oscilloscope CH1 position in world coordinates relative to Workbench
    // Starts at upper shelf ~ [-0.37, 1.40, -0.28], drops smoothly and ends at PCB ~ [-0.03, 0.86, -0.06]
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.37, 1.39, -0.26),
      new THREE.Vector3(-0.35, 1.15, -0.15),
      new THREE.Vector3(-0.25, 0.90, -0.05),
      new THREE.Vector3(-0.12, 0.87, -0.04),
      new THREE.Vector3(-0.06, 0.86, -0.05),
    ])
  }, [])

  // 2. Power Supply Red (+) Test Lead
  const powerRedCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.02, 1.38, -0.24),
      new THREE.Vector3(0.06, 1.10, -0.12),
      new THREE.Vector3(0.12, 0.88, 0.02),
      new THREE.Vector3(0.14, 0.86, 0.08),
    ])
  }, [])

  // 3. Power Supply Black (-) Test Lead
  const powerBlackCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.14, 1.38, -0.24),
      new THREE.Vector3(0.18, 1.10, -0.12),
      new THREE.Vector3(0.18, 0.88, 0.02),
      new THREE.Vector3(0.16, 0.86, 0.08),
    ])
  }, [])

  return (
    <group position={position} rotation={rotation}>
      {/* 1. Oscilloscope Grey Probe Cable */}
      <mesh castShadow>
        <tubeGeometry args={[probeCurve, 32, 0.003, 6, false]} />
        <meshStandardMaterial color="#475569" roughness={0.6} flatShading />
      </mesh>

      {/* Probe Handle & Needle Tip at PCB end */}
      <group position={[-0.06, 0.86, -0.05]} rotation={[0, 0.4, 0.2]}>
        <mesh position={[0, 0.015, 0]} castShadow>
          <cylinderGeometry args={[0.005, 0.006, 0.045, 6]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} flatShading />
        </mesh>
        {/* Needle Tip */}
        <mesh position={[0, -0.012, 0]}>
          <coneGeometry args={[0.0015, 0.016, 6]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} flatShading />
        </mesh>
        {/* Ground Alligator Clip Lead */}
        <mesh position={[0.008, 0.01, 0]} rotation={[0.4, 0, 0.5]}>
          <cylinderGeometry args={[0.0012, 0.0012, 0.03, 4]} />
          <meshStandardMaterial color="#0f172a" flatShading />
        </mesh>
      </group>

      {/* 2. Red (+) Power Cable */}
      <mesh castShadow>
        <tubeGeometry args={[powerRedCurve, 24, 0.0028, 6, false]} />
        <meshStandardMaterial color="#dc2626" roughness={0.5} flatShading />
      </mesh>

      {/* 3. Black (-) Power Cable */}
      <mesh castShadow>
        <tubeGeometry args={[powerBlackCurve, 24, 0.0028, 6, false]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} flatShading />
      </mesh>

      {/* 4. Coiled ESD Wrist Strap on Mat (Yellow/Black Antistatic Band) */}
      <group position={[-0.60, 0.85, 0.22]} rotation={[0, 0.3, 0]}>
        {/* Elastic Fabric Band */}
        <mesh castShadow>
          <torusGeometry args={[0.032, 0.008, 6, 12]} />
          <meshStandardMaterial color="#0284c7" roughness={0.75} flatShading />
        </mesh>
        {/* Snap Button on Band */}
        <mesh position={[0, 0.01, 0.032]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.006, 0.006, 0.004, 6]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} flatShading />
        </mesh>
        {/* Coiled Yellow Grounding Cord */}
        {Array.from({ length: 6 }).map((_, i) => (
          <mesh key={i} position={[-0.04 - i * 0.012, 0.003, 0.032 + Math.sin(i) * 0.008]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.007, 0.0015, 4, 8]} />
            <meshStandardMaterial color="#eab308" roughness={0.5} flatShading />
          </mesh>
        ))}
      </group>
    </group>
  )
}

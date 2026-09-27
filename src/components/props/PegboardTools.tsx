import React, { useState, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface PegboardToolsProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
}

export const PegboardTools: React.FC<PegboardToolsProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}) => {
  const [hovered, setHovered] = useState(false)

  // Interactive animation triggers
  const [activeSdIdx, setActiveSdIdx] = useState<number | null>(null)
  const [wrenchSwing, setWrenchSwing] = useState(false)
  const [pliersSwinging, setPliersSwinging] = useState<number | null>(null)
  const [measuringSwing, setMeasuringSwing] = useState(false)
  const [heavyToolSwing, setHeavyToolSwing] = useState(false)
  const [spoolSpinVel, setSpoolSpinVel] = useState(0)

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [hovered])

  // Physics springs
  // 10 screwdrivers (5 heavy workshop + 5 precision)
  const sdOffsets = useRef<number[]>(new Array(10).fill(0))
  const sdVels = useRef<number[]>(new Array(10).fill(0))

  // Wrenches pendulum
  const wrenchAngle = useRef(0)
  const wrenchVel = useRef(0)

  // Pliers & Estenalles swing / snip
  const pliersAngles = useRef<number[]>([0, 0, 0, 0])
  const pliersVels = useRef<number[]>([0, 0, 0, 0])
  const pincerSnip = useRef(0)

  // Measuring tools
  const measureAngle = useRef(0)
  const measureVel = useRef(0)

  // Heavy tools (hammer & saw)
  const heavyAngle = useRef(0)
  const heavyVel = useRef(0)

  // Wire spools
  const spoolAngles = useRef([0, 0, 0, 0])
  const currentSpoolVel = useRef(0)

  useFrame((_, delta) => {
    // 1. Screwdrivers vertical spring bounce
    for (let i = 0; i < 10; i++) {
      const target = activeSdIdx === i ? 0.045 : 0
      const force = (target - sdOffsets.current[i]) * 50 - sdVels.current[i] * 10
      sdVels.current[i] += force * delta
      sdOffsets.current[i] += sdVels.current[i] * delta
      if (activeSdIdx === i && sdOffsets.current[i] > 0.04) {
        setActiveSdIdx(null)
      }
    }

    // 2. Wrenches pendulum spring
    const wTarget = wrenchSwing ? 0.28 : 0
    const wForce = (wTarget - wrenchAngle.current) * 26 - wrenchVel.current * 4.5
    wrenchVel.current += wForce * delta
    wrenchAngle.current += wrenchVel.current * delta
    if (wrenchSwing && Math.abs(wrenchAngle.current) > 0.2) {
      setWrenchSwing(false)
    }

    // 3. Pliers & Estenalles swing
    for (let i = 0; i < 4; i++) {
      const pTarget = pliersSwinging === i ? 0.22 : 0
      const pForce = (pTarget - pliersAngles.current[i]) * 28 - pliersVels.current[i] * 5
      pliersVels.current[i] += pForce * delta
      pliersAngles.current[i] += pliersVels.current[i] * delta
      if (pliersSwinging === i && Math.abs(pliersAngles.current[i]) > 0.16) {
        setPliersSwinging(null)
      }
    }

    // Estenalles snip opening animation
    const targetSnip = pliersSwinging === 1 ? 0.15 : 0
    pincerSnip.current = THREE.MathUtils.lerp(pincerSnip.current, targetSnip, 0.2)

    // 4. Measuring tools spring
    const mTarget = measuringSwing ? 0.25 : 0
    const mForce = (mTarget - measureAngle.current) * 24 - measureVel.current * 4
    measureVel.current += mForce * delta
    measureAngle.current += measureVel.current * delta
    if (measuringSwing && Math.abs(measureAngle.current) > 0.18) {
      setMeasuringSwing(false)
    }

    // 5. Heavy tools spring
    const hTarget = heavyToolSwing ? 0.22 : 0
    const hForce = (hTarget - heavyAngle.current) * 22 - heavyVel.current * 4
    heavyVel.current += hForce * delta
    heavyAngle.current += heavyVel.current * delta
    if (heavyToolSwing && Math.abs(heavyAngle.current) > 0.16) {
      setHeavyToolSwing(false)
    }

    // 6. Spool spin
    currentSpoolVel.current = THREE.MathUtils.lerp(currentSpoolVel.current, spoolSpinVel, 0.1)
    for (let i = 0; i < 4; i++) {
      spoolAngles.current[i] += currentSpoolVel.current * delta * (1 + i * 0.25)
    }
    if (spoolSpinVel > 0.01) {
      setSpoolSpinVel((prev) => prev * 0.95)
    }
  })

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* ========================================================================= */}
      {/* STATION 1: HEAVY WORKSHOP SCREWDRIVERS (x = -0.78)                        */}
      {/* ========================================================================= */}
      <group position={[-0.78, 0.04, 0.02]}>
        <mesh castShadow>
          <boxGeometry args={[0.22, 0.012, 0.04]} />
          <meshStandardMaterial color="#2a3442" metalness={0.7} roughness={0.35} flatShading />
        </mesh>
        <mesh position={[-0.095, 0.002, 0]} castShadow>
          <cylinderGeometry args={[0.004, 0.004, 0.018, 6]} />
          <meshStandardMaterial color="#c29b53" metalness={0.8} roughness={0.3} flatShading />
        </mesh>
        <mesh position={[0.095, 0.002, 0]} castShadow>
          <cylinderGeometry args={[0.004, 0.004, 0.018, 6]} />
          <meshStandardMaterial color="#c29b53" metalness={0.8} roughness={0.3} flatShading />
        </mesh>

        {/* 5 Workshop Heavy Duty Screwdrivers */}
        {[-0.08, -0.04, 0, 0.04, 0.08].map((sx, idx) => {
          const handleColors = ['#9a3412', '#2d4458', '#2d5a3f', '#b45309', '#9a3412']
          const shaftLengths = [0.12, 0.14, 0.16, 0.13, 0.11]
          const sLen = shaftLengths[idx]
          return (
            <group
              key={`sd-heavy-${idx}`}
              position={[sx, -0.04 + sdOffsets.current[idx], 0.01]}
              onClick={(e) => {
                e.stopPropagation()
                sdVels.current[idx] = 1.1
                setActiveSdIdx(idx)
              }}
              onPointerOver={(e) => {
                e.stopPropagation()
                setHovered(true)
              }}
              onPointerOut={() => setHovered(false)}
            >
              <mesh position={[0, -sLen / 2, 0]} castShadow>
                <cylinderGeometry args={[0.0035, 0.0035, sLen, 6]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.2} flatShading />
              </mesh>
              {/* Flathead / Phillips Tip */}
              <mesh position={[0, -sLen - 0.005, 0]} castShadow>
                <boxGeometry args={[0.005, 0.01, 0.002]} />
                <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} flatShading />
              </mesh>
              {/* Hex Bolster */}
              <mesh position={[0, 0.006, 0]} castShadow>
                <cylinderGeometry args={[0.006, 0.006, 0.01, 6]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.25} flatShading />
              </mesh>
              {/* Handle */}
              <mesh position={[0, 0.042, 0]} castShadow>
                <cylinderGeometry args={[0.011, 0.009, 0.065, 8]} />
                <meshStandardMaterial color={handleColors[idx]} roughness={0.55} flatShading />
              </mesh>
              {/* Endcap */}
              <mesh position={[0, 0.078, 0]} castShadow>
                <cylinderGeometry args={[0.009, 0.009, 0.008, 6]} />
                <meshStandardMaterial color="#1a222c" metalness={0.6} roughness={0.4} flatShading />
              </mesh>
            </group>
          )
        })}
      </group>

      {/* ========================================================================= */}
      {/* STATION 2: PRECISION ELECTRONICS SCREWDRIVERS (x = -0.52)                 */}
      {/* ========================================================================= */}
      <group position={[-0.52, 0.04, 0.02]}>
        <mesh castShadow>
          <boxGeometry args={[0.20, 0.01, 0.035]} />
          <meshStandardMaterial color="#2a3442" metalness={0.7} roughness={0.35} flatShading />
        </mesh>
        <mesh position={[-0.085, 0.002, 0]} castShadow>
          <cylinderGeometry args={[0.0035, 0.0035, 0.016, 6]} />
          <meshStandardMaterial color="#c29b53" metalness={0.8} roughness={0.3} flatShading />
        </mesh>
        <mesh position={[0.085, 0.002, 0]} castShadow>
          <cylinderGeometry args={[0.0035, 0.0035, 0.016, 6]} />
          <meshStandardMaterial color="#c29b53" metalness={0.8} roughness={0.3} flatShading />
        </mesh>

        {/* 5 Precision Micro Screwdrivers */}
        {[-0.07, -0.035, 0, 0.035, 0.07].map((sx, idx) => {
          const globalIdx = 5 + idx
          const capColors = ['#9a3412', '#2d4458', '#2d5a3f', '#b45309', '#5b3a6d']
          return (
            <group
              key={`sd-prec-${idx}`}
              position={[sx, -0.035 + sdOffsets.current[globalIdx], 0.01]}
              onClick={(e) => {
                e.stopPropagation()
                sdVels.current[globalIdx] = 1.1
                setActiveSdIdx(globalIdx)
              }}
              onPointerOver={(e) => {
                e.stopPropagation()
                setHovered(true)
              }}
              onPointerOut={() => setHovered(false)}
            >
              <mesh position={[0, -0.03, 0]} castShadow>
                <cylinderGeometry args={[0.0025, 0.0025, 0.09, 4]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.2} flatShading />
              </mesh>
              {/* Knurled Aluminum Body */}
              <mesh position={[0, 0.03, 0]} castShadow>
                <cylinderGeometry args={[0.0065, 0.0065, 0.045, 6]} />
                <meshStandardMaterial color="#1e2430" roughness={0.65} metalness={0.5} flatShading />
              </mesh>
              {/* Rotating Swivel Crown */}
              <mesh position={[0, 0.058, 0]} castShadow>
                <cylinderGeometry args={[0.007, 0.007, 0.009, 6]} />
                <meshStandardMaterial color={capColors[idx]} roughness={0.4} flatShading />
              </mesh>
            </group>
          )
        })}
      </group>

      {/* ========================================================================= */}
      {/* STATION 3: COMBINATION SPANNERS & WRENCHES (x = -0.26)                    */}
      {/* ========================================================================= */}
      <group
        position={[-0.26, 0.03, 0.02]}
        onClick={(e) => {
          e.stopPropagation()
          wrenchVel.current = 1.8
          setWrenchSwing(true)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
        }}
        onPointerOut={() => setHovered(false)}
      >
        <mesh position={[0, 0.08, 0]} castShadow>
          <boxGeometry args={[0.24, 0.012, 0.025]} />
          <meshStandardMaterial color="#334155" metalness={0.65} roughness={0.4} flatShading />
        </mesh>

        {/* 6 Graduated Combination Spanners */}
        {[-0.09, -0.055, -0.02, 0.015, 0.05, 0.085].map((wx, idx) => {
          const wLen = 0.075 + idx * 0.016
          const wWidth = 0.010 + idx * 0.0018
          const swing = wrenchAngle.current * (1 + idx * 0.15)
          return (
            <group key={`wren-${idx}`} position={[wx, 0.08, 0.012]} rotation={[0, 0, swing]}>
              <mesh position={[0, 0, -0.005]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.0025, 0.0025, 0.018, 6]} />
                <meshStandardMaterial color="#c29b53" metalness={0.85} roughness={0.25} flatShading />
              </mesh>
              {/* Shaft */}
              <mesh position={[0, -wLen / 2, 0.004]} castShadow>
                <boxGeometry args={[wWidth, wLen, 0.004]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.25} flatShading />
              </mesh>
              {/* Open Spanner Jaw Top */}
              <mesh position={[0, -0.004, 0.004]} castShadow>
                <boxGeometry args={[wWidth * 1.6, 0.01, 0.004]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.25} flatShading />
              </mesh>
              {/* 12-point Box End Bottom */}
              <mesh position={[0, -wLen, 0.004]} castShadow>
                <cylinderGeometry args={[wWidth * 0.85, wWidth * 0.85, 0.004, 6]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.25} flatShading />
              </mesh>
            </group>
          )
        })}
      </group>

      {/* ========================================================================= */}
      {/* STATION 4: ADJUSTABLE WRENCH & ESTENALLES (x = -0.02)                     */}
      {/* ========================================================================= */}
      <group position={[-0.02, 0.02, 0.02]}>
        {/* Tool 1: Crescent Adjustable Wrench */}
        <group
          position={[-0.06, 0.03, 0]}
          rotation={[0, 0, pliersAngles.current[0]]}
          onClick={(e) => {
            e.stopPropagation()
            pliersVels.current[0] = 1.6
            setPliersSwinging(0)
          }}
          onPointerOver={(e) => {
            e.stopPropagation()
            setHovered(true)
          }}
          onPointerOut={() => setHovered(false)}
        >
          <mesh position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.003, 0.003, 0.02, 6]} />
            <meshStandardMaterial color="#c29b53" metalness={0.85} flatShading />
          </mesh>
          <mesh position={[0, -0.02, 0.006]} castShadow>
            <boxGeometry args={[0.014, 0.12, 0.006]} />
            <meshStandardMaterial color="#2d4458" roughness={0.6} flatShading />
          </mesh>
          <mesh position={[0, 0.05, 0.006]} castShadow>
            <boxGeometry args={[0.032, 0.024, 0.007]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.25} flatShading />
          </mesh>
          {/* Brass Adjustment Worm Gear */}
          <mesh position={[0, 0.044, 0.006]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.005, 0.005, 0.012, 6]} />
            <meshStandardMaterial color="#b5935b" metalness={0.85} roughness={0.3} flatShading />
          </mesh>
        </group>

        {/* Tool 2: Estenalles de tall (Carpenter Pincers with clearly visible dual cutting jaws) */}
        <group
          position={[0.06, 0.03, 0]}
          rotation={[0, 0, pliersAngles.current[1]]}
          onClick={(e) => {
            e.stopPropagation()
            pliersVels.current[1] = 1.6
            setPliersSwinging(1)
          }}
          onPointerOver={(e) => {
            e.stopPropagation()
            setHovered(true)
          }}
          onPointerOut={() => setHovered(false)}
        >
          {/* Brass Hanging Hook */}
          <mesh position={[0, 0.07, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.003, 0.003, 0.02, 6]} />
            <meshStandardMaterial color="#c29b53" metalness={0.85} flatShading />
          </mesh>

          {/* Central Pivot Pin */}
          <mesh position={[0, 0.028, 0.008]} castShadow>
            <cylinderGeometry args={[0.006, 0.006, 0.014, 6]} />
            <meshStandardMaterial color="#c29b53" metalness={0.85} flatShading />
          </mesh>

          {/* Left Half: Curved Jaw with Sharp Cutting Tip + Left Handle */}
          <group position={[0, 0.028, 0.005]} rotation={[0, 0, pincerSnip.current]}>
            {/* Left Curved Jaw */}
            <mesh position={[-0.01, 0.022, 0]} rotation={[0, 0, 0.4]} castShadow>
              <boxGeometry args={[0.007, 0.032, 0.006]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.25} flatShading />
            </mesh>
            {/* Left Sharp Cutting Edge (Punta de tall esquerra) */}
            <mesh position={[-0.003, 0.036, 0]} rotation={[0, 0, 0]} castShadow>
              <boxGeometry args={[0.012, 0.006, 0.007]} />
              <meshStandardMaterial color="#f1f5f9" metalness={0.95} roughness={0.15} flatShading />
            </mesh>
            {/* Left Forged Handle */}
            <mesh position={[-0.015, -0.05, 0]} rotation={[0, 0, -0.12]} castShadow>
              <cylinderGeometry args={[0.005, 0.007, 0.10, 6]} />
              <meshStandardMaterial color="#1e2430" roughness={0.7} flatShading />
            </mesh>
            {/* Left Grip Flare End */}
            <mesh position={[-0.022, -0.10, 0]} castShadow>
              <sphereGeometry args={[0.006, 6, 6]} />
              <meshStandardMaterial color="#1e2430" roughness={0.7} flatShading />
            </mesh>
          </group>

          {/* Right Half: Curved Jaw with Sharp Cutting Tip + Right Handle */}
          <group position={[0, 0.028, 0.005]} rotation={[0, 0, -pincerSnip.current]}>
            {/* Right Curved Jaw */}
            <mesh position={[0.01, 0.022, 0]} rotation={[0, 0, -0.4]} castShadow>
              <boxGeometry args={[0.007, 0.032, 0.006]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.25} flatShading />
            </mesh>
            {/* Right Sharp Cutting Edge (Punta de tall dreta) */}
            <mesh position={[0.003, 0.036, 0]} rotation={[0, 0, 0]} castShadow>
              <boxGeometry args={[0.012, 0.006, 0.007]} />
              <meshStandardMaterial color="#f1f5f9" metalness={0.95} roughness={0.15} flatShading />
            </mesh>
            {/* Right Forged Handle */}
            <mesh position={[0.015, -0.05, 0]} rotation={[0, 0, 0.12]} castShadow>
              <cylinderGeometry args={[0.005, 0.007, 0.10, 6]} />
              <meshStandardMaterial color="#1e2430" roughness={0.7} flatShading />
            </mesh>
            {/* Right Grip Flare End */}
            <mesh position={[0.022, -0.10, 0]} castShadow>
              <sphereGeometry args={[0.006, 6, 6]} />
              <meshStandardMaterial color="#1e2430" roughness={0.7} flatShading />
            </mesh>
          </group>
        </group>
      </group>

      {/* ========================================================================= */}
      {/* STATION 5: PRECISION PLIERS & WIRE STRIPPERS (x = +0.22)                  */}
      {/* ========================================================================= */}
      <group position={[0.22, 0.02, 0.02]}>
        {/* Diagonal Flush Cutters */}
        <group
          position={[-0.055, 0.03, 0]}
          rotation={[0, 0, pliersAngles.current[2]]}
          onClick={(e) => {
            e.stopPropagation()
            pliersVels.current[2] = 1.6
            setPliersSwinging(2)
          }}
          onPointerOver={(e) => {
            e.stopPropagation()
            setHovered(true)
          }}
          onPointerOut={() => setHovered(false)}
        >
          <mesh position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.003, 0.003, 0.02, 6]} />
            <meshStandardMaterial color="#c29b53" metalness={0.85} flatShading />
          </mesh>
          {/* Angled Cutting Jaws */}
          <mesh position={[-0.006, 0.035, 0.008]} rotation={[0, 0, 0.2]} castShadow>
            <boxGeometry args={[0.008, 0.022, 0.006]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} flatShading />
          </mesh>
          <mesh position={[0.006, 0.035, 0.008]} rotation={[0, 0, -0.2]} castShadow>
            <boxGeometry args={[0.008, 0.022, 0.006]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} flatShading />
          </mesh>
          {/* Terracotta Handles */}
          <mesh position={[-0.014, -0.025, 0.008]} rotation={[0, 0, -0.14]} castShadow>
            <cylinderGeometry args={[0.006, 0.008, 0.09, 6]} />
            <meshStandardMaterial color="#9a3412" roughness={0.6} flatShading />
          </mesh>
          <mesh position={[0.014, -0.025, 0.008]} rotation={[0, 0, 0.14]} castShadow>
            <cylinderGeometry args={[0.006, 0.008, 0.09, 6]} />
            <meshStandardMaterial color="#9a3412" roughness={0.6} flatShading />
          </mesh>
        </group>

        {/* Needle-Nose Pliers */}
        <group
          position={[0.055, 0.03, 0]}
          rotation={[0, 0, pliersAngles.current[3]]}
          onClick={(e) => {
            e.stopPropagation()
            pliersVels.current[3] = 1.6
            setPliersSwinging(3)
          }}
          onPointerOver={(e) => {
            e.stopPropagation()
            setHovered(true)
          }}
          onPointerOut={() => setHovered(false)}
        >
          <mesh position={[0, 0.07, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.003, 0.003, 0.02, 6]} />
            <meshStandardMaterial color="#c29b53" metalness={0.85} flatShading />
          </mesh>
          {/* Dual Long Tapered Jaws */}
          <mesh position={[-0.004, 0.055, 0.008]} castShadow>
            <boxGeometry args={[0.005, 0.045, 0.006]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.25} flatShading />
          </mesh>
          <mesh position={[0.004, 0.055, 0.008]} castShadow>
            <boxGeometry args={[0.005, 0.045, 0.006]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.25} flatShading />
          </mesh>
          {/* Forest Moss Handles */}
          <mesh position={[-0.015, -0.025, 0.008]} rotation={[0, 0, -0.14]} castShadow>
            <cylinderGeometry args={[0.006, 0.008, 0.095, 6]} />
            <meshStandardMaterial color="#2d5a3f" roughness={0.6} flatShading />
          </mesh>
          <mesh position={[0.015, -0.025, 0.008]} rotation={[0, 0, 0.14]} castShadow>
            <cylinderGeometry args={[0.006, 0.008, 0.095, 6]} />
            <meshStandardMaterial color="#2d5a3f" roughness={0.6} flatShading />
          </mesh>
        </group>
      </group>

      {/* ========================================================================= */}
      {/* STATION 6: METROLOGY & PRECISION MEASUREMENT (x = +0.48)                   */}
      {/* ========================================================================= */}
      <group
        position={[0.48, 0.02, 0.02]}
        onClick={(e) => {
          e.stopPropagation()
          measureVel.current = 1.8
          setMeasuringSwing(true)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
        }}
        onPointerOut={() => setHovered(false)}
      >
        {/* Try Square (Escaire d'acer) */}
        <group position={[-0.09, 0.03, 0]} rotation={[0, 0, measureAngle.current * 0.8]}>
          <mesh position={[0, 0.04, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.003, 0.003, 0.02, 6]} />
            <meshStandardMaterial color="#c29b53" metalness={0.85} flatShading />
          </mesh>
          <mesh position={[0, -0.03, 0.006]} castShadow>
            <boxGeometry args={[0.014, 0.14, 0.003]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} flatShading />
          </mesh>
          <mesh position={[0.035, 0.032, 0.006]} castShadow>
            <boxGeometry args={[0.08, 0.016, 0.007]} />
            <meshStandardMaterial color="#1e2430" metalness={0.7} roughness={0.4} flatShading />
          </mesh>
        </group>

        {/* Vernier Caliper (Peu de rei) */}
        <group position={[0.02, 0.03, 0]} rotation={[0, 0, measureAngle.current * 1.1]}>
          <mesh position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.003, 0.003, 0.02, 6]} />
            <meshStandardMaterial color="#c29b53" metalness={0.85} flatShading />
          </mesh>
          <mesh position={[0, -0.035, 0.006]} castShadow>
            <boxGeometry args={[0.012, 0.16, 0.004]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} flatShading />
          </mesh>
          <mesh position={[0.016, 0.038, 0.006]} castShadow>
            <boxGeometry args={[0.04, 0.014, 0.004]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} flatShading />
          </mesh>
          <mesh position={[0, -0.01, 0.008]} castShadow>
            <boxGeometry args={[0.024, 0.03, 0.008]} />
            <meshStandardMaterial color="#1e2430" roughness={0.6} flatShading />
          </mesh>
          <mesh position={[0, -0.01, 0.013]}>
            <planeGeometry args={[0.018, 0.012]} />
            <meshBasicMaterial color="#a7f3d0" />
          </mesh>
        </group>

        {/* Torpedo Level (Nivell) */}
        <group position={[0.10, 0.01, 0]} rotation={[0, 0, measureAngle.current * 0.9]}>
          <mesh position={[0, 0.06, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.003, 0.003, 0.02, 6]} />
            <meshStandardMaterial color="#c29b53" metalness={0.85} flatShading />
          </mesh>
          <mesh position={[0, -0.015, 0.008]} castShadow>
            <boxGeometry args={[0.018, 0.15, 0.012]} />
            <meshStandardMaterial color="#b45309" metalness={0.7} roughness={0.35} flatShading />
          </mesh>
          <mesh position={[0, 0.02, 0.008]} castShadow>
            <cylinderGeometry args={[0.005, 0.005, 0.018, 6]} />
            <meshStandardMaterial color="#22c55e" roughness={0.2} emissive="#16a34a" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[0, -0.05, 0.008]} castShadow>
            <cylinderGeometry args={[0.005, 0.005, 0.018, 6]} />
            <meshStandardMaterial color="#22c55e" roughness={0.2} emissive="#16a34a" emissiveIntensity={0.5} />
          </mesh>
        </group>
      </group>

      {/* ========================================================================= */}
      {/* STATION 7: HAMMER, METAL SAW & WIRE DISPENSER (x = +0.76)                  */}
      {/* ========================================================================= */}
      <group position={[0.76, 0, 0.02]}>
        {/* Heavy Machinist Hammer */}
        <group
          position={[-0.09, 0.04, 0]}
          rotation={[0, 0, heavyAngle.current]}
          onClick={(e) => {
            e.stopPropagation()
            heavyVel.current = 1.6
            setHeavyToolSwing(true)
          }}
          onPointerOver={(e) => {
            e.stopPropagation()
            setHovered(true)
          }}
          onPointerOut={() => setHovered(false)}
        >
          <mesh position={[0, 0.03, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.004, 0.004, 0.025, 6]} />
            <meshStandardMaterial color="#c29b53" metalness={0.85} flatShading />
          </mesh>
          <mesh position={[0, 0.015, 0.01]} castShadow>
            <boxGeometry args={[0.065, 0.024, 0.024]} />
            <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.3} flatShading />
          </mesh>
          <mesh position={[0, -0.075, 0.01]} castShadow>
            <cylinderGeometry args={[0.007, 0.009, 0.16, 6]} />
            <meshStandardMaterial color="#9c774f" roughness={0.65} flatShading />
          </mesh>
        </group>

        {/* 4 Colored Wire Spools on Brass Spindle */}
        <group
          position={[0.06, 0.02, 0]}
          onClick={(e) => {
            e.stopPropagation()
            setSpoolSpinVel(9.0)
          }}
          onPointerOver={(e) => {
            e.stopPropagation()
            setHovered(true)
          }}
          onPointerOut={() => setHovered(false)}
        >
          <mesh position={[-0.085, 0, 0.015]} castShadow>
            <boxGeometry args={[0.014, 0.05, 0.04]} />
            <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} flatShading />
          </mesh>
          <mesh position={[0.085, 0, 0.015]} castShadow>
            <boxGeometry args={[0.014, 0.05, 0.04]} />
            <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} flatShading />
          </mesh>
          <mesh position={[0, 0, 0.02]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.0035, 0.0035, 0.18, 6]} />
            <meshStandardMaterial color="#c29b53" metalness={0.85} roughness={0.25} flatShading />
          </mesh>

          {[-0.05, -0.017, 0.017, 0.05].map((sx, idx) => {
            const wireColors = ['#1a222c', '#9a3412', '#2d5a3f', '#d97706']
            return (
              <group
                key={`spool-st-${idx}`}
                position={[sx, 0, 0.02]}
                rotation={[spoolAngles.current[idx], 0, Math.PI / 2]}
              >
                <mesh position={[0, 0.012, 0]} castShadow>
                  <cylinderGeometry args={[0.024, 0.024, 0.002, 6]} />
                  <meshStandardMaterial color="#d8d2c4" roughness={0.5} flatShading />
                </mesh>
                <mesh position={[0, -0.012, 0]} castShadow>
                  <cylinderGeometry args={[0.024, 0.024, 0.002, 6]} />
                  <meshStandardMaterial color="#d8d2c4" roughness={0.5} flatShading />
                </mesh>
                <mesh castShadow>
                  <cylinderGeometry args={[0.019, 0.019, 0.022, 8]} />
                  <meshStandardMaterial color={wireColors[idx]} roughness={0.6} flatShading />
                </mesh>
              </group>
            )
          })}
        </group>
      </group>
    </group>
  )
}

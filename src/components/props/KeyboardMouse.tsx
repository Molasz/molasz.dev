import React, { useState, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { soundFx } from '../../utils/sound'

interface KeyboardMouseProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  soundEnabled?: boolean
}

const KB_H = 0.018
const KB_W = 0.32
const KB_D = 0.13

export const KeyboardMouse: React.FC<KeyboardMouseProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  soundEnabled = true,
}) => {
  const [clickCount, setClickCount] = useState(0)
  const [mouseClicked, setMouseClicked] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [hovered])

  // Mouse physical motion refs
  const mouseGroupRef = useRef<THREE.Group>(null)
  const leftButtonRef = useRef<THREE.Mesh>(null)
  const mouseTargetX = useRef(0.20)
  const mouseTargetZ = useRef(0.01)
  const mouseTargetRot = useRef(0)
  const currentMouseX = useRef(0.20)
  const currentMouseZ = useRef(0.01)
  const currentMouseRot = useRef(0)
  const buttonPress = useRef(0)
  const mouseMoveTimer = useRef(0)

  // Keyboard typing animation refs
  const kbChassisRef = useRef<THREE.Group>(null)
  const typingTimer = useRef(0)
  const timeRef = useRef(0)

  useFrame((_, delta) => {
    timeRef.current += delta

    // 1. Mouse motion animation (Glide on click and return)
    if (mouseMoveTimer.current > 0) {
      mouseMoveTimer.current -= delta
      mouseTargetX.current = 0.22 + Math.sin(timeRef.current * 8) * 0.015
      mouseTargetZ.current = -0.01 + Math.cos(timeRef.current * 8) * 0.01
      mouseTargetRot.current = -0.08
    } else {
      mouseTargetX.current = 0.20
      mouseTargetZ.current = 0.01
      mouseTargetRot.current = 0
    }

    currentMouseX.current = THREE.MathUtils.lerp(currentMouseX.current, mouseTargetX.current, 0.12)
    currentMouseZ.current = THREE.MathUtils.lerp(currentMouseZ.current, mouseTargetZ.current, 0.12)
    currentMouseRot.current = THREE.MathUtils.lerp(currentMouseRot.current, mouseTargetRot.current, 0.12)

    if (mouseGroupRef.current) {
      mouseGroupRef.current.position.x = currentMouseX.current
      mouseGroupRef.current.position.z = currentMouseZ.current
      mouseGroupRef.current.rotation.y = currentMouseRot.current
    }

    // Left button tactile press
    const targetPress = mouseClicked ? 0.003 : 0
    buttonPress.current = THREE.MathUtils.lerp(buttonPress.current, targetPress, 0.3)
    if (leftButtonRef.current) {
      leftButtonRef.current.position.y = 0.022 - buttonPress.current
    }
    if (mouseClicked) setMouseClicked(false)

    // 2. Keyboard typing tactile micro-vibration
    if (typingTimer.current > 0) {
      typingTimer.current -= delta
      if (kbChassisRef.current) {
        kbChassisRef.current.position.y = (KB_H / 2) + Math.sin(timeRef.current * 45) * 0.0008
      }
    } else if (kbChassisRef.current) {
      kbChassisRef.current.position.y = KB_H / 2
    }
  })

  const rows = [
    { count: 14, z: -0.045, height: 0.007, y: KB_H },
    { count: 14, z: -0.026, height: 0.006, y: KB_H - 0.001 },
    { count: 13, z: -0.007, height: 0.0055, y: KB_H - 0.002 },
    { count: 12, z: 0.012, height: 0.005, y: KB_H - 0.003 },
  ]

  const handleKeyboardClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    setClickCount((prev) => prev + 1)
    typingTimer.current = 0.8
    soundFx.keyboardKey(soundEnabled)
  }

  const handleMouseClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    setMouseClicked(true)
    setClickCount((prev) => prev + 1)
    mouseMoveTimer.current = 0.6
    soundFx.click(soundEnabled)
  }

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* 1. CUSTOM MECHANICAL KEYBOARD */}
      <group
        position={[-0.10, 0, 0]}
        onClick={handleKeyboardClick}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
        }}
        onPointerOut={() => setHovered(false)}
      >
        <group ref={kbChassisRef} position={[0, KB_H / 2, 0]} rotation={[0.08, 0, 0]}>
          {/* Forged Slate Aluminum Case */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[KB_W, KB_H, KB_D]} />
            <meshStandardMaterial
              color={hovered ? '#26303c' : '#1d2530'}
              metalness={0.65}
              roughness={0.4}
              flatShading
            />
          </mesh>

          {/* Brass Switch Plate */}
          <mesh position={[0, KB_H / 2 + 0.0006, 0]}>
            <boxGeometry args={[KB_W * 0.94, 0.001, KB_D * 0.88]} />
            <meshStandardMaterial color="#b5935b" metalness={0.75} roughness={0.3} flatShading />
          </mesh>

          {/* Mini OLED Screen */}
          <group position={[KB_W / 2 - 0.042, KB_H / 2 + 0.004, -KB_D / 2 + 0.018]}>
            <mesh castShadow>
              <boxGeometry args={[0.038, 0.004, 0.014]} />
              <meshStandardMaterial color="#0c1015" roughness={0.8} flatShading />
            </mesh>
            <mesh position={[0, 0.0022, 0]}>
              <planeGeometry args={[0.034, 0.01]} />
              <meshBasicMaterial color={clickCount % 2 === 0 ? '#38bdf8' : '#34d399'} />
            </mesh>
          </group>

          {/* Rotary Volume Encoder Knob */}
          <mesh
            position={[KB_W / 2 - 0.016, KB_H / 2 + 0.008, -KB_D / 2 + 0.018]}
            rotation={[0, clickCount * 0.25, 0]}
            castShadow
          >
            <cylinderGeometry args={[0.009, 0.009, 0.014, 6]} />
            <meshStandardMaterial color="#9a3412" metalness={0.7} roughness={0.3} flatShading />
          </mesh>

          {/* Stepped Keycaps Array */}
          <group>
            {rows.map((row, rIdx) => {
              const rowWidth = KB_W * 0.88
              const step = rowWidth / row.count
              return (
                <group key={rIdx} position={[0, row.y, row.z]}>
                  {Array.from({ length: row.count }).map((_, kIdx) => {
                    const kx = -rowWidth / 2 + step * kIdx + step / 2

                    let keyColor = '#2f3844'
                    if (rIdx === 0 && kIdx === 0) keyColor = '#9a3412'
                    if (rIdx === 0 && kIdx === row.count - 1) keyColor = '#384250'
                    if (rIdx === 1 && (kIdx === 2 || kIdx === 3 || kIdx === 4)) keyColor = '#2d5a3f'
                    if (rIdx === 2 && (kIdx === 1 || kIdx === 2 || kIdx === 3)) keyColor = '#2d5a3f'
                    if (rIdx === 2 && kIdx === row.count - 1) keyColor = '#b45309'

                    return (
                      <mesh key={kIdx} position={[kx, 0, 0]} castShadow>
                        <boxGeometry args={[step * 0.88, row.height, 0.016]} />
                        <meshStandardMaterial
                          color={keyColor}
                          roughness={0.5}
                          metalness={0.1}
                          flatShading
                        />
                      </mesh>
                    )
                  })}
                </group>
              )
            })}
          </group>

          {/* Row 5: Spacebar & Modifiers */}
          <group position={[0, KB_H - 0.004, 0.032]}>
            {[-0.125, -0.1, -0.075].map((mx, idx) => (
              <mesh key={`bmod-l-${idx}`} position={[mx, 0, 0]} castShadow>
                <boxGeometry args={[0.02, 0.005, 0.017]} />
                <meshStandardMaterial color="#202833" roughness={0.5} flatShading />
              </mesh>
            ))}

            {/* Parchment Spacebar */}
            <mesh position={[-0.01, 0.001, 0]} castShadow>
              <boxGeometry args={[0.1, 0.006, 0.017]} />
              <meshStandardMaterial color="#d8d2c4" roughness={0.45} flatShading />
            </mesh>

            {[0.052, 0.074].map((mx, idx) => (
              <mesh key={`bmod-r-${idx}`} position={[mx, 0, 0]} castShadow>
                <boxGeometry args={[0.019, 0.005, 0.017]} />
                <meshStandardMaterial color="#202833" roughness={0.5} flatShading />
              </mesh>
            ))}

            {/* Arrow Keys */}
            {[0.098, 0.116, 0.134].map((kx, idx) => (
              <mesh key={`arr-${idx}`} position={[kx, 0, 0]} castShadow>
                <boxGeometry args={[0.015, 0.005, 0.017]} />
                <meshStandardMaterial color="#2d4458" roughness={0.45} flatShading />
              </mesh>
            ))}
            <mesh position={[0.116, 0.001, -0.019]} castShadow>
              <boxGeometry args={[0.015, 0.005, 0.017]} />
              <meshStandardMaterial color="#2d4458" roughness={0.45} flatShading />
            </mesh>
          </group>
        </group>
      </group>

      {/* 2. SCULPTED ERGONOMIC MOUSE */}
      <group
        ref={mouseGroupRef}
        position={[0.20, 0.001, 0.01]}
        onClick={handleMouseClick}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
        }}
        onPointerOut={() => setHovered(false)}
      >
        <mesh position={[0, 0.016, 0.01]} castShadow receiveShadow>
          <boxGeometry args={[0.062, 0.026, 0.095]} />
          <meshStandardMaterial
            color={hovered ? '#283340' : '#1d2530'}
            metalness={0.4}
            roughness={0.4}
            flatShading
          />
        </mesh>

        {/* Click Trigger Buttons */}
        <mesh ref={leftButtonRef} position={[-0.014, 0.022, -0.03]} rotation={[0.15, 0, 0]} castShadow>
          <boxGeometry args={[0.026, 0.012, 0.045]} />
          <meshStandardMaterial color="#141a22" roughness={0.5} flatShading />
        </mesh>
        <mesh position={[0.014, 0.022, -0.03]} rotation={[0.15, 0, 0]} castShadow>
          <boxGeometry args={[0.026, 0.012, 0.045]} />
          <meshStandardMaterial color="#141a22" roughness={0.5} flatShading />
        </mesh>

        {/* Scroll Wheel with Brass Core */}
        <group position={[0, 0.026, -0.028]} rotation={[clickCount * 0.4, 0, Math.PI / 2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.008, 0.008, 0.007, 6]} />
            <meshStandardMaterial color="#b5935b" metalness={0.8} roughness={0.3} flatShading />
          </mesh>
        </group>

        {/* Thumb Rest */}
        <mesh position={[-0.038, 0.007, 0.01]} rotation={[0, 0, -0.2]} castShadow>
          <boxGeometry args={[0.016, 0.01, 0.065]} />
          <meshStandardMaterial color="#141a22" roughness={0.6} flatShading />
        </mesh>

        {/* Side Thumb Buttons */}
        <mesh position={[-0.032, 0.018, -0.005]} castShadow>
          <boxGeometry args={[0.004, 0.005, 0.012]} />
          <meshStandardMaterial color="#2d4458" roughness={0.4} flatShading />
        </mesh>
        <mesh position={[-0.032, 0.018, 0.01]} castShadow>
          <boxGeometry args={[0.004, 0.005, 0.012]} />
          <meshStandardMaterial color="#2d4458" roughness={0.4} flatShading />
        </mesh>

        {/* Subtle Underglow */}
        <mesh position={[0, 0.004, 0.048]}>
          <boxGeometry args={[0.045, 0.004, 0.004]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#38bdf8"
            emissiveIntensity={hovered ? 0.7 : 0.25}
            flatShading
          />
        </mesh>
      </group>
    </group>
  )
}

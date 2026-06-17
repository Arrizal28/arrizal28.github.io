import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, TorusKnot } from '@react-three/drei'
import { Suspense, useEffect, useRef } from 'react'
import type { Mesh } from 'three'
import * as THREE from 'three'

const mouseTarget = { x: 0, y: 0 }
let pointerListenerCount = 0

/**
 * Registers a shared pointer listener for torus rotation while the canvas is active.
 */
function usePointerTracking(active: boolean) {
  useEffect(() => {
    if (!active) return

    /**
     * Maps pointer position to normalized rotation targets.
     */
    function handlePointerMove(event: PointerEvent) {
      mouseTarget.x = (event.clientX / window.innerWidth - 0.5) * 1.2
      mouseTarget.y = (event.clientY / window.innerHeight - 0.5) * 1.2
    }

    pointerListenerCount += 1
    if (pointerListenerCount === 1) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true })
    }

    return () => {
      pointerListenerCount -= 1
      if (pointerListenerCount === 0) {
        window.removeEventListener('pointermove', handlePointerMove)
        mouseTarget.x = 0
        mouseTarget.y = 0
      }
    }
  }, [active])
}

interface LiquidTorusProps {
  active: boolean
}

/**
 * Renders a glass-like torus knot that rotates slowly and follows cursor movement.
 */
function LiquidTorus({ active }: LiquidTorusProps) {
  const meshRef = useRef<Mesh>(null)
  const baseRotation = useRef({ x: 0, y: 0 })

  usePointerTracking(active)

  useFrame((_, delta) => {
    if (!active || !meshRef.current) return

    baseRotation.current.x += delta * 0.12
    baseRotation.current.y += delta * 0.16

    const targetX = baseRotation.current.x + mouseTarget.y * 0.4
    const targetY = baseRotation.current.y + mouseTarget.x * 0.4

    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      targetX,
      0.04,
    )
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      targetY,
      0.04,
    )
  })

  return (
    <TorusKnot ref={meshRef} args={[1, 0.3, 128, 24]}>
      <meshPhysicalMaterial
        transmission={1}
        roughness={0.1}
        thickness={2}
        ior={1.5}
        color="#ffffff"
      />
    </TorusKnot>
  )
}

interface SceneProps {
  active: boolean
}

/**
 * Three.js scene for the hero background with lighting and liquid torus geometry.
 */
function HeroScene({ active }: SceneProps) {
  const { invalidate } = useThree()

  useEffect(() => {
    if (active) invalidate()
  }, [active, invalidate])

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[-4, 2, 5]} intensity={1.2} color="#1a2a6c" />
      <directionalLight position={[4, -1, 3]} intensity={0.6} color="#e8702a" />
      <Suspense fallback={null}>
        <Environment preset="city" frames={1} />
      </Suspense>
      <LiquidTorus active={active} />
    </>
  )
}

interface HeroCanvasProps {
  active?: boolean
}

/**
 * Full-screen Canvas wrapper for the hero Three.js background.
 */
export function HeroCanvas({ active = true }: HeroCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      dpr={[1, 1.5]}
      frameloop={active ? 'always' : 'never'}
      style={{ pointerEvents: active ? 'auto' : 'none' }}
    >
      <HeroScene active={active} />
    </Canvas>
  )
}

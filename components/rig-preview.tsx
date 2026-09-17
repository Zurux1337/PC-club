'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export interface RigPreviewProps {
  reducedMotion?: boolean
  className?: string
}

const MONO = {
  panel: '#232327',
  panelDark: '#1a1a1d',
  interior: '#141416',
  metal: '#2b2b30',
  light: '#cfcfd4',
  mid: '#9a9aa1',
  line: '#8f8f96',
}

function CaseEdges({
  w,
  h,
  d,
  position,
}: {
  w: number
  h: number
  d: number
  position?: [number, number, number]
}) {
  const geometry = useMemo(() => {
    const box = new THREE.BoxGeometry(w, h, d)
    const edges = new THREE.EdgesGeometry(box)
    box.dispose()
    return edges
  }, [w, h, d])

  useEffect(() => () => geometry.dispose(), [geometry])

  return (
    <lineSegments geometry={geometry} position={position}>
      <lineBasicMaterial color={MONO.line} transparent opacity={0.5} />
    </lineSegments>
  )
}

function Fan({
  radius,
  position,
}: {
  radius: number
  position: [number, number, number]
}) {
  return (
    <group position={position}>
      <mesh>
        <torusGeometry args={[radius, radius * 0.12, 12, 32]} />
        <meshStandardMaterial color={MONO.light} roughness={0.5} metalness={0.2} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radius * 0.28, radius * 0.28, 0.05, 20]} />
        <meshStandardMaterial color={MONO.mid} roughness={0.45} metalness={0.35} />
      </mesh>
    </group>
  )
}

function CaseModel({ reduced }: { reduced: boolean }) {
  const rig = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (reduced) return
    const group = rig.current
    if (!group) return
    const elapsed = state.clock.getElapsedTime()
    group.rotation.y = -0.62 + Math.sin(elapsed * 0.4) * 0.26
    group.rotation.x = Math.sin(elapsed * 0.27) * 0.035
  })

  return (
    <group ref={rig} rotation={[-0.02, -0.62, 0]}>
      <mesh position={[0, -1.245, 0]}>
        <cylinderGeometry args={[1.3, 1.3, 0.06, 48]} />
        <meshStandardMaterial color={MONO.panelDark} roughness={0.9} metalness={0.15} />
      </mesh>

      <mesh position={[0, -1.18, 0.55]}>
        <boxGeometry args={[0.9, 0.07, 0.14]} />
        <meshStandardMaterial color={MONO.interior} roughness={0.8} />
      </mesh>
      <mesh position={[0, -1.18, -0.55]}>
        <boxGeometry args={[0.9, 0.07, 0.14]} />
        <meshStandardMaterial color={MONO.interior} roughness={0.8} />
      </mesh>

      <mesh position={[0, 0, 0.78]}>
        <boxGeometry args={[1.05, 2.3, 0.05]} />
        <meshStandardMaterial color="#202024" roughness={0.5} metalness={0.45} />
      </mesh>
      {[0.4, 0.08, -0.24].map((y) => (
        <mesh key={y} position={[0, y, 0.81]}>
          <boxGeometry args={[0.8, 0.045, 0.02]} />
          <meshStandardMaterial color="#3f3f45" roughness={0.6} metalness={0.3} />
        </mesh>
      ))}
      <mesh position={[0.28, 1.19, 0.6]}>
        <cylinderGeometry args={[0.035, 0.035, 0.03, 16]} />
        <meshStandardMaterial color="#d9d9de" roughness={0.35} metalness={0.6} />
      </mesh>

      <mesh position={[0, 0, -0.78]}>
        <boxGeometry args={[1.05, 2.3, 0.05]} />
        <meshStandardMaterial color={MONO.panel} roughness={0.55} metalness={0.4} />
      </mesh>
      <mesh position={[0, 1.15, 0]}>
        <boxGeometry args={[1.05, 0.05, 1.6]} />
        <meshStandardMaterial color={MONO.panel} roughness={0.55} metalness={0.4} />
      </mesh>
      <mesh position={[0, -1.15, 0]}>
        <boxGeometry args={[1.05, 0.05, 1.6]} />
        <meshStandardMaterial color={MONO.panel} roughness={0.55} metalness={0.4} />
      </mesh>
      <mesh position={[-0.5, 0, 0]}>
        <boxGeometry args={[0.05, 2.3, 1.6]} />
        <meshStandardMaterial color={MONO.panel} roughness={0.55} metalness={0.4} />
      </mesh>

      <mesh position={[0.51, 0, 0]}>
        <boxGeometry args={[0.015, 2.3, 1.6]} />
        <meshStandardMaterial
          color="#c9c9cf"
          transparent
          opacity={0.16}
          roughness={0.12}
          metalness={0.2}
        />
      </mesh>
      <CaseEdges w={0.015} h={2.3} d={1.6} position={[0.51, 0, 0]} />
      <CaseEdges w={1.05} h={2.3} d={0.05} position={[0, 0, 0.78]} />

      <mesh position={[-0.44, 0.12, -0.18]}>
        <boxGeometry args={[0.03, 1.55, 1.05]} />
        <meshStandardMaterial color={MONO.interior} roughness={0.7} />
      </mesh>
      <mesh position={[-0.4, 0.82, -0.18]}>
        <boxGeometry args={[0.16, 0.32, 0.3]} />
        <meshStandardMaterial color="#333338" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[-0.4, 0.82, -0.5]}>
        <boxGeometry args={[0.025, 0.3, 0.04]} />
        <meshStandardMaterial color="#6f6f76" roughness={0.4} metalness={0.5} />
      </mesh>
      <mesh position={[-0.4, 0.82, -0.42]}>
        <boxGeometry args={[0.025, 0.3, 0.04]} />
        <meshStandardMaterial color="#6f6f76" roughness={0.4} metalness={0.5} />
      </mesh>

      <mesh position={[-0.2, 0.22, -0.12]}>
        <boxGeometry args={[0.32, 0.18, 0.95]} />
        <meshStandardMaterial color={MONO.metal} roughness={0.45} metalness={0.5} />
      </mesh>
      <mesh position={[-0.02, 0.22, -0.12]}>
        <boxGeometry args={[0.02, 0.1, 0.85]} />
        <meshStandardMaterial color="#4b4b52" roughness={0.4} metalness={0.6} />
      </mesh>

      <mesh position={[-0.05, -0.93, 0]}>
        <boxGeometry args={[0.92, 0.4, 1.5]} />
        <meshStandardMaterial color={MONO.panelDark} roughness={0.65} />
      </mesh>

      <Fan radius={0.22} position={[-0.08, 0.42, 0.6]} />
      <Fan radius={0.17} position={[-0.08, 0.72, -0.68]} />
    </group>
  )
}

export default function RigPreview({ reducedMotion, className }: RigPreviewProps) {
  const [systemReducedMotion] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const reduced = reducedMotion ?? systemReducedMotion

  return (
    <div
      role="img"
      aria-label="3D-превью игрового ПК: корпус с фронтальной вентиляцией, видеокарта и материнская плата"
      className={className ? `relative aspect-[4/3] w-full ${className}` : 'relative aspect-[4/3] w-full'}
    >
      <div aria-hidden="true" className="absolute inset-0">
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [2.9, 1.35, 3.4], fov: 34 }}
          frameloop={reduced ? 'demand' : 'always'}
          gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[3.5, 4, 2.5]} intensity={1.5} color="#ffffff" />
          <directionalLight position={[-3, 1.5, -2]} intensity={0.6} color="#e8e8e8" />
          <directionalLight position={[0, 0.5, 4]} intensity={0.35} color="#ffffff" />
          <CaseModel reduced={reduced} />
        </Canvas>
      </div>
    </div>
  )
}

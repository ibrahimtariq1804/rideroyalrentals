import { useFrame } from '@react-three/fiber'
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { Box3, Group, Object3D, Sphere, Vector3 } from 'three'
import { applyBrandPlateTexture } from '@/components/three/brandPlateTexture'
import { PANEL_DEFS, heroPlayback, type PanelName } from '@/components/three/heroPlayback'
import { useHeroGltf } from '@/components/three/useHeroGltf'

type Axis = 'x' | 'y' | 'z'

type PanelBinding = {
  name: PanelName
  axis: Axis
  node: Object3D
  closed: number
  open: number
}

export type ModelFraming = {
  radius: number
  height: number
}

type Props = {
  onFraming: (framing: ModelFraming) => void
  onMissing: (names: string[]) => void
  onProgress?: (value: number) => void
  interactive?: boolean
}

export function LX600Model({ onFraming, onMissing, onProgress, interactive = false }: Props) {
  const { scene, progress, error } = useHeroGltf()
  const group = useRef<Group>(null)
  const clone = useMemo(() => (scene ? scene.clone(true) : null), [scene])

  useEffect(() => {
    onProgress?.(progress)
  }, [progress, onProgress])

  useEffect(() => {
    if (error) console.error('3D model load failed', error)
  }, [error])
  const bindings = useRef<PanelBinding[]>([])

  useLayoutEffect(() => {
    if (!clone) return
    const missing: string[] = []
    const next: PanelBinding[] = []

    for (const def of PANEL_DEFS) {
      const node = clone.getObjectByName(def.name)
      if (!node) {
        missing.push(def.name)
        continue
      }
      next.push({
        name: def.name,
        axis: def.axis,
        node,
        closed: node.rotation[def.axis],
        open: def.open,
      })
    }
    bindings.current = next
    onMissing(missing)

    clone.updateMatrixWorld(true)
    const box = new Box3().setFromObject(clone)
    const center = box.getCenter(new Vector3())
    clone.position.sub(center)
    clone.updateMatrixWorld(true)
    const grounded = new Box3().setFromObject(clone)
    clone.position.y -= grounded.min.y
    clone.updateMatrixWorld(true)
    const framed = new Box3().setFromObject(clone)
    const framedSphere = framed.getBoundingSphere(new Sphere())
    onFraming({
      radius: Math.max(framedSphere.radius * 0.98, 0.1),
      height: framed.getSize(new Vector3()).y,
    })
    // Brand the stock plate faces only (texture swap — no mesh moves).
    applyBrandPlateTexture(clone)
  }, [clone, onFraming, onMissing])

  useFrame((_, delta) => {
    const p = heroPlayback
    const k = 1 - Math.exp(-10 * delta)
    const map: Record<PanelName, number> = {
      Door_FL: p.doorFL,
      Door_FR: p.doorFR,
      Door_RL: p.doorRL,
      Door_RR: p.doorRR,
      Hood: p.hood,
      Tailgate: p.tailgate,
    }
    for (const binding of bindings.current) {
      const amount = map[binding.name]
      const next = binding.closed + amount * binding.open
      binding.node.rotation[binding.axis] += (next - binding.node.rotation[binding.axis]) * k
    }
    if (group.current && !interactive) {
      group.current.position.x += (p.carX - group.current.position.x) * k
    }
  })

  if (!clone) return null

  return (
    <group ref={group}>
      <primitive object={clone} />
    </group>
  )
}

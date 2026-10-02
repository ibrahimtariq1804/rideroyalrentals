import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useCallback, useEffect, useRef, useState, type PointerEvent, type RefObject } from 'react'
import { ACESFilmicToneMapping, MathUtils, PerspectiveCamera, SRGBColorSpace, Vector3 } from 'three'
import { LX600Model, type ModelFraming } from '@/components/three/LX600Model'
import { StudioBackdrop } from '@/components/three/StudioBackdrop'
import { StudioLighting } from '@/components/three/StudioLighting'
import { ThreeErrorBoundary } from '@/components/three/ThreeErrorBoundary'
import { heroLook, heroPlayback } from '@/components/three/heroPlayback'
import { FleetImg } from '@/components/ui/Primitives'

function fitDistance(radius: number, fovDeg: number, aspect: number) {
  const vFov = MathUtils.degToRad(fovDeg)
  const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect)
  return Math.max(radius / Math.sin(vFov / 2), radius / Math.sin(hFov / 2))
}

const smooth = {
  azimuth: heroPlayback.azimuth,
  elevation: heroPlayback.elevation,
  radius: heroPlayback.radius,
  carX: heroPlayback.carX,
  targetX: heroPlayback.targetX,
  targetY: heroPlayback.targetY,
  targetZ: heroPlayback.targetZ,
}

function CameraRig({ framing }: { framing: RefObject<ModelFraming> }) {
  const camera = useThree((state) => state.camera)
  const size = useThree((state) => state.size)
  const target = useRef(new Vector3())

  useFrame((_, delta) => {
    const frame = framing.current
    const radius = frame.radius > 0.05 ? frame.radius : 1.2
    const height = frame.height || 1
    const cam = camera as PerspectiveCamera
    cam.fov = size.width < 720 ? 34 : 28
    cam.aspect = size.width / Math.max(size.height, 1)
    const p = heroPlayback
    const k = 1 - Math.exp(-4.6 * delta)
    smooth.azimuth += (p.azimuth + heroLook.az - smooth.azimuth) * k
    smooth.elevation += (p.elevation + heroLook.el - smooth.elevation) * k
    smooth.radius += (p.radius - smooth.radius) * k
    smooth.targetX += (p.targetX - smooth.targetX) * k
    smooth.targetY += (p.targetY - smooth.targetY) * k
    smooth.targetZ += (p.targetZ - smooth.targetZ) * k
    const doorSwing = Math.max(p.doorFL, p.doorFR, p.doorRL, p.doorRR, p.hood, p.tailgate)
    const bootHold = p.tailgate
    const distance =
      fitDistance(radius, cam.fov, cam.aspect) * smooth.radius * (1 + doorSwing * 0.08 + bootHold * 0.06) * 0.86
    const phi = Math.PI / 2 - Math.min(0.42, Math.max(0.04, smooth.elevation))
    target.current.set(smooth.targetX, smooth.targetY + height * (0.34 + bootHold * 0.08), smooth.targetZ)
    cam.position.setFromSphericalCoords(distance, phi, smooth.azimuth)
    cam.position.add(target.current)
    cam.lookAt(target.current)
    cam.updateProjectionMatrix()
  })

  return null
}

export function HeroCanvas({ active, onReady }: { active: boolean; onReady?: () => void }) {
  const framing = useRef<ModelFraming>({ radius: 0, height: 1 })
  const wrap = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [missing, setMissing] = useState<string[]>([])
  const [visible, setVisible] = useState(true)
  const [pageVisible, setPageVisible] = useState(true)
  const [orbiting, setOrbiting] = useState(false)
  const drag = useRef({ on: false, x: 0, y: 0, az: 0, el: 0 })

  const onFraming = useCallback(
    (value: ModelFraming) => {
      framing.current = value
      onReady?.()
    },
    [onReady],
  )
  const onMissing = useCallback((names: string[]) => setMissing(names), [])
  const onProgress = useCallback((value: number) => {
    setProgress(value)
  }, [])

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.02,
    })
    io.observe(el)
    const onVis = () => setPageVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch' || event.button !== 0) return
    if (event.target instanceof Element && event.target.closest('a, button')) return
    drag.current = { on: true, x: event.clientX, y: event.clientY, az: heroLook.az, el: heroLook.el }
    setOrbiting(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current.on) return
    const dx = event.clientX - drag.current.x
    const dy = event.clientY - drag.current.y
    heroLook.az = drag.current.az - dx * 0.0055
    heroLook.el = Math.min(0.28, Math.max(-0.18, drag.current.el + dy * 0.0032))
  }

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current.on) return
    drag.current.on = false
    setOrbiting(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const playing = (active && visible && pageVisible) || orbiting

  return (
    <div
      className={`hero-canvas ${orbiting ? 'is-orbiting' : ''}`}
      ref={wrap}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <ThreeErrorBoundary
        fallback={
          <FleetImg
            src="/images/fleet/hires/land-cruiser-2019.png"
            alt="Land Cruiser 2019"
            width={1600}
            height={900}
            loading="eager"
          />
        }
      >
        <Canvas
          dpr={[1, Math.min(2.5, typeof window !== 'undefined' ? window.devicePixelRatio : 2)]}
          gl={{
            antialias: true,
            powerPreference: 'high-performance',
            alpha: false,
            stencil: false,
            logarithmicDepthBuffer: true,
          }}
          camera={{ fov: 28, near: 0.05, far: 80, position: [2.6, 1.2, 4.4] }}
          frameloop={playing ? 'always' : 'never'}
          style={{ pointerEvents: 'none' }}
          onCreated={({ scene, gl }) => {
            scene.fog = null
            gl.toneMapping = ACESFilmicToneMapping
            gl.toneMappingExposure = 1.12
            gl.outputColorSpace = SRGBColorSpace
            const maxAniso = gl.capabilities.getMaxAnisotropy()
            gl.domElement.dataset.maxAnisotropy = String(maxAniso)
            gl.domElement.addEventListener('webglcontextlost', (event) => event.preventDefault(), false)
          }}
        >
          <StudioBackdrop />
          <StudioLighting />
          <LX600Model onFraming={onFraming} onMissing={onMissing} onProgress={onProgress} />
          <CameraRig framing={framing} />
        </Canvas>
      </ThreeErrorBoundary>
      <span className="sr-only">LX 600, {Math.round(progress)} percent loaded</span>
      {missing.length > 0 ? (
        <div className="model-loader">
          <p>Missing hinge nodes: {missing.join(', ')}. Check lexus-lx600-obsidian-rigged.glb.</p>
        </div>
      ) : null}
    </div>
  )
}

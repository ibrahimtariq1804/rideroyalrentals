import { Environment } from '@react-three/drei'
import { Suspense } from 'react'
import { SoftBoundary } from '@/components/three/ThreeErrorBoundary'
import { useTheme } from '@/context/ThemeProvider'

/** Soft fill lighting — tuned per theme so the black LX still reads on light stages. */
export function StudioLighting() {
  const { theme } = useTheme()
  const light = theme === 'light'

  return (
    <>
      <hemisphereLight
        args={light ? ['#ffffff', '#c5ccd6', 0.85] : ['#e8e4dc', '#0a0a0c', 0.55]}
      />
      <directionalLight
        position={[5.2, 8.4, 4.2]}
        intensity={light ? 2.6 : 2.35}
        color={light ? '#ffffff' : '#fff6ea'}
      />
      <directionalLight
        position={[-5.8, 3.2, -2.8]}
        intensity={light ? 1.35 : 1.7}
        color={light ? '#7a8fa8' : '#9bb8d4'}
      />
      <directionalLight
        position={[1.2, 2.8, -6.4]}
        intensity={light ? 1.15 : 0.95}
        color={light ? '#fff8f0' : '#f4f1ea'}
      />
      <spotLight
        position={[0, 10, 1.5]}
        intensity={light ? 1.25 : 1.05}
        angle={0.48}
        penumbra={0.85}
        color={light ? '#ffe8c2' : '#ffe9c8'}
      />
      <SoftBoundary>
        <Suspense fallback={null}>
          <Environment preset={light ? 'apartment' : 'city'} environmentIntensity={light ? 0.42 : 0.32} />
        </Suspense>
      </SoftBoundary>
    </>
  )
}

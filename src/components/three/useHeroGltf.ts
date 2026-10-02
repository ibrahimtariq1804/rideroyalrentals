import { useEffect, useState } from 'react'
import type { Group } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { enhanceHeroMaterials } from '@/components/three/enhanceHeroMaterials'
import { MODEL_PATH } from '@/components/three/heroPlayback'

type HeroGltfState = {
  scene: Group | null
  progress: number
  error: Error | null
}

let inflight: Promise<Group> | null = null

/** Bump when plate/transform fixes require a fresh parse (drops corrupted cached meshes). */
const SCENE_CACHE_GEN = 3
let loadedGen = 0

async function readBody(response: Response, onProgress: (value: number) => void) {
  const total = Number(response.headers.get('content-length')) || 0
  if (!response.body) return response.arrayBuffer()

  const reader = response.body.getReader()
  const chunks: Uint8Array[] = []
  let received = 0

  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
    received += value.byteLength
    if (total > 0) onProgress(Math.min(99, Math.round((received / total) * 100)))
  }

  const bytes = new Uint8Array(received)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.byteLength
  }
  return bytes.buffer
}

async function fetchModel(onProgress: (value: number) => void) {
  let lastError: unknown
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(MODEL_PATH, {
        cache: attempt === 0 ? 'default' : 'reload',
      })
      if (!response.ok) throw new Error(`Model HTTP ${response.status}`)
      return await readBody(response, onProgress)
    } catch (error) {
      lastError = error
      await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)))
    }
  }
  throw lastError instanceof Error ? lastError : new Error('Could not download the LX 600')
}

function loadHeroScene(onProgress: (value: number) => void) {
  if (loadedGen !== SCENE_CACHE_GEN) {
    inflight = null
    loadedGen = SCENE_CACHE_GEN
  }
  if (!inflight) {
    inflight = (async () => {
      const buffer = await fetchModel(onProgress)
      const loader = new GLTFLoader()
      if (MeshoptDecoder.supported) {
        await MeshoptDecoder.ready
        loader.setMeshoptDecoder(MeshoptDecoder)
      }
      const gltf = await loader.parseAsync(buffer, '/')
      enhanceHeroMaterials(gltf.scene)
      return gltf.scene
    })().catch((error) => {
      inflight = null
      throw error
    })
  }
  return inflight
}

/** Drop the cached scene so plate-scale / texture fixes always reload cleanly in dev. */
export function resetHeroGltfCache() {
  inflight = null
}

export function useHeroGltf(): HeroGltfState {
  const [scene, setScene] = useState<Group | null>(null)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let alive = true
    loadHeroScene((value) => {
      if (alive) setProgress(value)
    })
      .then((next) => {
        if (!alive) return
        setScene(next)
        setProgress(100)
      })
      .catch((caught: unknown) => {
        if (!alive) return
        setError(caught instanceof Error ? caught : new Error('Could not load the LX 600'))
      })
    return () => {
      alive = false
    }
  }, [])

  return { scene, progress, error }
}

void loadHeroScene(() => {})

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    inflight = null
  })
}

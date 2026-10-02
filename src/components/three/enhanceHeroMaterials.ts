import {
  Mesh,
  Object3D,
  type MeshPhysicalMaterial,
  type MeshStandardMaterial,
} from 'three'

/** Sharper close-ups: full-precision normals, stronger clearcoat response, no flat shading. */
export function enhanceHeroMaterials(root: Object3D) {
  root.traverse((obj) => {
    const mesh = obj as Mesh
    if (!mesh.isMesh) return
    mesh.castShadow = false
    mesh.receiveShadow = false
    mesh.frustumCulled = true

    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    for (const mat of mats) {
      if (!mat) continue
      const std = mat as MeshStandardMaterial
      std.flatShading = false
      if (std.map) {
        std.map.anisotropy = Math.max(std.map.anisotropy, 8)
        std.map.needsUpdate = true
      }
      if (std.normalMap) {
        std.normalMap.anisotropy = Math.max(std.normalMap.anisotropy, 8)
        std.normalMap.needsUpdate = true
      }

      const name = (std.name || '').toLowerCase()
      const isPaint = name.includes('paint') || name.includes('car paint')
      const isGlass = name.includes('glass')
      const isChrome = name.includes('chrome') || name.includes('iron') || name.includes('mirror')

      if (isPaint) {
        std.envMapIntensity = Math.max(std.envMapIntensity ?? 1, 1.15)
        const phys = std as MeshPhysicalMaterial
        if ('clearcoat' in phys) {
          phys.clearcoat = Math.max(phys.clearcoat ?? 0, 0.55)
          phys.clearcoatRoughness = Math.min(phys.clearcoatRoughness ?? 1, 0.18)
        }
        std.roughness = Math.min(std.roughness ?? 0.45, 0.38)
        std.metalness = Math.max(std.metalness ?? 0, 0.12)
      } else if (isChrome) {
        std.envMapIntensity = Math.max(std.envMapIntensity ?? 1, 1.35)
        std.metalness = Math.max(std.metalness ?? 0, 0.92)
        std.roughness = Math.min(std.roughness ?? 0.3, 0.22)
      } else if (isGlass) {
        std.envMapIntensity = Math.max(std.envMapIntensity ?? 1, 1.1)
        std.transparent = true
        std.depthWrite = false
      }

      std.needsUpdate = true
    }
  })
}

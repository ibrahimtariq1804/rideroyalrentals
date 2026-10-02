import {
  LinearFilter,
  LinearMipmapLinearFilter,
  Mesh,
  Object3D,
  SRGBColorSpace,
  TextureLoader,
  type Material,
  type MeshStandardMaterial,
  type Texture,
} from 'three'

/** 4K brand map — UV-rotated to read upright on stock plate meshes. */
const PLATE_MAP_SRC = '/brand/plate-brand.png?v=fix1'

let brandPlateMap: Texture | null = null
const pendingRoots = new Set<Object3D>()

function isPlateFaceMaterial(mat: Material) {
  const name = mat.name || ''
  if (name === '4-_4-_04___Default' || name.includes('04___Default')) return true
  const mapped = mat as MeshStandardMaterial
  if (mapped.map && (mapped.map.name === 'plate' || mapped.map.name === 'brand-plate')) return true
  return false
}

function stylePlateFaceMaterial(std: MeshStandardMaterial, texture: Texture) {
  if (std.map && std.map !== texture && std.map.name !== 'brand-plate') {
    std.map.dispose()
  }
  std.map = texture
  std.color.set('#ffffff')
  std.emissive.set('#ffffff')
  std.emissiveMap = texture
  std.emissiveIntensity = 0.85
  std.roughness = 0.35
  std.metalness = 0.04
  std.toneMapped = true
  std.needsUpdate = true
}

function applyToRoot(root: Object3D, texture: Texture) {
  const seen = new Set<Material>()
  root.traverse((obj) => {
    const mesh = obj as Mesh
    if (!mesh.isMesh) return
    // Never touch transform — scaling was what floated the plates off the car.
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    for (const mat of mats) {
      if (!mat || seen.has(mat) || !isPlateFaceMaterial(mat)) continue
      seen.add(mat)
      stylePlateFaceMaterial(mat as MeshStandardMaterial, texture)
    }
  })
}

function configureTexture(texture: Texture) {
  texture.name = 'brand-plate'
  texture.colorSpace = SRGBColorSpace
  texture.flipY = false
  texture.anisotropy = 16
  texture.generateMipmaps = true
  texture.minFilter = LinearMipmapLinearFilter
  texture.magFilter = LinearFilter
  texture.needsUpdate = true
}

function loadBrandPlateMap() {
  if (brandPlateMap) return
  const loader = new TextureLoader()
  loader.load(PLATE_MAP_SRC, (texture) => {
    configureTexture(texture)
    brandPlateMap = texture
    for (const next of pendingRoots) applyToRoot(next, texture)
    pendingRoots.clear()
  })
}

/** Swap stock ES-STAR plate art for the brand logo. Texture only — no mesh moves. */
export function applyBrandPlateTexture(root: Object3D) {
  if (brandPlateMap) {
    applyToRoot(root, brandPlateMap)
    return brandPlateMap
  }
  pendingRoots.add(root)
  loadBrandPlateMap()
  return null
}

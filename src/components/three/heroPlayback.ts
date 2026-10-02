export const MODEL_PATH = '/models/lexus-lx600-obsidian-rigged.glb'

export const PANEL_DEFS = [
  { name: 'Door_FL', axis: 'z', open: (-67 * Math.PI) / 180 },
  { name: 'Door_FR', axis: 'z', open: (67 * Math.PI) / 180 },
  { name: 'Door_RL', axis: 'z', open: (-64 * Math.PI) / 180 },
  { name: 'Door_RR', axis: 'z', open: (64 * Math.PI) / 180 },
  { name: 'Hood', axis: 'y', open: (55 * Math.PI) / 180 },
  { name: 'Tailgate', axis: 'y', open: (-68 * Math.PI) / 180 },
] as const

export type PanelName = (typeof PANEL_DEFS)[number]['name']

export const heroPlayback = {
  azimuth: 0.58,
  elevation: 0.1,
  radius: 1.07,
  carX: 0.2,
  targetX: 0,
  targetY: 0.04,
  targetZ: 0,
  doorFL: 0,
  doorFR: 0,
  doorRL: 0,
  doorRR: 0,
  hood: 0,
  tailgate: 0,
  progress: 0,
}

export const heroLook = {
  az: 0,
  el: 0,
}

function smoothstep(t: number) {
  const x = Math.min(1, Math.max(0, t))
  return x * x * (3 - 2 * x)
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function envelope(t: number, start: number, peakIn: number, peakOut: number, end: number) {
  if (t <= start || t >= end) return 0
  if (t < peakIn) return smoothstep((t - start) / Math.max(peakIn - start, 0.0001))
  if (t <= peakOut) return 1
  return 1 - smoothstep((t - peakOut) / Math.max(end - peakOut, 0.0001))
}

const START_AZ = 0.58
const LAP = Math.PI * 2
const REAR_AZ = Math.PI + LAP

type CamShot = {
  t: number
  az: number
  el: number
  radius: number
  carX: number
  targetX: number
  targetY: number
  targetZ: number
}

const camShots: CamShot[] = [
  { t: 0, az: START_AZ, el: 0.1, radius: 1.07, carX: 0.18, targetX: 0.04, targetY: 0.04, targetZ: 0.06 },
  { t: 0.08, az: 1.2, el: 0.22, radius: 1.1, carX: 0.1, targetX: 0.06, targetY: 0.06, targetZ: 0.02 },
  { t: 0.16, az: 1.95, el: 0.07, radius: 1.12, carX: 0.04, targetX: 0.04, targetY: 0.03, targetZ: -0.04 },
  { t: 0.28, az: 2.7, el: 0.2, radius: 1.13, carX: 0.02, targetX: 0.02, targetY: 0.05, targetZ: -0.08 },
  { t: 0.38, az: 3.45, el: 0.08, radius: 1.11, carX: 0, targetX: 0, targetY: 0.03, targetZ: -0.06 },
  { t: 0.48, az: 4.2, el: 0.23, radius: 1.08, carX: 0.02, targetX: -0.04, targetY: 0.06, targetZ: -0.02 },
  { t: 0.58, az: 5.05, el: 0.08, radius: 1.1, carX: 0.06, targetX: -0.04, targetY: 0.03, targetZ: 0.04 },
  { t: 0.68, az: 5.9, el: 0.16, radius: 1.09, carX: 0.1, targetX: 0.02, targetY: 0.05, targetZ: 0.08 },
  { t: 0.76, az: START_AZ + LAP, el: 0.13, radius: 1.08, carX: 0.08, targetX: 0.04, targetY: 0.04, targetZ: 0.06 },
  { t: 0.81, az: 7.7, el: 0.1, radius: 1.11, carX: 0.02, targetX: 0.03, targetY: 0.04, targetZ: -0.02 },
  { t: 0.85, az: 8.7, el: 0.08, radius: 1.14, carX: 0, targetX: 0, targetY: 0.04, targetZ: -0.1 },
  { t: 0.87, az: REAR_AZ, el: 0.07, radius: 1.16, carX: 0, targetX: 0, targetY: 0.05, targetZ: -0.16 },
  { t: 0.92, az: REAR_AZ + 0.04, el: 0.2, radius: 1.15, carX: 0, targetX: 0, targetY: 0.07, targetZ: -0.18 },
  { t: 0.96, az: REAR_AZ + 0.2, el: 0.12, radius: 1.1, carX: 0.04, targetX: 0.03, targetY: 0.05, targetZ: -0.1 },
  { t: 1, az: REAR_AZ + 0.42, el: 0.1, radius: 1.07, carX: 0.1, targetX: 0.05, targetY: 0.04, targetZ: -0.06 },
]

function sampleCam(progress: number) {
  let index = 0
  while (index < camShots.length - 1 && camShots[index + 1].t < progress) index += 1
  const from = camShots[index]
  const to = camShots[Math.min(index + 1, camShots.length - 1)]
  const u = smoothstep((progress - from.t) / Math.max(to.t - from.t, 0.0001))
  return {
    az: lerp(from.az, to.az, u),
    el: lerp(from.el, to.el, u),
    radius: lerp(from.radius, to.radius, u),
    carX: lerp(from.carX, to.carX, u),
    targetX: lerp(from.targetX, to.targetX, u),
    targetY: lerp(from.targetY, to.targetY, u),
    targetZ: lerp(from.targetZ, to.targetZ, u),
  }
}

export function applyHeroProgress(progress: number) {
  const t = Math.min(1, Math.max(0, progress))
  const cam = sampleCam(t)

  heroPlayback.azimuth = cam.az
  heroPlayback.elevation = cam.el
  heroPlayback.radius = cam.radius
  heroPlayback.carX = cam.carX
  heroPlayback.targetX = cam.targetX
  heroPlayback.targetY = cam.targetY
  heroPlayback.targetZ = cam.targetZ
  heroPlayback.doorFL = envelope(t, 0.18, 0.23, 0.34, 0.4)
  heroPlayback.doorFR = envelope(t, 0.28, 0.33, 0.42, 0.48)
  heroPlayback.doorRL = envelope(t, 0.38, 0.43, 0.5, 0.56)
  heroPlayback.doorRR = envelope(t, 0.44, 0.48, 0.53, 0.6)
  heroPlayback.hood = envelope(t, 0.66, 0.7, 0.75, 0.79)
  heroPlayback.tailgate = envelope(t, 0.835, 0.87, 0.93, 0.985)
  heroPlayback.progress = t
}

export const heroStages = [
  {
    id: 0,
    from: 0,
    to: 0.14,
    title: 'Rent without compromise.',
    copy: 'Islamabad fleet from economy to Land Cruiser — quoted when you actually need the car.',
    pos: 'pos-left',
    actions: true,
    hint: true,
  },
  {
    id: 1,
    from: 0.14,
    to: 0.27,
    title: 'Command the road.',
    copy: 'Presence first. The LX 600 holds the frame while the city waits.',
    pos: 'pos-right',
    detail: 'Spindle · obsidian · studio',
  },
  {
    id: 2,
    from: 0.27,
    to: 0.38,
    title: 'Chauffeur or self-drive.',
    copy: 'Where the class and the licence allow it. Premium 4x4 stays chauffeur-led.',
    pos: 'pos-high-right',
  },
  {
    id: 3,
    from: 0.38,
    to: 0.47,
    title: 'Dual access.',
    copy: 'Both front doors open. The camera stays clear of the swing.',
    pos: 'pos-low-left',
  },
  {
    id: 4,
    from: 0.47,
    to: 0.58,
    title: 'Space for every journey.',
    copy: 'Rear doors, family rows, airport groups. Capacity is confirmed at quote — never invented here.',
    pos: 'pos-right',
  },
  {
    id: 5,
    from: 0.58,
    to: 0.68,
    title: 'Cabin, then close.',
    copy: 'A held look inside, then every door returns to the closed silhouette.',
    pos: 'pos-low-right',
  },
  {
    id: 6,
    from: 0.68,
    to: 0.78,
    title: 'Power, refined.',
    copy: 'The hood lifts on its hinge — not a fabricated engine bay, not a close-up of empty metal.',
    pos: 'pos-left',
  },
  {
    id: 7,
    from: 0.78,
    to: 0.93,
    title: 'Airport. Intercity. Everyday.',
    copy: 'Luggage-first composition. Tell us the bags; we will not guess litres.',
    pos: 'pos-high-left',
  },
  {
    id: 8,
    from: 0.93,
    to: 1,
    title: 'Reserve your drive.',
    copy: 'Request a quote. Continue on WhatsApp when the number is configured.',
    pos: 'pos-left',
    reserve: true,
  },
] as const

export function stageIndexFromProgress(progress: number) {
  const found = heroStages.findIndex((stage) => progress >= stage.from && progress < stage.to)
  return found === -1 ? heroStages.length - 1 : found
}

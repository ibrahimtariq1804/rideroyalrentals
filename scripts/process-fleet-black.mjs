/**
 * Composite Falcon fleet cutouts onto pure black 1920x1080 cards.
 * Removes near-white leftover mats, then upscales with lanczos.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const fleetDir = path.resolve(__dirname, '../public/images/fleet')
const outDir = path.join(fleetDir, 'hires')

async function loadSharp() {
  try {
    return (await import('sharp')).default
  } catch {
    console.error('sharp is required. Run: npm i -D sharp')
    process.exit(1)
  }
}

function isBg(r, g, b, a) {
  if (a < 18) return true
  if (r >= 232 && g >= 232 && b >= 232) return true
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  if (max >= 210 && max - min <= 18 && r >= 200 && g >= 200 && b >= 200) return true
  return false
}

async function processOne(sharp, file) {
  const input = path.join(fleetDir, file)
  const base = path.basename(file, path.extname(file))
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const a = channels === 4 ? data[i + 3] : 255
    if (isBg(r, g, b, a)) {
      data[i] = 0
      data[i + 1] = 0
      data[i + 2] = 0
      if (channels === 4) data[i + 3] = 0
    }
  }

  const targetW = 1920
  const targetH = 1080
  const padX = 0.1
  const padY = 0.12
  const maxW = Math.round(targetW * (1 - 2 * padX))
  const maxH = Math.round(targetH * (1 - 2 * padY))
  const scale = Math.min(maxW / width, maxH / height)
  const dw = Math.round(width * scale)
  const dh = Math.round(height * scale)
  const left = Math.round((targetW - dw) / 2)
  const top = Math.round((targetH - dh) / 2 + targetH * 0.02)

  const car = await sharp(data, { raw: { width, height, channels } })
    .resize(dw, dh, { kernel: sharp.kernel.lanczos3, fit: 'fill' })
    .png()
    .toBuffer()

  await sharp({
    create: {
      width: targetW,
      height: targetH,
      channels: 3,
      background: { r: 0, g: 0, b: 0 },
    },
  })
    .composite([{ input: car, left, top }])
    .jpeg({ quality: 95, mozjpeg: true })
    .toFile(path.join(outDir, `${base}.jpg`))

  console.log(`OK ${file}`)
}

async function main() {
  const sharp = await loadSharp()
  fs.mkdirSync(outDir, { recursive: true })
  const files = fs
    .readdirSync(fleetDir)
    .filter((f) => f.endsWith('.png') && !/logo|Rent-a-car|web-felcon/i.test(f))
  for (const file of files) {
    await processOne(sharp, file)
  }
  console.log(`DONE ${files.length} files`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

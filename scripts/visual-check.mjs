import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import puppeteer from 'puppeteer-core'

const OUT = path.join(os.tmpdir(), 'vanta-drive-shots')
fs.mkdirSync(OUT, { recursive: true })

const edge = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
].find((p) => fs.existsSync(p))

if (!edge) throw new Error('No Edge/Chrome')

const browser = await puppeteer.launch({
  executablePath: edge,
  headless: true,
  args: ['--no-sandbox', '--allow-insecure-localhost', '--use-gl=angle'],
  userDataDir: path.join(os.tmpdir(), 'vanta-drive-edge'),
})

const errors = []
const page = await browser.newPage()
page.on('pageerror', (err) => errors.push(`pageerror ${err.message}`))
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(`console ${msg.text()}`)
})

async function shot(name, width, height, url, waitMs = 4000) {
  await page.setViewport({ width, height, deviceScaleFactor: 1 })
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 120000 })
  await page.waitForSelector('#root', { timeout: 30000 })
  await new Promise((r) => setTimeout(r, waitMs))
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2)
  const dest = path.join(OUT, `${name}.png`)
  await page.screenshot({ path: dest, fullPage: false })
  console.log(name, 'overflow', overflow, 'bytes', fs.statSync(dest).size)
  return dest
}

await shot('home-1440', 1440, 900, 'http://127.0.0.1:5173/', 25000)
await shot('home-1024', 1024, 768, 'http://127.0.0.1:5173/', 3000)
await shot('home-768', 768, 1024, 'http://127.0.0.1:5173/', 3000)
await shot('home-390', 390, 844, 'http://127.0.0.1:5173/', 3000)
await shot('home-360', 360, 800, 'http://127.0.0.1:5173/', 2500)
await shot('fleet-1440', 1440, 900, 'http://127.0.0.1:5173/fleet', 2500)
await shot('booking-1440', 1440, 900, 'http://127.0.0.1:5173/booking', 2500)
await shot('vehicle-1440', 1440, 900, 'http://127.0.0.1:5173/vehicle/lexus-lx-600', 4000)

const canvas = await page.evaluate(() => ({
  canvases: document.querySelectorAll('canvas').length,
  title: document.title,
}))
console.log('last page', canvas)
console.log('errors', errors)
await browser.close()
console.log('shots', OUT)

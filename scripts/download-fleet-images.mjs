import { execFileSync } from 'node:child_process'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public/images/fleet')
fs.mkdirSync(OUT, { recursive: true })

const WIKI = [
  ['lexus-lx600.jpg', 'LEXUS_LX_600_(J310)_China.jpg'],
  ['lexus-lx600-alt.jpg', 'Lexus_LX_(J310)_LX600"Executive"_(1).jpg'],
  ['lexus-lx600-exec.jpg', 'Lexus_LX_(J310)_LX600"Executive"_(2).jpg'],
  ['lexus-lx600-interior.jpg', 'LEXUS_LX_600_ULTRA_LUXURY_(J310)_INTERIOR.jpg'],
  ['toyota-corolla.jpg', '2020_Toyota_Corolla_SE.jpg'],
  ['honda-city.jpg', '2022_Honda_City_ZX_i-VTEC_(India)_front_view.jpg'],
  ['honda-city-alt.jpg', '2022_Honda_City_1.5_S_in_Crystal_Black_Pearl,_front_left.jpg'],
  ['kia-sportage.jpg', 'Kia_Sportage_Plug-in-Hybrid_(NQ5)_1X7A0317.jpg'],
  ['kia-sportage-alt.jpg', '2023_Kia_Sportage_(NQ5)_in_White,_front_left.jpg'],
  ['mg-hs.jpg', 'MG_HS_(second_generation)_DSC_7229.jpg'],
  ['toyota-yaris.jpg', '2017_Toyota_Yaris_iA_sedan_in_Blue,_front_left.jpg'],
  ['honda-civic.jpg', '2022_Honda_Civic_Touring_(CV2)_sedan,_front_12.17.19.jpg'],
  ['hyundai-tucson.jpg', '2018_Hyundai_Tucson_Premium_SE_CRDi_2WD_facelift_2.0_Front.jpg'],
  ['suzuki-alto.jpg', 'Suzuki_Alto_Van_VP_(HA36V)_front.jpg'],
  ['haval-h6.jpg', 'Haval_H6_Coupe_BL_facelift_002.jpg'],
]

const UNSPLASH = [
  ['toyota-fortuner.jpg', 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1400&q=80'],
  ['toyota-prado.jpg', 'https://images.unsplash.com/photo-1606666333516-0ba8020d7053?auto=format&fit=crop&w=1400&q=80'],
  ['toyota-land-cruiser.jpg', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1400&q=80'],
  ['toyota-hiace.jpg', 'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?auto=format&fit=crop&w=1400&q=80'],
  ['toyota-grand-cabin.jpg', 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1400&q=80'],
  ['suzuki-cultus.jpg', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1400&q=80'],
  ['suzuki-wagon-r.jpg', 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1400&q=80'],
  ['toyota-corolla-alt.jpg', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1400&q=80'],
  ['honda-civic-alt.jpg', 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1400&q=80'],
  ['hyundai-tucson-alt.jpg', 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1400&q=80'],
  ['detail-wheel.jpg', 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=80'],
  ['detail-lamp.jpg', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80'],
]

function wikiThumb(filename) {
  const md5 = crypto.createHash('md5').update(filename).digest('hex')
  const encoded = encodeURIComponent(filename)
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${md5[0]}/${md5.slice(0, 2)}/${encoded}/1280px-${encoded}`
}

function curlTo(url, dest) {
  execFileSync('curl.exe', ['-L', '--retry', '2', '--max-time', '40', '-A', 'Mozilla/5.0', '-o', dest, url], {
    stdio: 'pipe',
  })
  const size = fs.existsSync(dest) ? fs.statSync(dest).size : 0
  if (size < 12000) {
    const head = fs.existsSync(dest) ? fs.readFileSync(dest).subarray(0, 80).toString('utf8') : ''
    if (fs.existsSync(dest)) fs.unlinkSync(dest)
    throw new Error(`bad ${size} ${head.replace(/\s+/g, ' ').slice(0, 60)}`)
  }
  return size
}

for (const [file, wikiName] of WIKI) {
  const dest = path.join(OUT, file)
  if (fs.existsSync(dest) && fs.statSync(dest).size > 20000) {
    console.log('skip', file)
    continue
  }
  try {
    const n = curlTo(wikiThumb(wikiName), dest)
    console.log('wiki', file, n)
  } catch (err) {
    console.warn('wiki fail', file, err.message)
  }
}

for (const [file, url] of UNSPLASH) {
  const dest = path.join(OUT, file)
  if (fs.existsSync(dest) && fs.statSync(dest).size > 20000) {
    console.log('skip', file)
    continue
  }
  try {
    const n = curlTo(url, dest)
    console.log('unsplash', file, n)
  } catch (err) {
    console.warn('unsplash fail', file, err.message)
  }
}

const needed = [
  'suzuki-alto.jpg',
  'suzuki-cultus.jpg',
  'suzuki-wagon-r.jpg',
  'honda-city.jpg',
  'toyota-yaris.jpg',
  'toyota-corolla.jpg',
  'honda-civic.jpg',
  'kia-sportage.jpg',
  'hyundai-tucson.jpg',
  'haval-h6.jpg',
  'mg-hs.jpg',
  'toyota-fortuner.jpg',
  'toyota-prado.jpg',
  'toyota-land-cruiser.jpg',
  'toyota-hiace.jpg',
  'toyota-grand-cabin.jpg',
  'lexus-lx600-alt.jpg',
  'lexus-lx600-interior.jpg',
  'lexus-lx600-exec.jpg',
]
const fillers = fs.readdirSync(OUT).filter((f) => f.startsWith('campaign-') && f.endsWith('.jpg'))
let i = 0
for (const file of needed) {
  const dest = path.join(OUT, file)
  if (fs.existsSync(dest) && fs.statSync(dest).size > 20000) continue
  const src = path.join(OUT, fillers[i % fillers.length])
  fs.copyFileSync(src, dest)
  console.log('fill', file, 'from', fillers[i % fillers.length])
  i += 1
}

console.log('final', fs.readdirSync(OUT).join(', '))

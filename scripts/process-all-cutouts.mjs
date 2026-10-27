import fs from 'node:fs';
import zlib from 'node:zlib';
import path from 'node:path';

function processCarCutout({
  inputPath,
  outputPath,
  baseThreshold = 22,
  maxGroundY,
  extraFloorRule = null,
  isBlockedFn = null
}) {
  console.log(`Processing: ${path.basename(inputPath)} -> ${path.basename(outputPath)}...`);
  const buf = fs.readFileSync(inputPath);
  let pos = 8, width, height, idatBuffers = [];

  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    pos += 12 + len;
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
    } else if (type === 'IDAT') {
      idatBuffers.push(data);
    }
  }

  const decompressed = zlib.inflateSync(Buffer.concat(idatBuffers));
  const bpp = 3;
  const stride = 1 + width * bpp;
  const rawRgb = Buffer.alloc(width * height * 3);
  let prevRow = Buffer.alloc(width * bpp);

  for (let y = 0; y < height; y++) {
    const filterType = decompressed[y * stride];
    const row = Buffer.alloc(width * bpp);
    for (let x = 0; x < width * bpp; x++) {
      const curr = decompressed[y * stride + 1 + x];
      const a = x >= bpp ? row[x - bpp] : 0;
      const b = prevRow[x];
      const c = x >= bpp ? prevRow[x - bpp] : 0;
      let val = 0;
      if (filterType === 0) val = curr;
      else if (filterType === 1) val = (curr + a) & 0xff;
      else if (filterType === 2) val = (curr + b) & 0xff;
      else if (filterType === 3) val = (curr + Math.floor((a + b) / 2)) & 0xff;
      else if (filterType === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        const pr = pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
        val = (curr + pr) & 0xff;
      }
      row[x] = val;
    }
    row.copy(prevRow);
    row.copy(rawRgb, y * width * 3);
  }

  const isBg = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let head = 0, tail = 0;

  function push(x, y) {
    const idx = y * width + x;
    if (isBg[idx] === 0) {
      isBg[idx] = 1;
      queue[tail++] = idx;
    }
  }

  // Seed with outer boundaries
  for (let x = 0; x < width; x++) {
    push(x, 0);
    push(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    push(0, y);
    push(width - 1, y);
  }

  while (head < tail) {
    const idx = queue[head++];
    const cx = idx % width;
    const cy = (idx / width) | 0;

    const neighbors = [
      cx > 0 ? idx - 1 : -1,
      cx < width - 1 ? idx + 1 : -1,
      cy > 0 ? idx - width : -1,
      cy < height - 1 ? idx + width : -1
    ];

    for (let i = 0; i < 4; i++) {
      const nIdx = neighbors[i];
      if (nIdx !== -1 && isBg[nIdx] === 0) {
        const nx = nIdx % width;
        const ny = (nIdx / width) | 0;

        if (isBlockedFn && isBlockedFn(nx, ny)) continue;

        const r = rawRgb[nIdx * 3];
        const g = rawRgb[nIdx * 3 + 1];
        const b = rawRgb[nIdx * 3 + 2];
        const maxVal = Math.max(r, g, b);

        let thresh = baseThreshold;
        if (extraFloorRule && extraFloorRule(nx, ny)) {
          thresh = 70;
        } else if (ny > maxGroundY) {
          thresh = 150;
        } else if (ny > maxGroundY - 25) {
          thresh = baseThreshold + 10;
        }

        if (maxVal <= thresh) {
          isBg[nIdx] = 1;
          queue[tail++] = nIdx;
        }
      }
    }
  }

  // Connected component filtering: clean up isolated small dark specks in bottom region
  const visited = new Uint8Array(width * height);
  const compQueue = new Int32Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const startIdx = y * width + x;
      if (isBg[startIdx] === 0 && visited[startIdx] === 0) {
        let compHead = 0, compTail = 0;
        compQueue[compTail++] = startIdx;
        visited[startIdx] = 1;

        while (compHead < compTail) {
          const cIdx = compQueue[compHead++];
          const ccx = cIdx % width;
          const ccy = (cIdx / width) | 0;

          const nbs = [
            ccx > 0 ? cIdx - 1 : -1,
            ccx < width - 1 ? cIdx + 1 : -1,
            ccy > 0 ? cIdx - width : -1,
            ccy < height - 1 ? cIdx + width : -1
          ];

          for (let k = 0; k < 4; k++) {
            const nb = nbs[k];
            if (nb !== -1 && isBg[nb] === 0 && visited[nb] === 0) {
              visited[nb] = 1;
              compQueue[compTail++] = nb;
            }
          }
        }

        if (compTail < 500 && y > 600) {
          for (let k = 0; k < compTail; k++) {
            isBg[compQueue[k]] = 1;
          }
        }
      }
    }
  }

  // Construct RGBA buffer with soft edge feathering
  const rgba = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const r = rawRgb[idx * 3];
      const g = rawRgb[idx * 3 + 1];
      const b = rawRgb[idx * 3 + 2];
      const maxVal = Math.max(r, g, b);

      if (isBg[idx] === 1) {
        rgba[idx * 4] = 0;
        rgba[idx * 4 + 1] = 0;
        rgba[idx * 4 + 2] = 0;
        rgba[idx * 4 + 3] = 0;
      } else {
        let hasBgNeighbor = false;
        if (x > 0 && isBg[idx - 1] === 1) hasBgNeighbor = true;
        else if (x < width - 1 && isBg[idx + 1] === 1) hasBgNeighbor = true;
        else if (y > 0 && isBg[idx - width] === 1) hasBgNeighbor = true;
        else if (y < height - 1 && isBg[idx + width] === 1) hasBgNeighbor = true;

        if (hasBgNeighbor && maxVal < 35) {
          const alpha = Math.max(0, Math.min(255, Math.round(((maxVal - 10) / 25) * 255)));
          rgba[idx * 4] = r;
          rgba[idx * 4 + 1] = g;
          rgba[idx * 4 + 2] = b;
          rgba[idx * 4 + 3] = alpha;
        } else {
          rgba[idx * 4] = r;
          rgba[idx * 4 + 1] = g;
          rgba[idx * 4 + 2] = b;
          rgba[idx * 4 + 3] = 255;
        }
      }
    }
  }

  // Encode to PNG
  const outScanlines = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    outScanlines[y * (1 + width * 4)] = 0;
    rgba.copy(outScanlines, y * (1 + width * 4) + 1, y * width * 4, (y + 1) * width * 4);
  }
  const newIdat = zlib.deflateSync(outScanlines);

  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : (c >>> 1);
    crcTable[n] = c;
  }
  function crc32(b) {
    let c = 0xffffffff;
    for (let i = 0; i < b.length; i++) c = crcTable[(c ^ b[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff);
  }
  function createChunk(type, data) {
    const chunk = Buffer.alloc(12 + data.length);
    chunk.writeUInt32BE(data.length, 0);
    chunk.write(type, 4, 4, 'ascii');
    data.copy(chunk, 8);
    chunk.writeInt32BE(crc32(chunk.subarray(4, 8 + data.length)), 8 + data.length);
    return chunk;
  }

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 6; // RGBA

  const finalPng = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    createChunk('IHDR', ihdrData),
    createChunk('IDAT', newIdat),
    createChunk('IEND', Buffer.alloc(0))
  ]);

  fs.writeFileSync(outputPath, finalPng);
  console.log(`Successfully created transparent cutout: ${outputPath} (${width}x${height})`);
}

const fleetDir = 'public/images/fleet/hires';

// 1. Toyota Vitz
processCarCutout({
  inputPath: path.join(fleetDir, 'White Toyota Vitz on Black Backdrop.png'),
  outputPath: path.join(fleetDir, 'toyota-vitz.png'),
  baseThreshold: 22,
  maxGroundY: 908,
  extraFloorRule: (x, y) => x < 250 && y > 815
});

// 2. Toyota Aqua
processCarCutout({
  inputPath: path.join(fleetDir, 'White Toyota Aqua Hybrid on Black.png'),
  outputPath: path.join(fleetDir, 'toyota-aqua.png'),
  baseThreshold: 22,
  maxGroundY: 890,
  extraFloorRule: (x, y) => x < 250 && y > 805
});

// 3. Toyota Yaris
processCarCutout({
  inputPath: path.join(fleetDir, 'White Toyota Yaris Studio Showcase.png'),
  outputPath: path.join(fleetDir, 'toyota-yaris.png'),
  baseThreshold: 22,
  maxGroundY: 895,
  isBlockedFn: (nx, ny) => {
    // Protect the front grille interior from underbody leaks
    if (nx >= 50 && nx <= 490 && ny >= 600 && ny < 790) return true;
    if (nx >= 160 && nx <= 420 && ny >= 790 && ny < 803) return true;
    if (nx >= 460 && nx <= 510 && ny >= 780 && ny <= 830) return true;
    return false;
  }
});

// 4. Suzuki Wagon R
processCarCutout({
  inputPath: path.join(fleetDir, 'White Suzuki Wagon R Studio Render.png'),
  outputPath: path.join(fleetDir, 'suzuki-wagon-r.png'),
  baseThreshold: 22,
  maxGroundY: 926,
  extraFloorRule: (x, y) => x < 150 && y > 815
});

console.log('ALL 4 CAR CUTOUTS SUCCESSFULLY PROCESSED AND SAVED!');

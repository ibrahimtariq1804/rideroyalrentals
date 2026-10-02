import fs from 'node:fs'

const p = 'c:/Users/HP/Projects/vanta-drive/src/data/fleet.ts'
let s = fs.readFileSync(p, 'utf8')

s = s.replace(/\r?\nconst atmosphere = \(file: string\) => `\/images\/fleet\/\$\{file\}`\r?\n/, '\n')

const before = (s.match(/atmosphere\(/g) || []).length
s = s.replace(
  /heroImage: img\('([^']+)'\),\r?\n\s*altImage: [^\r\n]+\r?\n\s*gallery: \[[^\]]+\],/g,
  (_m, file) =>
    `heroImage: img('${file}'),\n    altImage: img('${file}'),\n    gallery: [img('${file}')],`,
)
const after = (s.match(/atmosphere\(/g) || []).length

fs.writeFileSync(p, s)
console.log({ before, after, galleries: (s.match(/gallery: \[img\('/g) || []).length })

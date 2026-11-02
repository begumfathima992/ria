import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const src = path.join(root, 'src')
const files = []
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full)
    else if (/\.(js|mjs)$/.test(entry.name)) files.push(full)
  }
}
walk(src); walk(path.join(root,'scripts'))
let failed = false
for (const file of files) {
  const text = fs.readFileSync(file,'utf8')
  const re = /from\s+['"](\.[^'"]+)['"]/g
  for (const match of text.matchAll(re)) {
    let target = path.resolve(path.dirname(file), match[1])
    if (!path.extname(target)) target += '.js'
    if (!fs.existsSync(target)) { console.error('Missing import:', path.relative(root,file), '->', match[1]); failed = true }
  }
}
if (failed) process.exit(1)
console.log(`Import check passed for ${files.length} JS/MJS files.`)

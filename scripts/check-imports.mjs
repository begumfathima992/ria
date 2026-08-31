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
    else if (/\.(js|jsx)$/.test(entry.name)) files.push(full)
  }
}
walk(src)

const missing = []
const duplicateReactImports = []
const jsxWithoutReact = []

for (const file of files) {
  const text = fs.readFileSync(file, 'utf8')
  const relativeFile = path.relative(root, file)
  const imports = [...text.matchAll(/from\s+['"](\.[^'"]+)['"]/g)].map((m) => m[1])

  for (const spec of imports) {
    const base = path.resolve(path.dirname(file), spec)
    const candidates = [
      base,
      `${base}.js`,
      `${base}.jsx`,
      `${base}.svg`,
      `${base}.jpeg`,
      `${base}.jpg`,
      `${base}.png`,
      path.join(base, 'index.js'),
      path.join(base, 'index.jsx'),
    ]
    if (!candidates.some((candidate) => fs.existsSync(candidate))) {
      missing.push(`${relativeFile} -> ${spec}`)
    }
  }

  if (file.endsWith('.jsx')) {
    const reactImports = text.match(/^import\s+React(?:\s*,|\s+from)/gm) || []
    if (reactImports.length > 1) duplicateReactImports.push(relativeFile)
    if (reactImports.length === 0) jsxWithoutReact.push(relativeFile)
  }
}

if (missing.length || duplicateReactImports.length || jsxWithoutReact.length) {
  if (missing.length) console.error(`Missing imports:\n${missing.join('\n')}`)
  if (duplicateReactImports.length) console.error(`Duplicate React imports:\n${duplicateReactImports.join('\n')}`)
  if (jsxWithoutReact.length) console.error(`JSX files without React in scope:\n${jsxWithoutReact.join('\n')}`)
  process.exit(1)
}

console.log(`Checked ${files.length} source files: imports resolve and every JSX file has exactly one React import.`)

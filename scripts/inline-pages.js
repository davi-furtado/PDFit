import fs from 'node:fs'
import path from 'node:path'

const dist = path.resolve('dist')
const assetDir = path.join(dist, 'assets')
const files = fs
  .readdirSync(dist)
  .filter((file) => file.endsWith('.html'))

const readAsset = (assetPath) => {
  const file = path.join(assetDir, assetPath)
  if (!fs.existsSync(file)) {
    throw new Error(`Asset não encontrado: ${file}`)
  }
  return fs.readFileSync(file, 'utf8')
}

for (const file of files) {
  const htmlPath = path.join(dist, file)
  let html = fs.readFileSync(htmlPath, 'utf8')

  html = html.replace(
    /<link rel="stylesheet" crossorigin href="\.\/assets\/([^"]+)">/,
    (_, asset) => `<style>${readAsset(asset)}</style>`
  )
  html = html.replace(
    /<script type="module" crossorigin src="\.\/assets\/([^"]+)"><\/script>/,
    (_, asset) => `<script type="module">${readAsset(asset)}</script>`
  )

  fs.writeFileSync(htmlPath, html)
}

fs.rmSync(assetDir, { recursive: true, force: true })

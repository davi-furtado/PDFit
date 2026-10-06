import fs from 'node:fs'
import path from 'node:path'

const dist = path.resolve('dist')
const assetDir = path.join(dist, 'assets')
const pagesDir = path.join(dist, 'pages')
const files = fs.readdirSync(pagesDir).filter((file) => file.endsWith('.html'))

const readAsset = (assetPath) => {
  const file = path.join(assetDir, assetPath)
  if (!fs.existsSync(file)) {
    throw new Error(`Asset não encontrado: ${file}`)
  }
  return fs.readFileSync(file, 'utf8')
}

for (const file of files) {
  const htmlPath = path.join(pagesDir, file)
  let html = fs.readFileSync(htmlPath, 'utf8')
  html = html.replaceAll('../assets/', './assets/')

  html = html.replace(
    /<link rel="stylesheet" crossorigin href="\.\/assets\/([^"]+)">/,
    (_, asset) => `<style>${readAsset(asset)}</style>`
  )
  html = html.replace(
    /<script type="module" crossorigin src="\.\/assets\/([^"]+)"><\/script>/,
    (_, asset) => `<script type="module">${readAsset(asset)}</script>`
  )
  html = html.replace(
    /<link rel="modulepreload" crossorigin href="\.\/assets\/[^"]+">/,
    ''
  )
  html = html.replace(/\.\/assets\/favicon-[^"]+\.ico/g, 'favicon.ico')

  fs.writeFileSync(htmlPath, html)
}

fs.rmSync(assetDir, { recursive: true, force: true })

for (const file of files) {
  fs.copyFileSync(path.join(pagesDir, file), path.join(dist, file))
}

fs.rmSync(pagesDir, { recursive: true, force: true })

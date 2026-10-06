import { cp, mkdir } from 'node:fs/promises'

await mkdir('src/css/fonts', { recursive: true })
await mkdir('src/js', { recursive: true })
await cp(
  'node_modules/bootstrap/dist/css/bootstrap.min.css',
  'src/css/bootstrap.min.css'
)
await cp(
  'node_modules/bootstrap-icons/font/bootstrap-icons.min.css',
  'src/css/bootstrap-icons.min.css'
)
await cp('node_modules/bootstrap-icons/font/fonts', 'src/css/fonts', {
  recursive: true
})
await cp(
  'node_modules/html2pdf.js/dist/html2pdf.bundle.min.js',
  'src/js/html2pdf.bundle.min.js'
)

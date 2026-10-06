import { cp, mkdir } from 'node:fs/promises'

await mkdir('css/fonts', { recursive: true })
await mkdir('js', { recursive: true })
await cp(
  'node_modules/bootstrap/dist/css/bootstrap.min.css',
  'css/bootstrap.min.css',
)
await cp(
  'node_modules/bootstrap-icons/font/bootstrap-icons.min.css',
  'css/bootstrap-icons.min.css',
)
await cp('node_modules/bootstrap-icons/font/fonts', 'css/fonts', {
  recursive: true,
})
await cp('node_modules/html2pdf.js/dist/html2pdf.bundle.min.js', 'js/html2pdf.bundle.min.js')

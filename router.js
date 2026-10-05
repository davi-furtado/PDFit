import fs from 'node:fs'
import path from 'node:path'

export function router({ pagesDir = '', notFound = '/404' } = {}) {
  let root

  const isFile = (file) => {
    try {
      return fs.statSync(file).isFile()
    } catch {
      return false
    }
  }

  const isInside = (file) => {
    const rel = path.relative(root, file)
    return rel !== '' && !rel.startsWith('..') && !path.isAbsolute(rel)
  }

  const toFile = (url) => path.resolve(root, `.${url}`)

  const redirect = (res, location) => {
    res.statusCode = 302
    res.setHeader('Location', location)
    res.end()
  }

  // '/cardapio' -> '<pagesDir>/cardapio'
  const withDir = (p) =>
    pagesDir ? `/${pagesDir.replace(/^\/|\/$/g, '')}${p}` : p

  return {
    name: 'router',

    configResolved(config) {
      root = path.resolve(config.root) // normaliza para o separador do SO
    },

    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        try {
          if (!req.url || (req.method !== 'GET' && req.method !== 'HEAD')) {
            return next()
          }

          const { pathname, search } = new URL(req.url, 'http://localhost')

          // Não mexe em requisições internas do Vite nem em arquivos do pagesDir já reescritos
          if (
            pathname.startsWith('/@') ||
            pathname.startsWith('/node_modules/')
          ) {
            return next()
          }

          // /index, /index.html, /pasta/index.html -> /, /pasta/
          const indexMatch = pathname.match(/^(.*\/)index(\.html)?$/)
          if (indexMatch) {
            return redirect(res, indexMatch[1] + search)
          }

          // /cardapio.html -> /cardapio
          if (pathname.endsWith('.html')) {
            return redirect(res, pathname.slice(0, -'.html'.length) + search)
          }

          // Assets (.js, .css, .png...) seguem direto para o Vite
          if (path.extname(pathname)) return next()

          // Clean URL -> arquivo HTML real
          const rel = decodeURIComponent(pathname).replace(/\/$/, '')
          const candidates = [withDir(`${rel}/index.html`)]
          if (rel) candidates.push(withDir(`${rel}.html`))

          for (const candidate of candidates) {
            const file = toFile(candidate)
            if (isInside(file) && isFile(file)) {
              req.url = `${candidate}${search}`
              return next()
            }
          }

          // 404 só para navegações de página
          if (req.headers.accept?.includes('text/html')) {
            const notFoundUrl = withDir(`/${notFound}`)
            const file = toFile(notFoundUrl)
            if (isInside(file) && isFile(file)) {
              const html = await server.transformIndexHtml(
                notFoundUrl,
                fs.readFileSync(file, 'utf-8')
              )
              res.statusCode = 404
              res.setHeader('Content-Type', 'text/html; charset=utf-8')
              return res.end(html)
            }
          }

          next()
        } catch (err) {
          next(err)
        }
      })
    }
  }
}

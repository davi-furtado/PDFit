import path from 'node:path'
import { defineConfig } from 'vite'
import { router } from './router.js'

export default defineConfig(({ command }) => {
  return {
    appType: 'mpa',
    base: command === 'build' ? './' : '/',
    plugins: [router()],
    build: {
      rollupOptions: {
        input: {
          index: path.resolve(import.meta.dirname, 'index.html'),
          'novo-treino': path.resolve(import.meta.dirname, 'novo-treino.html'),
          'editor-treino': path.resolve(
            import.meta.dirname,
            'editor-treino.html'
          ),
          avaliacao: path.resolve(import.meta.dirname, 'avaliacao.html'),
          404: path.resolve(import.meta.dirname, '404.html')
        }
      }
    },
    server: {
      host: true
    },
    preview: {
      host: true
    }
  }
})

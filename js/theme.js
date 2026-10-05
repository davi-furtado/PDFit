import { $ } from './utils.js'

export const setupTheme = () => {
  const theme = localStorage.getItem('pdfit-theme') || 'dark'
  document.body.dataset.theme = theme
  document.documentElement.dataset.bsTheme = theme
  const toggle = $('#theme-toggle')
  if (!toggle) return

  const renderToggle = (currentTheme) => {
    toggle.innerHTML =
      currentTheme === 'dark'
        ? '<i class="bi bi-sun" aria-hidden="true"></i>'
        : '<i class="bi bi-moon-stars" aria-hidden="true"></i>'
    toggle.setAttribute(
      'aria-label',
      currentTheme === 'dark'
        ? 'Mudar para modo claro'
        : 'Mudar para modo escuro'
    )
    toggle.title =
      currentTheme === 'dark'
        ? 'Mudar para modo claro'
        : 'Mudar para modo escuro'
  }

  renderToggle(theme)
  toggle.addEventListener('click', () => {
    const nextTheme =
      document.body.dataset.theme === 'dark' ? 'light' : 'dark'
    localStorage.setItem('pdfit-theme', nextTheme)
    document.body.dataset.theme = nextTheme
    document.documentElement.dataset.bsTheme = nextTheme
    renderToggle(nextTheme)
  })
}

const pdfitBasePath = location.pathname.startsWith('/PDFit/') ? '/PDFit/' : '/'

document.querySelectorAll('[data-home]').forEach((link) => {
  link.href = `${pdfitBasePath}index.html`
})

const themeToggle = document.querySelector('#theme-toggle')
const savedTheme = localStorage.getItem('pdfit-theme')
const preferredTheme =
  savedTheme ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

const renderTheme = (theme) => {
  const isDark = theme === 'dark'
  document.body.classList.toggle('dark', isDark)
  themeToggle.innerHTML = isDark
    ? '<i class="bi bi-sun-fill" aria-hidden="true"></i>'
    : '<i class="bi bi-moon-stars-fill" aria-hidden="true"></i>'
  themeToggle.setAttribute(
    'aria-label',
    isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro',
  )
  themeToggle.title = isDark
    ? 'Mudar para modo claro'
    : 'Mudar para modo escuro'
}

if (themeToggle) {
  renderTheme(preferredTheme)
  themeToggle.addEventListener('click', () => {
    const nextTheme = document.body.classList.contains('dark') ? 'light' : 'dark'
    localStorage.setItem('pdfit-theme', nextTheme)
    renderTheme(nextTheme)
  })
}

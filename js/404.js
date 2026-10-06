const pdfitBasePath = location.pathname.startsWith('/PDFit/') ? '/PDFit/' : '/'

document.querySelectorAll('[data-home]').forEach((link) => {
  link.href = `${pdfitBasePath}index.html`
})

const themeToggle = document.querySelector('#theme-toggle')
const renderTheme = (theme) => {
  const isDark = theme === 'dark'
  document.body.classList.toggle('dark', isDark)
  themeToggle.textContent = isDark ? '☀' : '☾'
  themeToggle.setAttribute(
    'aria-label',
    isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro',
  )
  themeToggle.title = isDark
    ? 'Mudar para modo claro'
    : 'Mudar para modo escuro'
}

renderTheme(localStorage.getItem('pdfit-theme') || 'dark')
themeToggle.addEventListener('click', () => {
  const nextTheme = document.body.classList.contains('dark') ? 'light' : 'dark'
  localStorage.setItem('pdfit-theme', nextTheme)
  renderTheme(nextTheme)
})

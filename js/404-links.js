(() => {
  const basePath = location.pathname.startsWith('/PDFit/') ? '/PDFit/' : '/'
  document.querySelectorAll('[data-home]').forEach((link) => {
    link.href = `${basePath}index.html`
  })
})()

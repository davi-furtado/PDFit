import { keys } from './constants.js'
import { personal } from './storage.js'
import { setupTheme } from './theme.js'
import { $, validateForm } from './utils.js'

export function initHome() {
  setupTheme()
  $('#personal-name').value = personal()

  $('#personal-form').addEventListener('submit', (event) => {
    event.preventDefault()
    if (!validateForm(event.currentTarget)) return
    sessionStorage.setItem(keys.personal, $('#personal-name').value.trim())
    location.href = 'novo-treino.html'
  })

  $('#assessment-link').addEventListener('click', () => {
    if (!validateForm($('#personal-form'))) return
    const name = $('#personal-name').value.trim()
    sessionStorage.setItem(keys.personal, name)
    location.href = 'avaliacao.html'
  })
}

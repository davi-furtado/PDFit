import { keys } from './constants.js'
import { $ } from './utils.js'
import { personal } from './storage.js'
import { setupTheme } from './theme.js'

export function initHome() {
  setupTheme()
  $('#personal-name').value = personal()
  $('#personal-form').addEventListener('submit', (event) => {
    event.preventDefault()
    sessionStorage.setItem(keys.personal, $('#personal-name').value.trim())
    location.href = 'treino-novo.html'
  })
  $('#assessment-link').addEventListener('click', () => {
    const name = $('#personal-name').value.trim()
    if (!name) {
      $('#personal-name').focus()
      return
    }
    sessionStorage.setItem(keys.personal, name)
    location.href = 'avaliacao.html'
  })
}

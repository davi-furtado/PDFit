import { keys } from './constants.js'
import { $, daysFor } from './utils.js'
import { personal, save } from './storage.js'
import { setupTheme } from './theme.js'

export function initNewWorkout() {
  setupTheme()
  if (!personal()) {
    location.href = 'index.html'
    return
  }
  $('#new-workout-form').addEventListener('submit', (event) => {
    event.preventDefault()
    const split = $('#split').value
    save(keys.workout, {
      personal: personal(),
      aluno: $('#student-name').value.trim(),
      divisao: split,
      comentarioGeral: '',
      dias: daysFor(split)
    })
    location.href = 'treino-editor.html'
  })
}

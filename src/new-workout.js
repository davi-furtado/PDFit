import { keys } from './constants.js'
import { personal, save } from './storage.js'
import { setupTheme } from './theme.js'
import { $, daysFor, validateForm } from './utils.js'

export function initNewWorkout() {
  setupTheme()

  if (!personal()) {
    location.href = 'index.html'
    return
  }

  $('#new-workout-form').addEventListener('submit', (event) => {
    event.preventDefault()
    if (!validateForm(event.currentTarget)) return
    const split = $('#split').value
    save(keys.workout, {
      personal: personal(),
      aluno: $('#student-name').value.trim(),
      divisao: split,
      comentarioGeral: '',
      dias: daysFor(split)
    })
    location.href = 'editor-treino.html'
  })
}

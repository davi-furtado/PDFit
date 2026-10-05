import { keys } from './constants.js'
import { $, escapeHtml } from './utils.js'
import { load } from './storage.js'
import { setupTheme } from './theme.js'
import { generateWorkoutPdf } from './pdf.js'

export function initWorkoutEditor() {
  setupTheme()
  const workout = load(keys.workout)
  if (!workout) {
    location.href = 'treino-novo.html'
    return
  }
  $('#workout-heading').textContent = `${workout.aluno} · ${workout.divisao}`
  $('#general-comment').value = workout.comentarioGeral
  const tabs = $('#day-tabs')
  const editor = $('#day-editor')
  let active = 0

  const exerciseHtml = (exercise, index, total) => `<div class="exercise-card" data-exercise="${index}">
      <div class="d-flex justify-content-between gap-2"><strong><i class="bi bi-dumbbell" aria-hidden="true"></i> Exercício ${index + 1}</strong><div class="btn-group btn-group-sm">
      <button type="button" class="btn btn-outline-secondary move-up" title="Mover para cima" aria-label="Mover para cima" ${index === 0 ? 'disabled' : ''}><i class="bi bi-chevron-up" aria-hidden="true"></i></button><button type="button" class="btn btn-outline-secondary move-down" title="Mover para baixo" aria-label="Mover para baixo" ${index === total - 1 ? 'disabled' : ''}><i class="bi bi-chevron-down" aria-hidden="true"></i></button><button type="button" class="btn btn-outline-danger remove-exercise" title="Remover exercício" aria-label="Remover exercício"><i class="bi bi-trash3" aria-hidden="true"></i></button></div></div>
      <div class="row g-2 mt-1"><div class="col-md-6"><label class="form-label">Nome</label><input class="form-control exercise-name" value="${escapeHtml(exercise.nome)}" required></div><div class="col-6 col-md-2"><label class="form-label">Séries</label><input class="form-control exercise-series" type="number" min="1" value="${escapeHtml(exercise.series)}" required></div><div class="col-6 col-md-2"><label class="form-label">Repetições</label><input class="form-control exercise-reps" type="number" min="1" value="${escapeHtml(exercise.repeticoes)}" required></div><div class="col-12"><label class="form-label">Comentário</label><input class="form-control exercise-comment" value="${escapeHtml(exercise.comentario)}"></div></div></div>`

  const bindExerciseActions = (day, redraw) => {
    document.querySelectorAll('.exercise-card').forEach((card, index) => {
      const item = day.exercicios[index]
      card.querySelector('.exercise-name').addEventListener('input', (e) => {
        item.nome = e.target.value
      })
      card.querySelector('.exercise-series').addEventListener('input', (e) => {
        item.series = e.target.value
      })
      card.querySelector('.exercise-reps').addEventListener('input', (e) => {
        item.repeticoes = e.target.value
      })
      card.querySelector('.exercise-comment').addEventListener('input', (e) => {
        item.comentario = e.target.value
      })
      card.querySelector('.remove-exercise').addEventListener('click', () => {
        day.exercicios.splice(index, 1)
        redraw()
      })
      card.querySelector('.move-up').addEventListener('click', () => {
        ;[day.exercicios[index - 1], day.exercicios[index]] = [
          day.exercicios[index],
          day.exercicios[index - 1]
        ]
        redraw()
      })
      card.querySelector('.move-down').addEventListener('click', () => {
        ;[day.exercicios[index + 1], day.exercicios[index]] = [
          day.exercicios[index],
          day.exercicios[index + 1]
        ]
        redraw()
      })
    })
  }

  const render = () => {
    tabs.innerHTML = workout.dias
      .map(
        (day, index) =>
          `<button type="button" class="nav-link ${index === active ? 'active' : ''}" data-day="${index}">Dia ${day.identificador}</button>`
      )
      .join('')
    const day = workout.dias[active]
    editor.innerHTML = `<div class="day-panel">
        <div class="row g-3"><div class="col-md-6"><label class="form-label">Título do dia</label><input class="form-control" id="day-title" value="${escapeHtml(day.titulo)}"></div>
        <div class="col-12"><label class="form-label">Comentário do dia</label><textarea class="form-control" id="day-comment" rows="2">${escapeHtml(day.comentario)}</textarea></div></div>
        <div class="exercise-heading-row d-flex justify-content-between align-items-center mt-4"><h2 class="mb-0"><i class="bi bi-list-check" aria-hidden="true"></i> Exercícios</h2><button class="add-exercise-button" id="add-exercise" type="button"><i class="bi bi-plus-circle" aria-hidden="true"></i> Adicionar exercício</button></div>
        <div id="exercise-list" class="mt-3">${day.exercicios.map((exercise, index) => exerciseHtml(exercise, index, day.exercicios.length)).join('')}</div>
      </div>`
    $('#day-title').addEventListener('input', (e) => (day.titulo = e.target.value))
    $('#day-comment').addEventListener(
      'input',
      (e) => (day.comentario = e.target.value)
    )
    $('#add-exercise').addEventListener('click', () => {
      day.exercicios.push({ nome: '', series: '', repeticoes: '', comentario: '' })
      render()
    })
    bindExerciseActions(day, render)
  }

  tabs.addEventListener('click', (event) => {
    if (event.target.dataset.day) {
      active = Number(event.target.dataset.day)
      render()
    }
  })
  $('#general-comment').addEventListener(
    'input',
    (event) => (workout.comentarioGeral = event.target.value)
  )
  $('#generate-workout').addEventListener('click', () => {
    const invalid = workout.dias.some((day) =>
      day.exercicios.some(
        (item) => !item.nome.trim() || !item.series || !item.repeticoes
      )
    )
    if (invalid) {
      alert('Preencha nome, séries e repetições de todos os exercícios.')
      return
    }
    generateWorkoutPdf(workout)
  })
  render()
}

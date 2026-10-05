import { escapeHtml, $, slug } from './utils.js'
import { labels } from './constants.js'

const downloadPdf = (element, filename, orientation) =>
  html2pdf()
    .set({
      margin: 0,
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation }
    })
    .from(element)
    .save()

export function generateWorkoutPdf(workout) {
  const output = $('#pdf-output')
  const days = workout.dias
    .map((day) => {
      const hasExerciseComments = day.exercicios.some((item) =>
        item.comentario.trim()
      )
      const dayComment = day.comentario.trim()
        ? `<p>${escapeHtml(day.comentario)}</p>`
        : ''
      const commentHeader = hasExerciseComments ? '<th>Comentário</th>' : ''
      const exerciseRows = day.exercicios
        .map(
          (item, i) =>
            `<tr><td>${i + 1}</td><td>${escapeHtml(item.nome)}</td><td>${escapeHtml(item.series)}</td><td>${escapeHtml(item.repeticoes)}</td>${hasExerciseComments ? `<td>${escapeHtml(item.comentario)}</td>` : ''}</tr>`
        )
        .join('')
      return `<h2>Dia ${day.identificador} — ${escapeHtml(day.titulo)}</h2>${dayComment}<table class="pdf-table"><thead><tr><th>#</th><th>Exercício</th><th>Séries</th><th>Repetições</th>${commentHeader}</tr></thead><tbody>${exerciseRows}</tbody></table>`
    })
    .join('')
  const generalComment = workout.comentarioGeral.trim()
    ? `<h2>Comentário geral</h2><p>${escapeHtml(workout.comentarioGeral)}</p>`
    : ''
  output.innerHTML = `<h2 class="pdf-preview-heading">Pré-visualização do PDF</h2><div class="pdf-preview-frame"><div class="pdf-page"><h1>Ficha de treino</h1><p><strong>Personal trainer:</strong> ${escapeHtml(workout.personal)}<br><strong>Aluno:</strong> ${escapeHtml(workout.aluno)}<br><strong>Divisão:</strong> ${workout.divisao}</p>${days}${generalComment}</div></div>`
  output.classList.add('is-preview')
  downloadPdf(
    output.querySelector('.pdf-page'),
    `PDFit-treino-${slug(workout.aluno)}.pdf`,
    'landscape'
  )
}

export function generateAssessmentPdf(data) {
  const output = $('#pdf-output')
  output.innerHTML = `<h2 class="pdf-preview-heading">Pré-visualização do PDF</h2><div class="pdf-preview-frame"><div class="pdf-page portrait"><h1>Avaliação física</h1><p><strong>Personal trainer:</strong> ${escapeHtml(data.personal)}<br><strong>Aluno:</strong> ${escapeHtml(data.aluno)}</p><table class="pdf-table"><tbody>${Object.entries(
    labels
  )
    .map(
      ([key, label]) =>
        `<tr><th>${label}</th><td>${escapeHtml(data.medidas[key]) || '<span class="blank-field"></span>'} cm</td></tr>`
    )
    .join(
      ''
    )}</tbody></table><h2>Comentário</h2><p>${escapeHtml(data.comentario) || '<span class="blank-field"></span>'}</p>${data.imagens.length ? `<h2>Imagens</h2>${data.imagens.map((image, i) => `<p><strong>Imagem ${i + 1}</strong><br><img class="pdf-image" src="${image.arquivo}" alt=""></p>`).join('')}` : ''}</div></div>`
  output.classList.add('is-preview')
  downloadPdf(
    output.querySelector('.pdf-page'),
    `PDFit-avaliacao-${slug(data.aluno)}.pdf`,
    'portrait'
  )
}

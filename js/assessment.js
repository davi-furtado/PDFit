import { labels } from './constants.js'
import { $, escapeHtml, fileToDataUrl } from './utils.js'
import { personal } from './storage.js'
import { setupTheme } from './theme.js'
import { generateAssessmentPdf } from './pdf.js'

export function initAssessment() {
  setupTheme()
  if (!personal()) {
    location.href = 'index.html'
    return
  }
  const data = {
    personal: personal(),
    aluno: '',
    medidas: {},
    comentario: '',
    imagens: []
  }
  $('#measurements').innerHTML = Object.entries(labels)
    .map(
      ([key, label]) =>
        `<div class="col-6 col-md-3"><label class="form-label" for="measure-${key}">${label}</label><input class="form-control" id="measure-${key}" inputmode="decimal" placeholder="cm"></div>`
    )
    .join('')
  for (const key of Object.keys(labels)) {
    $(`#measure-${key}`).addEventListener(
      'input',
      (e) => (data.medidas[key] = e.target.value)
    )
  }
  const renderImages = () => {
    $('#image-list').innerHTML = data.imagens
      .map(
        (image, index) =>
          `<div class="image-card"><img src="${image.arquivo}" alt="Imagem ${index + 1}"><div class="image-actions"><div class="small mb-2">${escapeHtml(image.nome)}</div><div class="btn-group btn-group-sm"><button type="button" class="btn btn-outline-secondary image-up" title="Mover para cima" aria-label="Mover para cima" ${index === 0 ? 'disabled' : ''}><i class="bi bi-chevron-up" aria-hidden="true"></i></button><button type="button" class="btn btn-outline-secondary image-down" title="Mover para baixo" aria-label="Mover para baixo" ${index === data.imagens.length - 1 ? 'disabled' : ''}><i class="bi bi-chevron-down" aria-hidden="true"></i></button><button type="button" class="btn btn-outline-danger image-remove" title="Remover imagem" aria-label="Remover imagem"><i class="bi bi-trash3" aria-hidden="true"></i></button></div></div></div>`
      )
      .join('')
    document.querySelectorAll('.image-card').forEach((card, index) => {
      card.querySelector('.image-up').addEventListener('click', () => {
        ;[data.imagens[index - 1], data.imagens[index]] = [
          data.imagens[index],
          data.imagens[index - 1]
        ]
        renderImages()
      })
      card.querySelector('.image-down').addEventListener('click', () => {
        ;[data.imagens[index + 1], data.imagens[index]] = [
          data.imagens[index],
          data.imagens[index + 1]
        ]
        renderImages()
      })
      card.querySelector('.image-remove').addEventListener('click', () => {
        data.imagens.splice(index, 1)
        renderImages()
      })
    })
  }
  $('#assessment-images').addEventListener('change', async (event) => {
    for (const file of event.target.files) {
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        alert('Somente JPG, JPEG e PNG são aceitos.')
        continue
      }
      data.imagens.push({ arquivo: await fileToDataUrl(file), nome: file.name })
    }
    event.target.value = ''
    renderImages()
  })
  $('#generate-assessment').addEventListener('click', () => {
    data.aluno = $('#assessment-student').value.trim()
    data.comentario = $('#assessment-comment').value
    if (!data.aluno) {
      $('#assessment-student').focus()
      return
    }
    generateAssessmentPdf(data)
  })
}

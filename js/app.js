;(() => {
  const keys = { personal: 'pdfit-personal', workout: 'pdfit-workout' }
  const labels = {
    ombros: 'Ombros',
    torax: 'Tórax',
    bracoDireito: 'Braço direito',
    bracoEsquerdo: 'Braço esquerdo',
    antebracoDireito: 'Antebraço direito',
    antebracoEsquerdo: 'Antebraço esquerdo',
    abdomen: 'Abdômen',
    cintura: 'Cintura',
    gluteo: 'Glúteo',
    pernaDireita: 'Perna direita',
    pernaEsquerda: 'Perna esquerda',
    panturrilhaDireita: 'Panturrilha direita',
    panturrilhaEsquerda: 'Panturrilha esquerda'
  }
  const $ = (selector) => document.querySelector(selector)
  const personal = () => sessionStorage.getItem(keys.personal) || ''
  const save = (key, value) =>
    sessionStorage.setItem(key, JSON.stringify(value))
  const load = (key) => {
    try {
      return JSON.parse(sessionStorage.getItem(key))
    } catch {
      return null
    }
  }
  const escapeHtml = (value) =>
    String(value ?? '').replace(
      /[&<>"']/g,
      (char) =>
        ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#039;'
        })[char]
    )
  const slug = (value) =>
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/gi, '-')
      .replace(/^-|-$/g, '')
  const daysFor = (split) =>
    split.split('').map((id) => ({
      identificador: id,
      titulo: '',
      comentario: '',
      exercicios: []
    }))
  const setupTheme = () => {
    const theme = localStorage.getItem('pdfit-theme') || 'dark'
    document.body.dataset.theme = theme
    document.documentElement.dataset.bsTheme = theme
    const toggle = $('#theme-toggle')
    if (!toggle) return
    toggle.innerHTML =
      theme === 'dark'
        ? '<i class="bi bi-sun" aria-hidden="true"></i>'
        : '<i class="bi bi-moon-stars" aria-hidden="true"></i>'
    toggle.setAttribute(
      'aria-label',
      theme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'
    )
    toggle.title =
      theme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'
    toggle.addEventListener('click', () => {
      const nextTheme =
        document.body.dataset.theme === 'dark' ? 'light' : 'dark'
      localStorage.setItem('pdfit-theme', nextTheme)
      document.body.dataset.theme = nextTheme
      document.documentElement.dataset.bsTheme = nextTheme
      toggle.innerHTML =
        nextTheme === 'dark'
          ? '<i class="bi bi-sun" aria-hidden="true"></i>'
          : '<i class="bi bi-moon-stars" aria-hidden="true"></i>'
      toggle.setAttribute(
        'aria-label',
        nextTheme === 'dark'
          ? 'Mudar para modo claro'
          : 'Mudar para modo escuro'
      )
      toggle.title =
        nextTheme === 'dark'
          ? 'Mudar para modo claro'
          : 'Mudar para modo escuro'
    })
  }

  function initHome() {
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

  function initNewWorkout() {
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

  function initWorkoutEditor() {
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
        <div class="d-flex justify-content-between align-items-center mt-4"><h2 class="mb-0"><i class="bi bi-list-check" aria-hidden="true"></i> Exercícios</h2><button class="add-exercise-button" id="add-exercise" type="button"><i class="bi bi-plus-circle" aria-hidden="true"></i> Adicionar exercício</button></div>
        <div id="exercise-list" class="mt-3">${day.exercicios.map((exercise, index) => exerciseHtml(exercise, index, day.exercicios.length)).join('')}</div>
      </div>`
      $('#day-title').addEventListener(
        'input',
        (e) => (day.titulo = e.target.value)
      )
      $('#day-comment').addEventListener(
        'input',
        (e) => (day.comentario = e.target.value)
      )
      $('#add-exercise').addEventListener('click', () => {
        day.exercicios.push({
          nome: '',
          series: '',
          repeticoes: '',
          comentario: ''
        })
        render()
      })
      bindExerciseActions(day, render)
    }
    const exerciseHtml = (
      exercise,
      index,
      total
    ) => `<div class="exercise-card" data-exercise="${index}">
      <div class="d-flex justify-content-between gap-2"><strong><i class="bi bi-dumbbell" aria-hidden="true"></i> Exercício ${index + 1}</strong><div class="btn-group btn-group-sm">
      <button type="button" class="btn btn-outline-secondary move-up" title="Mover para cima" aria-label="Mover para cima" ${index === 0 ? 'disabled' : ''}><i class="bi bi-chevron-up" aria-hidden="true"></i></button><button type="button" class="btn btn-outline-secondary move-down" title="Mover para baixo" aria-label="Mover para baixo" ${index === total - 1 ? 'disabled' : ''}><i class="bi bi-chevron-down" aria-hidden="true"></i></button><button type="button" class="btn btn-outline-danger remove-exercise" title="Remover exercício" aria-label="Remover exercício"><i class="bi bi-trash3" aria-hidden="true"></i></button></div></div>
      <div class="row g-2 mt-1"><div class="col-md-6"><label class="form-label">Nome</label><input class="form-control exercise-name" value="${escapeHtml(exercise.nome)}" required></div><div class="col-6 col-md-2"><label class="form-label">Séries</label><input class="form-control exercise-series" type="number" min="1" value="${escapeHtml(exercise.series)}" required></div><div class="col-6 col-md-2"><label class="form-label">Repetições</label><input class="form-control exercise-reps" type="number" min="1" value="${escapeHtml(exercise.repeticoes)}" required></div><div class="col-12"><label class="form-label">Comentário</label><input class="form-control exercise-comment" value="${escapeHtml(exercise.comentario)}"></div></div></div>`
    const bindExerciseActions = (day, redraw) => {
      document.querySelectorAll('.exercise-card').forEach((card, index) => {
        const item = day.exercicios[index]
        card
          .querySelector('.exercise-name')
          .addEventListener('input', (e) => (item.nome = e.target.value))
        card
          .querySelector('.exercise-series')
          .addEventListener('input', (e) => (item.series = e.target.value))
        card
          .querySelector('.exercise-reps')
          .addEventListener('input', (e) => (item.repeticoes = e.target.value))
        card
          .querySelector('.exercise-comment')
          .addEventListener('input', (e) => (item.comentario = e.target.value))
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

  function initAssessment() {
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
    $('#assessment-images').addEventListener('change', async (event) => {
      for (const file of event.target.files) {
        if (!['image/jpeg', 'image/png'].includes(file.type)) {
          alert('Somente JPG, JPEG e PNG são aceitos.')
          continue
        }
        data.imagens.push({
          arquivo: await fileToDataUrl(file),
          nome: file.name
        })
      }
      event.target.value = ''
      renderImages()
    })
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

  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
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
  function generateWorkoutPdf(workout) {
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
    output.innerHTML = `<h2 class="pdf-preview-heading">Pré-visualização do PDF</h2><div class="pdf-page"><h1>Ficha de treino</h1><p><strong>Personal trainer:</strong> ${escapeHtml(workout.personal)}<br><strong>Aluno:</strong> ${escapeHtml(workout.aluno)}<br><strong>Divisão:</strong> ${workout.divisao}</p>${days}${generalComment}</div>`
    output.classList.add('is-preview')
    downloadPdf(
      output.querySelector('.pdf-page'),
      `PDFit-treino-${slug(workout.aluno)}.pdf`,
      'landscape'
    )
  }
  function generateAssessmentPdf(data) {
    const output = $('#pdf-output')
    output.innerHTML = `<h2 class="pdf-preview-heading">Pré-visualização do PDF</h2><div class="pdf-page portrait"><h1>Avaliação física</h1><p><strong>Personal trainer:</strong> ${escapeHtml(data.personal)}<br><strong>Aluno:</strong> ${escapeHtml(data.aluno)}</p><table class="pdf-table"><tbody>${Object.entries(
      labels
    )
      .map(
        ([key, label]) =>
          `<tr><th>${label}</th><td>${escapeHtml(data.medidas[key]) || '<span class="blank-field"></span>'} cm</td></tr>`
      )
      .join(
        ''
      )}</tbody></table><h2>Comentário</h2><p>${escapeHtml(data.comentario) || '<span class="blank-field"></span>'}</p>${data.imagens.length ? `<h2>Imagens</h2>${data.imagens.map((image, i) => `<p><strong>Imagem ${i + 1}</strong><br><img class="pdf-image" src="${image.arquivo}" alt=""></p>`).join('')}` : ''}</div>`
    output.classList.add('is-preview')
    downloadPdf(
      output.querySelector('.pdf-page'),
      `PDFit-avaliacao-${slug(data.aluno)}.pdf`,
      'portrait'
    )
  }
  window.PDFit = {
    initHome,
    initNewWorkout,
    initWorkoutEditor,
    initAssessment,
    setupTheme
  }
})()


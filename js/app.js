import { setupTheme } from './theme.js'
import { initHome } from './home.js'
import { initNewWorkout } from './new-workout.js'
import { initWorkoutEditor } from './workout-editor.js'
import { initAssessment } from './assessment.js'

window.PDFit = {
  initHome,
  initNewWorkout,
  initWorkoutEditor,
  initAssessment,
  setupTheme
}

if (document.querySelector('#personal-form')) initHome()
if (document.querySelector('#new-workout-form')) initNewWorkout()
if (document.querySelector('#day-editor')) initWorkoutEditor()
if (document.querySelector('#assessment-form')) initAssessment()
if (document.querySelector('#theme-toggle') && document.body.id === 'body') {
  setupTheme()
}

import { keys } from './constants.js'

export const personal = () => sessionStorage.getItem(keys.personal) || ''

export const save = (key, value) =>
  sessionStorage.setItem(key, JSON.stringify(value))

export const load = (key) => {
  try {
    return JSON.parse(sessionStorage.getItem(key))
  } catch {
    return null
  }
}

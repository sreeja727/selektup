import { STORAGE_KEYS } from './constants'

const AUTH_KEY = 'authUser'

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY))
  } catch {
    return null
  }
}

export function isLoggedIn() {
  return getUser() !== null
}

export function logoutUser() {
  localStorage.removeItem(AUTH_KEY)
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
}

export function setAuthUser(user) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user))
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
  }
}

export function getAuthToken() {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
}

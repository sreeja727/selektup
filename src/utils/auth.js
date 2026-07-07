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

export function loginUser({ name, identifier }) {
  localStorage.setItem(AUTH_KEY, JSON.stringify({ name: name || identifier, identifier }))
}

export function logoutUser() {
  localStorage.removeItem(AUTH_KEY)
}

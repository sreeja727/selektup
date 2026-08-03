const ADMIN_AUTH_KEY = 'adminAuthUser'

export function getAdmin() {
  try {
    return JSON.parse(localStorage.getItem(ADMIN_AUTH_KEY))
  } catch {
    return null
  }
}

export function isAdminLoggedIn() {
  return getAdmin() !== null
}

export function logoutAdmin() {
  localStorage.removeItem(ADMIN_AUTH_KEY)
}

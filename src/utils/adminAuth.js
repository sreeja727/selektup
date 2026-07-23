const ADMIN_AUTH_KEY = 'adminAuthUser'

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@selektup.com'
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'Admin@123'

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

export function loginAdmin({ email, password }) {
  if (
    email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
    password === ADMIN_PASSWORD
  ) {
    localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify({ email: ADMIN_EMAIL }))
    return { success: true }
  }
  return { success: false, error: 'Invalid admin email or password.' }
}

export function logoutAdmin() {
  localStorage.removeItem(ADMIN_AUTH_KEY)
}

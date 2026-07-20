const AUTH_KEY = 'authUser'
const USERS_KEY = 'registeredUsers'

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || []
  } catch {
    return []
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

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

export function registerUser({ name, identifier, password }) {
  const users = getUsers()
  const exists = users.some(
    (u) => u.identifier.toLowerCase() === identifier.toLowerCase()
  )
  if (exists) {
    return { success: false, error: 'An account with this email/mobile already exists.' }
  }
  users.push({ name, identifier, password })
  saveUsers(users)
  return { success: true }
}

export function loginUser({ identifier, password }) {
  const users = getUsers()
  const user = users.find(
    (u) => u.identifier.toLowerCase() === identifier.toLowerCase()
  )
  if (!user || user.password !== password) {
    return { success: false, error: 'Invalid email/mobile or password.' }
  }
  localStorage.setItem(AUTH_KEY, JSON.stringify({ name: user.name, identifier: user.identifier }))
  return { success: true }
}

export function logoutUser() {
  localStorage.removeItem(AUTH_KEY)
}

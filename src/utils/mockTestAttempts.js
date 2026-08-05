
import { getUser } from './auth'

function storageKey(categorySlug, testSlug) {
  const user = getUser()
  const userId = user?.userId ?? 'anonymous'
  return `mocktest-attempted:${userId}:${categorySlug}:${testSlug}`
}

export function getAttemptRecord(categorySlug, testSlug) {
  try {
    const raw = localStorage.getItem(storageKey(categorySlug, testSlug))
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function hasAttemptedTest(categorySlug, testSlug) {
  return getAttemptRecord(categorySlug, testSlug) !== null
}


export function recordTestAttempt(categorySlug, testSlug, record) {
  if (hasAttemptedTest(categorySlug, testSlug)) return
  try {
    localStorage.setItem(storageKey(categorySlug, testSlug), JSON.stringify(record))
  } catch {
    // Storage full/unavailable — the submission itself already succeeded;
    // losing the local "already attempted" flag only affects re-attempt
    // gating in this browser, not the submitted data.
  }
}

const PURCHASES_KEY = 'purchasedTests'

function getAll() {
  try {
    return JSON.parse(localStorage.getItem(PURCHASES_KEY)) || []
  } catch {
    return []
  }
}

function testKey(categorySlug, testSlug) {
  return `${categorySlug}/${testSlug}`
}

export function isPurchased(categorySlug, testSlug) {
  return getAll().includes(testKey(categorySlug, testSlug))
}

export function purchaseTest(categorySlug, testSlug) {
  const all = getAll()
  const key = testKey(categorySlug, testSlug)
  if (!all.includes(key)) {
    localStorage.setItem(PURCHASES_KEY, JSON.stringify([...all, key]))
  }
}

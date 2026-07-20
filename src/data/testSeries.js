import { FaPlay, FaUserTie, FaBrain, FaDraftingCompass } from 'react-icons/fa'

const TAG_COLORS = {
  pink:   { bg: 'rgba(233,30,140,0.10)', color: '#E91E8C' },
  blue:   { bg: 'rgba(3,155,229,0.10)',  color: '#039BE5' },
  purple: { bg: 'rgba(103,58,183,0.10)', color: '#673AB7' },
  teal:   { bg: 'rgba(0,137,123,0.10)',  color: '#00897B' },
}

function makeTests(slug, count = 10) {
  return Array.from({ length: count }, (_, i) => {
    const n = i + 1
    return {
      id: `test-${n}`,
      slug: `test-${n}`,
      title: `Mock Test ${n}`,
      questions: 100,
      duration: 120,
      marks: 100,
      price: 49,
    }
  })
}

export const TEST_CATEGORIES = [
  {
    slug: 'degree-prelims',
    Icon: FaPlay,
    title: 'Degree Prelims PYQ',
    description: 'Previous year question based mock tests for degree-level PSC preliminary exams.',
    colorKey: 'pink',
    ...TAG_COLORS.pink,
    tests: makeTests('degree-prelims'),
  },
  {
    slug: 'psc-mentorship',
    Icon: FaUserTie,
    title: 'PSC Mentorship Programme',
    description: 'Structured mock tests aligned with the PSC Mentorship Programme syllabus.',
    colorKey: 'blue',
    ...TAG_COLORS.blue,
    tests: makeTests('psc-mentorship'),
  },
  {
    slug: 'ktet-psychology',
    Icon: FaBrain,
    title: 'KTET Psychology',
    description: 'Mock tests covering child psychology, learning theories, and teaching aptitude for KTET.',
    colorKey: 'purple',
    ...TAG_COLORS.purple,
    tests: makeTests('ktet-psychology'),
  },
  {
    slug: 'engineering-graphics',
    Icon: FaDraftingCompass,
    title: 'Engineering Graphics',
    description: 'Mock tests covering projections, sections, and development of surfaces for KTU students.',
    colorKey: 'teal',
    ...TAG_COLORS.teal,
    tests: makeTests('engineering-graphics'),
  },
]

export function getCategory(slug) {
  return TEST_CATEGORIES.find((c) => c.slug === slug)
}

export function getTest(categorySlug, testSlug) {
  const category = getCategory(categorySlug)
  if (!category) return null
  const test = category.tests.find((t) => t.slug === testSlug)
  if (!test) return null
  return { category, test }
}

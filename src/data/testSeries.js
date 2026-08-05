import { FaPlay, FaUserTie, FaBrain, FaDraftingCompass } from 'react-icons/fa'

const TAG_COLORS = {
  pink:   { bg: 'rgba(233,30,140,0.10)', color: '#E91E8C' },
  blue:   { bg: 'rgba(3,155,229,0.10)',  color: '#039BE5' },
  purple: { bg: 'rgba(103,58,183,0.10)', color: '#673AB7' },
  teal:   { bg: 'rgba(0,137,123,0.10)',  color: '#00897B' },
}

function makeTests(count = 10) {
  return Array.from({ length: count }, (_, i) => {
    const n = i + 1
    return {
      id: `test-${n}`,
      slug: `test-${n}`,
      title: `Mock Test ${n}`,
      questions: 100,
      duration: 120,
      marks: 100,
    }
  })
}

export const TEST_CATEGORIES = [
  {
    slug: 'degree-mains',
    Icon: FaPlay,
    title: 'Degree Mains PYQ',
    description: 'Previous year question based mock tests for degree-level PSC mains exams.',
    colorKey: 'pink',
    ...TAG_COLORS.pink,
    price: 599,
    available: true,
    features: [
      '10 Full-Length Mock Tests',
      'Previous Year Question Pattern',
      'Detailed Solutions & Explanations',
      'Unlimited Access Once Approved',
    ],
    tests: makeTests(),
  },
  {
    slug: 'psc-mentorship',
    Icon: FaUserTie,
    title: 'PSC Mentorship Programme',
    description: 'Structured mock tests aligned with the PSC Mentorship Programme syllabus.',
    colorKey: 'blue',
    ...TAG_COLORS.blue,
    price: 599,
    available: false,
    features: [
      '10 Full-Length Mock Tests',
      'Mentor-Curated Question Sets',
      'Performance Analysis',
      'Unlimited Access Once Approved',
    ],
    tests: makeTests(),
  },
  {
    slug: 'ktet-psychology',
    Icon: FaBrain,
    title: 'KTET Psychology',
    description: 'Mock tests covering child psychology, learning theories, and teaching aptitude for KTET.',
    colorKey: 'purple',
    ...TAG_COLORS.purple,
    price: 399,
    available: false,
    features: [
      '10 Full-Length Mock Tests',
      'Child Psychology & Pedagogy Focus',
      'Detailed Solutions & Explanations',
      'Unlimited Access Once Approved',
    ],
    tests: makeTests(),
  },
  {
    slug: 'engineering-graphics',
    Icon: FaDraftingCompass,
    title: 'Engineering Graphics',
    description: 'Mock tests covering projections, sections, and development of surfaces for KTU students.',
    colorKey: 'teal',
    ...TAG_COLORS.teal,
    price: 349,
    available: false,
    features: [
      '10 Full-Length Mock Tests',
      'Projections, Sections & Surfaces',
      'Detailed Solutions & Explanations',
      'Unlimited Access Once Approved',
    ],
    tests: makeTests(),
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

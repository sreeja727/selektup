import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Text, SimpleGrid, Stack, HStack, Button, Flex } from '@chakra-ui/react'
import { FaArrowRight, FaCheckCircle, FaPlay, FaUserTie, FaBrain, FaDraftingCompass, FaChevronDown, FaChevronUp } from 'react-icons/fa'

const TAG_COLORS = {
  pink:   { bg: 'rgba(233,30,140,0.09)',  color: '#E91E8C', border: 'rgba(233,30,140,0.2)' },
  blue:   { bg: 'rgba(3,155,229,0.09)',   color: '#039BE5', border: 'rgba(3,155,229,0.2)' },
  purple: { bg: 'rgba(103,58,183,0.09)',  color: '#673AB7', border: 'rgba(103,58,183,0.2)' },
  teal:   { bg: 'rgba(0,137,123,0.09)',   color: '#00897B', border: 'rgba(0,137,123,0.2)' },
}

const courses = [
  {
    tag: 'FREE • LIVE ON YOUTUBE',
    tagColor: 'pink',
    icon: FaPlay,
    iconBg: 'rgba(233,30,140,0.10)',
    iconColor: '#E91E8C',
    title: 'Degree Prelims PYQ Live Solving Sessions',
    description:
      'A live session streamed on YouTube from Monday to Friday, where expert educators solve and explain Previous Year Questions (PYQs) from degree-level PSC preliminary exams. Understand the exam pattern, important topics, and repeated questions while improving accuracy and time management.',
    price: 'Free',
    mode: 'Online',
    extra: 'Live Mon – Fri on YouTube',
    learnMore: [
      'Building a strong study plan',
      'Regular performance evaluation',
      'Doubt-clearing sessions',
      'Guidance on PYQs, mock tests, and revision strategies',
    ],
  },
  {
    tag: 'PSC MENTORSHIP',
    tagColor: 'blue',
    icon: FaUserTie,
    iconBg: 'rgba(3,155,229,0.10)',
    iconColor: '#039BE5',
    title: 'SelektUp PSC Mentorship Programme',
    description:
      'A structured guidance initiative specially designed for aspirants preparing for degree-level PSC preliminary exams. Through personalized mentorship, experienced educators provide clear direction, smart strategy, and continuous support throughout your preparation journey.',
    price: '₹16/day',
    mode: 'Online',
    extra: null,
    learnMore: [
      'A well-planned study schedule based on Degree Prelims syllabus',
      'Regular practice of Previous Year Questions (PYQs)',
      'Mock tests & performance analysis',
      'Dedicated doubt-clearing sessions',
      'Effective revision techniques and exam strategies',
    ],
  },
  {
    tag: 'KTET PREPARATION',
    tagColor: 'purple',
    icon: FaBrain,
    iconBg: 'rgba(103,58,183,0.10)',
    iconColor: '#673AB7',
    title: 'SelektUp KTET Psychology Classes',
    description:
      'Specially designed for aspirants preparing for the Kerala Teacher Eligibility Test. These classes focus on building a strong understanding of child psychology, learning theories, and teaching aptitude, helping you approach the exam with clarity and confidence.',
    price: '₹199/month',
    mode: 'Online',
    extra: null,
    learnMore: [
      'Child psychology and learning theories',
      'Concept-based teaching with practical examples',
      'Expert guidance for KTET exam clarity',
      'Continuous support throughout preparation',
    ],
  },
  {
    tag: 'KTU • CRASH COURSE',
    tagColor: 'teal',
    icon: FaDraftingCompass,
    iconBg: 'rgba(0,137,123,0.10)',
    iconColor: '#00897B',
    title: 'Engineering Graphics 6-Day Crash Course',
    description:
      'A structured 6-day crash course covering all key Engineering Graphics concepts for KTU students — from projection of points and lines to isometric and perspective projections, in a simple and structured way.',
    price: '₹5999',
    mode: 'Online',
    extra: '6-Day Intensive Programme',
    learnMore: [
      'Projection of points and lines – quadrants, true length and inclination',
      'Projection of solids – prisms, pyramids, cones, and cylinders',
      'Sections of solids – cut views and true shapes',
      'Development of surfaces – unfolding 3D objects into flat patterns',
      'Isometric and perspective projections',
    ],
  },
]

const mentorshipPoints = [
  'A well-planned study schedule based on Degree Prelims syllabus',
  'Regular practice of Previous Year Questions (PYQs)',
  'Mock tests & performance analysis',
  'Dedicated doubt-clearing sessions',
  'Effective revision techniques and exam strategies',
]

const ktetPoints = [
  'Interactive online classes',
  'Mentors with years of teaching expertise',
  'Concept-based teaching with practical examples',
  'Continuous support to make learning simple and effective',
]

const engineeringGraphicsPoints = [
  'Projection of points and lines – quadrants, true length and inclination',
  'Projection of solids – prisms, pyramids, cones, and cylinders',
  'Sections of solids – cut views and true shapes',
  'Development of surfaces – unfolding 3D objects into flat patterns',
  'Isometric and perspective projections',
]

function CourseCard({ course }) {
  const [hovered, setHovered] = useState(false)
  const [open, setOpen] = useState(false)
  const tc = TAG_COLORS[course.tagColor]

  return (
    <Box
      bg="white"
      borderRadius="2xl"
      border="2px solid"
      borderColor={hovered || open ? tc.border : 'gray.100'}
      boxShadow={hovered ? `0 16px 48px ${tc.bg}` : '0 2px 14px rgba(0,0,0,0.06)'}
      transform={hovered ? 'translateY(-6px)' : 'none'}
      transition="all 0.3s"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      overflow="hidden"
      display="flex"
      flexDirection="column"
    >
      <Box h="4px" bg={`linear-gradient(90deg, ${tc.color}, ${tc.color}88)`} />
      <Stack p={6} gap={4} flex={1}>
        <Flex justify="space-between" align="flex-start">
          <Box
            w={12} h={12}
            borderRadius="xl"
            bg={course.iconBg}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <course.icon size={22} color={course.iconColor} />
          </Box>
          <Box
            fontSize="10px"
            fontWeight={700}
            letterSpacing="0.08em"
            color={tc.color}
            bg={tc.bg}
            border="1px solid"
            borderColor={tc.border}
            px={2}
            py={1}
            borderRadius="full"
          >
            {course.tag}
          </Box>
        </Flex>

        <Stack gap={2}>
          <Text fontSize="xl" fontWeight={800} color="#1a1a2e" lineHeight="short">
            {course.title}
          </Text>
          <Text fontSize="sm" color="gray.600" lineHeight="tall">
            {course.description}
          </Text>
        </Stack>

        <Stack gap={2} flex={1}>
          <HStack gap={4} flexWrap="wrap">
            <Box px={3} py={1} bg={tc.bg} borderRadius="full">
              <Text fontSize="xs" fontWeight={700} color={tc.color}>{course.price}</Text>
            </Box>
            <Box px={3} py={1} bg="rgba(0,0,0,0.05)" borderRadius="full">
              <Text fontSize="xs" fontWeight={600} color="gray.600">{course.mode}</Text>
            </Box>
          </HStack>
          {course.extra && (
            <Text fontSize="xs" color={tc.color} fontWeight={600}>
              ✦ {course.extra}
            </Text>
          )}
        </Stack>

        {open && (
          <Box bg={tc.bg} borderRadius="xl" p={4}>
            <Text fontSize="xs" fontWeight={700} color={tc.color} textTransform="uppercase" letterSpacing="0.08em" mb={3}>
              This programme focuses on:
            </Text>
            <Stack gap={2}>
              {course.learnMore.map((point, i) => (
                <HStack key={i} gap={2} align="flex-start">
                  <Box color={tc.color} mt="2px" flexShrink={0}>
                    <FaCheckCircle size={13} />
                  </Box>
                  <Text fontSize="sm" color="#1a1a2e" fontWeight={500} lineHeight="tall">
                    {point}
                  </Text>
                </HStack>
              ))}
            </Stack>
          </Box>
        )}

        <Button
          size="sm"
          variant="ghost"
          color={tc.color}
          fontWeight={700}
          px={0}
          _hover={{ bg: 'transparent', opacity: 0.75 }}
          rightIcon={open ? <FaChevronUp size={11} /> : <FaChevronDown size={11} />}
          justifyContent="flex-start"
          transition="all 0.2s"
          onClick={() => setOpen(v => !v)}
        >
          {open ? 'Show Less' : 'Learn More'}
        </Button>
      </Stack>
    </Box>
  )
}

export default function CoursesPage() {
  const navigate = useNavigate()
  return (
    <Box>
      {/* Hero */}
      <Box
        bg="linear-gradient(135deg, #0C1222 0%, #1a0d30 50%, #0a1628 100%)"
        py={{ base: 16, md: 24 }}
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute" top="-80px" right="-80px"
          w="360px" h="360px" borderRadius="full"
          bg="rgba(233,30,140,0.12)" filter="blur(80px)"
        />
        <Box
          position="absolute" bottom="-60px" left="-60px"
          w="280px" h="280px" borderRadius="full"
          bg="rgba(3,155,229,0.12)" filter="blur(70px)"
        />
        <Container maxW="7xl" position="relative">
          <Stack align="center" gap={5} textAlign="center">
            <Box
              fontSize="11px" fontWeight={700} letterSpacing="0.14em"
              color="#E91E8C" bg="rgba(233,30,140,0.12)"
              border="1px solid rgba(233,30,140,0.25)"
              px={4} py={2} borderRadius="full"
            >
              OUR PROGRAMS
            </Box>
            <Text
              fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
              fontWeight={900} color="white" lineHeight="short"
              maxW="700px"
            >
              Courses Built Around{' '}
              <Box as="span" bg="linear-gradient(90deg,#E91E8C,#039BE5)" backgroundClip="text" color="transparent">
                Your Preparation
              </Box>
            </Text>
            <Text fontSize={{ base: 'md', md: 'lg' }} color="rgba(255,255,255,0.65)" maxW="560px" lineHeight="tall">
              Focused programmes designed to guide PSC, KTET, and KTU aspirants — from free live sessions to intensive crash courses.
            </Text>
          </Stack>
        </Container>
      </Box>

      {/* Course Cards */}
      <Box bg="#F8F9FA" py={{ base: 14, md: 20 }}>
        <Container maxW="7xl">
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={7}>
            {courses.map((course, i) => (
              <CourseCard key={i} course={course} />
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* PSC Mentorship Programme */}
      <Box bg="white" py={{ base: 14, md: 20 }}>
        <Container maxW="7xl">
          <Flex gap={12} direction={{ base: 'column', lg: 'row' }} align="center">
            <Stack gap={6} flex={1}>
              <Stack gap={3}>
                <Box
                  fontSize="11px" fontWeight={700} letterSpacing="0.12em"
                  color="#039BE5" bg="rgba(3,155,229,0.08)"
                  border="1px solid rgba(3,155,229,0.2)"
                  px={3} py={1} borderRadius="full" alignSelf="flex-start"
                >
                  PSC MENTORSHIP PROGRAMME
                </Box>
                <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight={900} color="#1a1a2e" lineHeight="short">
                  SelektUp PSC{' '}
                  <Box as="span" color="#039BE5">Mentorship Programme</Box>
                </Text>
              </Stack>
              <Text fontSize="md" color="gray.600" lineHeight="tall">
                The SelektUp PSC Mentorship Programme is a structured guidance initiative specially designed for aspirants preparing for degree-level PSC preliminary exams. Through personalized mentorship, experienced educators provide clear direction, smart strategy, and continuous support throughout your preparation journey.
              </Text>
              <HStack gap={3} flexWrap="wrap">
                <Box px={4} py={2} bg="rgba(3,155,229,0.09)" borderRadius="full">
                  <Text fontSize="sm" fontWeight={700} color="#039BE5">₹16/day</Text>
                </Box>
                <Box px={4} py={2} bg="rgba(0,0,0,0.05)" borderRadius="full">
                  <Text fontSize="sm" fontWeight={600} color="gray.600">Online</Text>
                </Box>
              </HStack>
              <Button
                alignSelf="flex-start"
                size="md"
                bg="linear-gradient(135deg, #039BE5, #0277BD)"
                color="white"
                fontWeight={700}
                borderRadius="xl"
                px={7}
                rightIcon={<FaArrowRight />}
                _hover={{ transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(3,155,229,0.35)' }}
                transition="all 0.25s"
                onClick={() => navigate('/contact')}
              >
               For Enquiry
              </Button>
            </Stack>

            <Box
              flex={1}
              bg="linear-gradient(135deg, #f0f8ff 0%, #e8f4ff 100%)"
              borderRadius="2xl"
              border="2px solid rgba(3,155,229,0.15)"
              p={8}
            >
              <Text fontSize="sm" fontWeight={700} color="gray.500" letterSpacing="0.08em" mb={5}>
                THIS PROGRAMME FOCUSES ON
              </Text>
              <Stack gap={4}>
                {mentorshipPoints.map((point, i) => (
                  <HStack key={i} gap={3} align="flex-start">
                    <Box color="#039BE5" mt="2px" flexShrink={0}>
                      <FaCheckCircle size={16} />
                    </Box>
                    <Text fontSize="sm" color="#1a1a2e" fontWeight={500} lineHeight="tall">
                      {point}
                    </Text>
                  </HStack>
                ))}
              </Stack>
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* KTET Psychology Classes */}
      <Box
        bg="linear-gradient(135deg, #0C1222 0%, #0a1628 100%)"
        py={{ base: 14, md: 20 }}
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute" top="-60px" right="10%"
          w="300px" h="300px" borderRadius="full"
          bg="rgba(103,58,183,0.12)" filter="blur(70px)"
        />
        <Box
          position="absolute" bottom="-60px" left="5%"
          w="260px" h="260px" borderRadius="full"
          bg="rgba(233,30,140,0.10)" filter="blur(60px)"
        />
        <Container maxW="7xl" position="relative">
          <Flex gap={12} direction={{ base: 'column', lg: 'row' }} align="center">
            <Stack gap={6} flex={1}>
              <Stack gap={3}>
                <Box
                  fontSize="11px" fontWeight={700} letterSpacing="0.12em"
                  color="#b39ddb" bg="rgba(103,58,183,0.15)"
                  border="1px solid rgba(103,58,183,0.3)"
                  px={3} py={1} borderRadius="full" alignSelf="flex-start"
                >
                  KTET PREPARATION
                </Box>
                <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight={900} color="white" lineHeight="short">
                  SelektUp KTET{' '}
                  <Box as="span" color="#b39ddb">Psychology Classes</Box>
                </Text>
              </Stack>
              <Text fontSize="md" color="rgba(255,255,255,0.65)" lineHeight="tall">
                The SelektUp KTET Psychology Classes are specially designed for aspirants preparing for the Kerala Teacher Eligibility Test. These classes focus on building a strong understanding of child psychology, learning theories, and teaching aptitude, helping you approach the exam with clarity and confidence.
              </Text>
              <Text fontSize="md" color="rgba(255,255,255,0.55)" lineHeight="tall">
                Through expert guidance, educators provide concept-based teaching, practical examples, and continuous support to make learning simple and effective.
              </Text>
              <HStack gap={3} flexWrap="wrap">
                <Box px={4} py={2} bg="rgba(103,58,183,0.18)" borderRadius="full">
                  <Text fontSize="sm" fontWeight={700} color="#b39ddb">₹199/month</Text>
                </Box>
                <Box px={4} py={2} bg="rgba(255,255,255,0.08)" borderRadius="full">
                  <Text fontSize="sm" fontWeight={600} color="rgba(255,255,255,0.65)">Online</Text>
                </Box>
              </HStack>
              <Button
                alignSelf="flex-start"
                size="md"
                bg="linear-gradient(135deg, #673AB7, #512DA8)"
                color="white"
                fontWeight={700}
                borderRadius="xl"
                px={7}
                rightIcon={<FaArrowRight />}
                _hover={{ transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(103,58,183,0.4)' }}
                transition="all 0.25s"
                onClick={() => navigate('/contact')}
              >
                For Enquiry
              </Button>
            </Stack>

            <Box
              flex={1}
              bg="rgba(255,255,255,0.05)"
              backdropFilter="blur(10px)"
              borderRadius="2xl"
              border="1px solid rgba(103,58,183,0.25)"
              p={8}
            >
              <Text fontSize="sm" fontWeight={700} color="rgba(255,255,255,0.5)" letterSpacing="0.08em" mb={5}>
                WE PROVIDE
              </Text>
              <Stack gap={4}>
                {ktetPoints.map((item, i) => (
                  <HStack key={i} gap={3} align="flex-start">
                    <Box color="#b39ddb" mt="2px" flexShrink={0}>
                      <FaCheckCircle size={16} />
                    </Box>
                    <Text fontSize="sm" color="rgba(255,255,255,0.80)" fontWeight={500} lineHeight="tall">
                      {item}
                    </Text>
                  </HStack>
                ))}
              </Stack>
              <Box mt={6} pt={5} borderTop="1px solid rgba(255,255,255,0.08)">
                <Text fontSize="xs" color="rgba(255,255,255,0.4)" lineHeight="tall">
                  Live online classes · Expert faculty · Concept-based teaching · Regular mock tests with feedback
                </Text>
              </Box>
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* Engineering Graphics Crash Course */}
      <Box bg="white" py={{ base: 14, md: 20 }}>
        <Container maxW="7xl">
          <Flex gap={12} direction={{ base: 'column', lg: 'row' }} align="center">
            <Stack gap={6} flex={1}>
              <Stack gap={3}>
                <Box
                  fontSize="11px" fontWeight={700} letterSpacing="0.12em"
                  color="#00897B" bg="rgba(0,137,123,0.08)"
                  border="1px solid rgba(0,137,123,0.2)"
                  px={3} py={1} borderRadius="full" alignSelf="flex-start"
                >
                  KTU • CRASH COURSE
                </Box>
                <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight={900} color="#1a1a2e" lineHeight="short">
                  Engineering Graphics{' '}
                  <Box as="span" color="#00897B">6-Day Crash Course</Box>
                </Text>
              </Stack>
              <Text fontSize="md" color="gray.600" lineHeight="tall">
                This crash course covers all key concepts in a simple and structured way. You will learn projection of points and lines, including locating points in different quadrants and finding true length and inclination. The course also focuses on projection of solids such as prisms, pyramids, cones, and cylinders in various positions. Sections of solids help you understand cut views and true shapes, while development of surfaces teaches how to unfold 3D objects into flat patterns. Isometric and perspective projections will help you visualize and draw realistic 3D representations from 2D views.
              </Text>
              <HStack gap={3} flexWrap="wrap">
                <Box px={4} py={2} bg="rgba(0,137,123,0.09)" borderRadius="full">
                  <Text fontSize="sm" fontWeight={700} color="#00897B">₹5999</Text>
                </Box>
                <Box px={4} py={2} bg="rgba(0,0,0,0.05)" borderRadius="full">
                  <Text fontSize="sm" fontWeight={600} color="gray.600">Online</Text>
                </Box>
                <Box px={4} py={2} bg="rgba(0,137,123,0.06)" borderRadius="full">
                  <Text fontSize="sm" fontWeight={600} color="#00897B">6-Day Intensive</Text>
                </Box>
              </HStack>
              <Button
                alignSelf="flex-start"
                size="md"
                bg="linear-gradient(135deg, #00897B, #00695C)"
                color="white"
                fontWeight={700}
                borderRadius="xl"
                px={7}
                rightIcon={<FaArrowRight />}
                _hover={{ transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,137,123,0.35)' }}
                transition="all 0.25s"
                onClick={() => navigate('/contact')}
              >
               For Enquiry
              </Button>
            </Stack>

            <Box
              flex={1}
              bg="linear-gradient(135deg, #f0faf9 0%, #e6f6f4 100%)"
              borderRadius="2xl"
              border="2px solid rgba(0,137,123,0.15)"
              p={8}
            >
              <Text fontSize="sm" fontWeight={700} color="gray.500" letterSpacing="0.08em" mb={5}>
                THIS COURSE COVERS
              </Text>
              <Stack gap={4}>
                {engineeringGraphicsPoints.map((point, i) => (
                  <HStack key={i} gap={3} align="flex-start">
                    <Box color="#00897B" mt="2px" flexShrink={0}>
                      <FaCheckCircle size={16} />
                    </Box>
                    <Text fontSize="sm" color="#1a1a2e" fontWeight={500} lineHeight="tall">
                      {point}
                    </Text>
                  </HStack>
                ))}
              </Stack>
            </Box>
          </Flex>
        </Container>
      </Box>
    </Box>
  )
}


import { useState } from 'react'
import { Box, Container, SimpleGrid, VStack, HStack, Text, Heading } from '@chakra-ui/react'
import { FaPlay, FaUserTie, FaBrain, FaDraftingCompass, FaCheckCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa'

const COURSES = [
  {
    Icon: FaPlay,
    title: 'Degree Prelims PYQ Live Solving Sessions',
    sub: 'Live on YouTube • Mon – Fri',
    desc: 'Expert educators solve and explain Previous Year Questions from degree-level PSC preliminary exams, streamed live on YouTube. Understand exam patterns, important topics, and improve accuracy through detailed explanations.',
    price: 'Free',
    mode: 'Online',
    iconBg: 'rgba(233,30,140,0.1)',
    iconColor: '#E91E8C',
    accentColor: '#E91E8C',
    learnMore: [
      'Building a strong study plan',
      'Regular performance evaluation',
      'Doubt-clearing sessions',
      'Guidance on PYQs, mock tests, and revision strategies',
    ],
  },
  {
    Icon: FaUserTie,
    title: 'SelektUp PSC Mentorship Programme',
    sub: 'Structured Guidance for PSC Aspirants',
    desc: 'A structured guidance initiative for degree-level PSC preliminary exam aspirants. Experienced educators provide clear direction, smart strategy, and continuous support throughout your preparation journey.',
    price: '₹16/day',
    mode: 'Online',
    iconBg: 'rgba(3,155,229,0.1)',
    iconColor: '#039BE5',
    accentColor: '#039BE5',
    learnMore: [
      'A well-planned study schedule based on Degree Prelims syllabus',
      'Regular practice of Previous Year Questions (PYQs)',
      'Mock tests & performance analysis',
      'Dedicated doubt-clearing sessions',
      'Effective revision techniques and exam strategies',
    ],
  },
  {
    Icon: FaBrain,
    title: 'SelektUp KTET Psychology Classes',
    sub: 'KTET Preparation',
    desc: 'Specially designed classes for Kerala Teacher Eligibility Test aspirants. Build a strong understanding of child psychology, learning theories, and teaching aptitude with clarity and confidence.',
    price: '₹199/month',
    mode: 'Online',
    iconBg: 'rgba(103,58,183,0.1)',
    iconColor: '#673AB7',
    accentColor: '#673AB7',
    learnMore: [
      'Child psychology and learning theories',
      'Concept-based teaching with practical examples',
      'Expert guidance for KTET exam clarity',
      'Continuous support throughout preparation',
    ],
  },
  {
    Icon: FaDraftingCompass,
    title: 'Engineering Graphics 6-Day Crash Course',
    sub: 'For KTU Students',
    desc: 'A structured 6-day crash course covering all key Engineering Graphics concepts for KTU students — from projection of points and lines to isometric and perspective projections.',
    price: '₹5999',
    mode: 'Online',
    iconBg: 'rgba(0,137,123,0.1)',
    iconColor: '#00897B',
    accentColor: '#00897B',
    learnMore: [
      'Projection of points and lines – quadrants, true length and inclination',
      'Projection of solids – prisms, pyramids, cones, and cylinders',
      'Sections of solids – cut views and true shapes',
      'Development of surfaces – unfolding 3D objects into flat patterns',
      'Isometric and perspective projections',
    ],
  },
]

function CourseCard({ c }) {
  const [open, setOpen] = useState(false)

  return (
    <Box
      bg="white"
      borderRadius="2xl"
      p={8}
      boxShadow="0 2px 14px rgba(0,0,0,0.06)"
      border="2px solid"
      borderColor={open ? c.accentColor : 'transparent'}
      position="relative"
      overflow="hidden"
      transition="all 0.3s"
      _hover={{
        boxShadow: `0 14px 40px rgba(0,0,0,0.10)`,
        transform: 'translateY(-4px)',
        borderColor: c.accentColor,
      }}
      display="flex"
      flexDirection="column"
    >
      <Box
        w={14} h={14}
        borderRadius="xl"
        bg={c.iconBg}
        display="flex"
        alignItems="center"
        justifyContent="center"
        color={c.iconColor}
        mb={5}
      >
        <c.Icon size={26} />
      </Box>

      <VStack align="flex-start" gap={3} flex={1}>
        <Box>
          <Text fontSize="10px" fontWeight={700} color="gray.400" textTransform="uppercase" letterSpacing="0.1em">
            {c.sub}
          </Text>
          <Heading fontSize="lg" fontWeight={800} color="#0C1222" mt={1} lineHeight="short">
            {c.title}
          </Heading>
        </Box>

        <Text fontSize="sm" color="gray.600" lineHeight={1.75}>{c.desc}</Text>

        <HStack gap={2} flexWrap="wrap">
          <Box px={3} py={1} bg={`${c.iconBg}`} borderRadius="full">
            <Text fontSize="xs" fontWeight={700} color={c.accentColor}>{c.price}</Text>
          </Box>
          <Box px={3} py={1} bg="rgba(0,0,0,0.05)" borderRadius="full">
            <Text fontSize="xs" fontWeight={600} color="gray.600">{c.mode}</Text>
          </Box>
        </HStack>

        {open && (
          <Box
            w="full"
            bg={`${c.iconBg}`}
            borderRadius="xl"
            p={4}
            mt={1}
          >
            <Text fontSize="xs" fontWeight={700} color={c.accentColor} textTransform="uppercase" letterSpacing="0.08em" mb={3}>
              This programme focuses on:
            </Text>
            <VStack align="flex-start" gap={2}>
              {c.learnMore.map((point, i) => (
                <HStack key={i} gap={2} align="flex-start">
                  <Box color={c.accentColor} mt="2px" flexShrink={0}>
                    <FaCheckCircle size={12} />
                  </Box>
                  <Text fontSize="sm" color="#1a1a2e" fontWeight={500} lineHeight="tall">
                    {point}
                  </Text>
                </HStack>
              ))}
            </VStack>
          </Box>
        )}

        <Box
          as="button"
          bg="transparent"
          border="none"
          color={c.accentColor}
          fontSize="sm"
          fontWeight={700}
          cursor="pointer"
          p={0}
          mt={1}
          display="flex"
          alignItems="center"
          gap={1}
          onClick={() => setOpen(v => !v)}
          _hover={{ opacity: 0.75 }}
          transition="opacity 0.2s"
        >
          {open ? 'Show Less' : 'Learn More'}
          <Box ml={1}>{open ? <FaChevronUp size={11} /> : <FaChevronDown size={11} />}</Box>
        </Box>
      </VStack>
    </Box>
  )
}

export default function CoursesSection() {
  return (
    <Box py={{ base: 16, md: 24 }} bg="#F8F9FA" id="courses">
      <Container maxW="7xl">
        <VStack gap={4} mb={14} textAlign="center">
          <Text color="#039BE5" fontWeight={700} fontSize="xs" letterSpacing="0.12em" textTransform="uppercase">
            Our Programs
          </Text>
          <Heading fontSize={{ base: '2xl', md: '4xl' }} fontWeight={800} color="#0C1222">
            Courses
          </Heading>
          <Text color="gray.600" maxW="580px" fontSize={{ base: 'md', md: 'lg' }} lineHeight={1.7}>
            Focused programmes designed to guide every PSC and KTET aspirant toward success.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={8}>
          {COURSES.map((c, i) => (
            <CourseCard key={i} c={c} />
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  )
}

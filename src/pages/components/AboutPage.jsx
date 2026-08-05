import { Box, Container, Flex, Heading, Text, VStack, HStack, SimpleGrid, } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { FaCheckCircle, FaBullseye, FaLaptop, FaUserTie, FaBookOpen, FaClipboardList, FaVideo, FaComments, } from 'react-icons/fa'

const OFFERINGS = [
  { icon: FaLaptop, title: 'Live Interactive Classes', text: 'Live classes led by experienced educators, designed to keep you engaged and on track.' },
  { icon: FaUserTie, title: 'Small Batch Sizes', text: 'Limited batch sizes to ensure every learner receives focused, personalised attention.' },
  { icon: FaClipboardList, title: 'Detailed Feedback', text: 'In-depth feedback on tests and written work so you always know where to improve.' },
  { icon: FaComments, title: 'Personal Mentorship', text: 'Strategic planning and subject guidance tailored entirely to your goals and learning pace.' },
  { icon: FaBookOpen, title: 'Original Study Materials', text: 'Carefully prepared study materials created exclusively by our expert faculty.' },
  { icon: FaVideo, title: 'Recorded Classes', text: 'Every session is recorded so you can revise at your own pace, anytime, anywhere.' },
]

function SectionTag({ children }) {
  return (
    <Text
      display="inline-block"
      color="#039BE5"
      fontWeight={700}
      fontSize="xs"
      letterSpacing="0.14em"
      textTransform="uppercase"
      mb={3}
    >
      {children}
    </Text>
  )
}

function AccentHeading({ children }) {
  return (
    <Heading fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }} fontWeight={800} color="#0C1222" lineHeight={1.25} mb={5}>
      {children}
    </Heading>
  )
}

export default function AboutPage() {
  return (
    <Box bg="white" minH="100vh">

      {/* Hero banner */}
      <Box
        bg="linear-gradient(135deg, #0C1222 0%, #0d2045 60%, #0a3060 100%)"
        py={{ base: 16, md: 24 }}
        position="relative"
        overflow="hidden"
      >
        <Box position="absolute" top="-60px" right="-60px" w="300px" h="300px" borderRadius="full"
          border="2px solid rgba(233,30,140,0.18)" />
        <Box position="absolute" bottom="-80px" left="-80px" w="340px" h="340px" borderRadius="full"
          border="2px solid rgba(3,155,229,0.15)" />
        <Box position="absolute" top="30%" right="15%" w="120px" h="120px" borderRadius="full"
          bg="rgba(233,30,140,0.07)" />

        <Container maxW="7xl" position="relative" zIndex={1}>
          <VStack gap={4} textAlign="center" color="white">
            <Text fontSize="xs" fontWeight={800} letterSpacing="0.18em" textTransform="uppercase" color="#E91E8C">
              Selektup
            </Text>
            <Heading fontSize={{ base: '3xl', md: '5xl' }} fontWeight={900} lineHeight={1.15}>
              Curated by{' '}
              <Box as="span" color="#E91E8C">Intelligence</Box>
            </Heading>
          </VStack>
        </Container>
      </Box>

      {/* Who We Are */}
      <Box py={{ base: 14, md: 20 }} bg="white">
        <Container maxW="7xl">
          <Flex gap={{ base: 10, lg: 20 }} align="center" flexDir={{ base: 'column', lg: 'row' }}>
            {/* Team video */}
            <Box flex="0 0 auto" w={{ base: 'full', lg: '620px' }} borderRadius="2xl" overflow="hidden" boxShadow="0 12px 40px rgba(0,0,0,0.12)">
              <video
                src="/teamvdeo.mp4"
                autoPlay
                loop
                muted
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </Box>

            {/* Text */}
            <VStack align="flex-start" flex={1} gap={5}>
              <SectionTag>Who We Are</SectionTag>
              <AccentHeading>
                Guidance That{' '}
                <Box as="span" color="#E91E8C">Goes Beyond the Classroom</Box>
              </AccentHeading>
              <Text color="gray.600" lineHeight={1.9} fontSize="md">
                SelektUp Learning Academy is built with a clear purpose to provide learners with meaningful guidance, structured learning, and dedicated mentorship that truly makes a difference.
              </Text>
              <Text color="gray.600" lineHeight={1.9} fontSize="md">
                Every course, every resource, and every session is thoughtfully designed to support your journey, helping you grow with clarity and confidence. We focus on combining strong subject expertise with a personalized, learner-first approach so that your progress feels guided, focused, and effective.
              </Text>
              <Box
                bg="pink.50"
                borderLeft="4px solid #E91E8C"
                borderRadius="md"
                px={5}
                py={4}
              >
                <Text color="#0C1222" fontWeight={700} fontSize="md" fontStyle="italic">
                  "SelektUp is driven by a simple belief: every serious learner deserves the right guidance to succeed."
                </Text>
              </Box>
            </VStack>
          </Flex>
        </Container>
      </Box>

      <Box borderTop="1px solid" borderColor="gray.100" />

      {/* Our Belief */}
      <Box py={{ base: 14, md: 20 }} bg="gray.50">
        <Container maxW="7xl">
          <VStack gap={3} textAlign="center" mb={12}>
            <SectionTag>Our Belief</SectionTag>
            <AccentHeading>
              Success Needs Direction,{' '}
              <Box as="span" color="#E91E8C">Not Just Information</Box>
            </AccentHeading>
          </VStack>

          <Flex gap={{ base: 8, lg: 16 }} align="center" flexDir={{ base: 'column', lg: 'row' }}>
            <Box flex={1}>
              <Text color="gray.600" lineHeight={1.9} fontSize="md" mb={5}>
                Success is not achieved through information alone. It demands discipline, clarity of thought, consistent practice, and the ability to perform under pressure.
              </Text>
              <Text color="gray.600" lineHeight={1.9} fontSize="md">
                At SelektUp, we believe meaningful progress comes from the right guidance at the right time. When learners are supported by mentors who closely track progress, identify gaps early, and provide clear direction, preparation becomes more focused, confident, and effective.
                This is the foundation SelektUp is built on a system where mentorship transforms effort into outcomes.
              </Text>
            </Box>

            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5} flex={1}>
              {[
                { label: 'Discipline', color: '#E91E8C' },
                { label: 'Critical Thinking', color: '#039BE5' },
                { label: 'Structured Learning', color: '#039BE5' },
                { label: 'Close Mentorship', color: '#E91E8C' },
              ].map(({ label, color }) => (
                <HStack key={label} gap={3} bg="white" p={4} borderRadius="xl"
                  boxShadow="0 2px 12px rgba(0,0,0,0.06)" align="center">
                  <Box color={color} flexShrink={0}>
                    <FaCheckCircle size={18} />
                  </Box>
                  <Text fontWeight={700} color="#0C1222" fontSize="sm">{label}</Text>
                </HStack>
              ))}
            </SimpleGrid>
          </Flex>
        </Container>
      </Box>

      {/* What We Offer */}
      <Box py={{ base: 14, md: 20 }} bg="white">
        <Container maxW="7xl">
          <VStack gap={3} textAlign="center" mb={12}>
            <SectionTag>What We Offer</SectionTag>
            <AccentHeading>
              A Fully Online Academy{' '}
              <Box as="span" color="#E91E8C">Designed for You</Box>
            </AccentHeading>
            <Text maxW="600px" color="gray.500" lineHeight={1.8}>
              We bring quality learning directly to students, no matter where they are.
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={6}>
            {OFFERINGS.map(({ icon, title, text }, i) => {
              const OfferingIcon = icon
              return (
                <Box key={i} bg="gray.50" borderRadius="2xl" p={6}
                  border="1px solid" borderColor="gray.100"
                  transition="all 0.25s"
                  _hover={{ boxShadow: '0 8px 28px rgba(233,30,140,0.12)', borderColor: 'pink.200', transform: 'translateY(-3px)' }}
                >
                  <Flex
                    w={12} h={12} borderRadius="xl"
                    bg="linear-gradient(135deg, #E91E8C22, #E91E8C11)"
                    align="center" justify="center" mb={4}
                  >
                    <Box color="#E91E8C"><OfferingIcon size={20} /></Box>
                  </Flex>
                  <Text color="#0C1222" fontSize="md" fontWeight={700} mb={2}>{title}</Text>
                  <Text color="gray.500" fontSize="sm" lineHeight={1.75}>{text}</Text>
                </Box>
              )
            })}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Why Now */}
      <Box py={{ base: 14, md: 20 }} bg="linear-gradient(135deg, #0C1222 0%, #0d2045 100%)">
        <Container maxW="7xl">
          <Flex gap={{ base: 10, lg: 16 }} flexDir={{ base: 'column', lg: 'row' }} align="center">
            <VStack align="flex-start" flex={1} gap={5} color="white">
              <Text color="#E91E8C" fontWeight={700} fontSize="xs" letterSpacing="0.14em" textTransform="uppercase">
                Why Now
              </Text>
              <Heading fontSize={{ base: '2xl', md: '3xl' }} fontWeight={800} lineHeight={1.25}>
                A New Institution with{' '}
                <Box as="span" color="#E91E8C">Proven Guidance</Box>
              </Heading>
              <Text color="rgba(255,255,255,0.75)" lineHeight={1.9} fontSize="md">
                Being a young academy allows us to stay focused on what matters most - students.
                Our early batches will never be treated as numbers. They will receive direct faculty
                involvement, close monitoring, and a stronger learning connection than what crowded
                systems often provide.
              </Text>
              <Text color="rgba(255,255,255,0.75)" lineHeight={1.9} fontSize="md">
                The success of our students will shape the future of Selektup, and we take that
                responsibility seriously.
              </Text>
            </VStack>

            <Box flex={1}>
              <Box bg="rgba(255,255,255,0.06)" borderRadius="2xl" p={{ base: 6, md: 8 }} border="1px solid rgba(255,255,255,0.1)">
                <Box color="#E91E8C" mb={4}><FaBullseye size={36} /></Box>
                <Heading fontSize="xl" fontWeight={800} color="white" mb={4}>Our Promise</Heading>
                <VStack align="flex-start" gap={4}>
                  {[
                    'We will never rely on exaggerated claims or inflated results.',
                    'Honesty, consistency, and quality teaching always.',
                    'Dedicated mentorship for every student who joins us.',
                    'We will show up prepared, committed, and ready to guide you.',
                  ].map((point, i) => (
                    <HStack key={i} gap={3} align="flex-start">
                      <Box color="#E91E8C" mt="3px" flexShrink={0}><FaCheckCircle size={14} /></Box>
                      <Text color="rgba(255,255,255,0.8)" fontSize="sm" lineHeight={1.75}>{point}</Text>
                    </HStack>
                  ))}
                </VStack>
              </Box>
            </Box>
          </Flex>
        </Container>
      </Box>

    </Box>
  )
}

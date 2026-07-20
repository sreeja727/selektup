import { Box, Container, SimpleGrid, VStack, Text, Heading } from '@chakra-ui/react'
import { FaChalkboardTeacher, FaPlayCircle, FaBookOpen, FaClipboardList, FaUserFriends, FaChartBar } from 'react-icons/fa'

const REASONS = [
  {
    Icon: FaChalkboardTeacher,
    title: 'Expert Faculty',
    desc: `Our faculty consists of experienced educators who have deep subject knowledge and a clear understanding of exam patterns. They simplify complex topics, focus on conceptual clarity, and teach with strategies that are proven to work in competitive exams.`,
    iconColor: '#E91E8C',
    hoverBorder: '#E91E8C',
  },
  {
    Icon: FaPlayCircle,
    title: 'Recorded Classes',
    desc: `Access well-structured recorded classes anytime, allowing you to learn at your own pace. You can revise difficult topics multiple times and never miss any important session.`,
    iconColor: '#039BE5',
    hoverBorder: '#039BE5',
  },
  {
    Icon: FaBookOpen,
    title: 'Carefully Crafted Materials',
    desc: `Our study materials are specially designed by experts, covering the syllabus in a clear and concise manner. They are regularly updated to match the latest trends and help you focus only on what truly matters.`,
    iconColor: '#E91E8C',
    hoverBorder: '#E91E8C',
  },
  {
    Icon: FaClipboardList,
    title: 'PYQ Discussion Programs',
    desc: `We conduct detailed discussions of Previous Year Questions to help you understand the nature of questions, important topics, and repeated patterns. This enables you to approach the exam with better accuracy and confidence.`,
    iconColor: '#039BE5',
    hoverBorder: '#039BE5',
  },
  {
    Icon: FaUserFriends,
    title: 'Dedicated Mentor Support',
    desc: `Every student receives personalized mentorship. From planning your study schedule to clearing doubts and keeping you motivated, our mentors guide you at every step and ensure you never feel lost in your preparation journey.`,
    iconColor: '#E91E8C',
    hoverBorder: '#E91E8C',
  },
  {
    Icon: FaChartBar,
    title: 'Progress Tracking & Feedback',
    desc: `We provide regular tests, performance analysis, and detailed feedback. This helps you identify your strengths and weaknesses, improve consistently, and stay exam-ready at all times.`,
    iconColor: '#039BE5',
    hoverBorder: '#039BE5',
  },
]

export default function WhyChooseUs() {
  return (
    <Box
      py={{ base: 11, md: 20 }}
      background="linear-gradient(160deg, #f9fbff 0%, #fdf4fb 45%, #f0f8ff 100%)"
      position="relative"
      overflow="hidden"
    >
      {/* Decorative glow blobs */}
      <Box
        position="absolute"
        top="-120px"
        right="-120px"
        w="500px"
        h="500px"
        borderRadius="full"
        background="radial-gradient(circle, #E91E8C18 0%, transparent 65%)"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="-120px"
        left="-120px"
        w="500px"
        h="500px"
        borderRadius="full"
        background="radial-gradient(circle, #039BE518 0%, transparent 65%)"
        pointerEvents="none"
      />

      <Container maxW="7xl" position="relative">
        {/* Section header */}
        <VStack gap={4} mb={16} textAlign="center">
          <Box
            display="inline-flex"
            alignItems="center"
            gap={2}
            px={5}
            py={2}
            borderRadius="full"
            background="linear-gradient(135deg, #E91E8C12, #039BE512)"
            border="1.5px solid #E91E8C28"
          >
            <Box w="7px" h="7px" borderRadius="full" bg="#E91E8C" flexShrink={0} />
            <Text color="#E91E8C" fontWeight={700} fontSize="xs" letterSpacing="0.14em" textTransform="uppercase">
              Why SeleKtUp
            </Text>
          </Box>

          <Heading
            fontSize={{ base: '2xl', md: '4xl' }}
            fontWeight={800}
            color="#0C1222"
            lineHeight={1.2}
          >
            What Sets Us{' '}
            <Box
              as="span"
              style={{
                background: 'linear-gradient(135deg, #E91E8C, #039BE5)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Apart
            </Box>
          </Heading>

          <Text color="gray.600" maxW="620px" fontSize={{ base: 'md', md: 'lg' }} lineHeight={1.7}>
            We focus on delivering real results through structured guidance, expert teaching, and continuous support. Our system is designed to help you build strong concepts, stay consistent, and achieve success with confidence.
          </Text>
        </VStack>

        {/* Cards grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
          {REASONS.map((r, i) => (
            <Box
              key={i}
              position="relative"
              borderRadius="2xl"
              bg="white"
              border="1.5px solid"
              borderColor="gray.100"
              boxShadow="0 2px 16px rgba(0,0,0,0.06)"
              overflow="hidden"
              transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              _hover={{
                borderColor: `${r.hoverBorder}50`,
                boxShadow: `0 20px 50px ${r.hoverBorder}22`,
                transform: 'translateY(-6px)',
              }}
            >
              {/* Top accent bar */}
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                h="3px"
                background={`linear-gradient(90deg, ${r.iconColor}, ${r.iconColor}55)`}
              />

              <VStack align="flex-start" gap={5} p={7} pt={8}>
                {/* Icon + number row */}
                <Box display="flex" alignItems="center" justifyContent="space-between" w="full">
                  <Box
                    w={12}
                    h={12}
                    borderRadius="xl"
                    background={`linear-gradient(135deg, ${r.iconColor}22, ${r.iconColor}0a)`}
                    border="1.5px solid"
                    borderColor={`${r.iconColor}30`}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    color={r.iconColor}
                    flexShrink={0}
                    transition="transform 0.3s"
                    _groupHover={{ transform: 'scale(1.1)' }}
                  >
                    <r.Icon size={20} />
                  </Box>
                  <Text
                    fontSize="3xl"
                    fontWeight={800}
                    color="gray.100"
                    lineHeight={1}
                    userSelect="none"
                  >
                    0{i + 1}
                  </Text>
                </Box>

                <VStack align="flex-start" gap={2}>
                  <Heading fontSize="lg" fontWeight={700} color="#0C1222">{r.title}</Heading>
                  <Text fontSize="sm" color="gray.500" lineHeight={1.8}>{r.desc}</Text>
                </VStack>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  )
}

import { useState } from 'react'
import { Box, Flex, Image, VStack, Text, Heading, Container, Dialog, Portal, CloseButton } from '@chakra-ui/react'
import { FaQuoteLeft } from 'react-icons/fa'

const STORY_PARAGRAPHS = [
  'SelektUp was born from a shared vision among a group of dedicated UPSC educators who had successfully cleared various stages of the UPSC examination and secured positions in multiple PSC rank lists. Having experienced the challenges of competitive exam preparation firsthand, they understood what aspirants truly need to succeed.',
  'They believed that preparation should not be limited by confusion, lack of direction, or high costs. Their goal was simple yet powerful  to create a platform where every student could access the right strategy, expert mentorship, and years of valuable experience in an affordable and structured way.',
  'What began as a focused initiative for competitive exam preparation soon evolved into a broader vision. SelektUp aims to support learners across diverse competitive fields while also nurturing the skills, mindset, and clarity required to excel at different stages of life.',
  'As we grow, our commitment is to continuously expand  introducing new courses, learning experiences, and opportunities that empower learners beyond traditional exam boundaries.',
  'They discussed, they planned, and they dreamed of building something meaningful  something that could guide aspirants with clarity and confidence.',
]

const CLOSING_QUOTE =
  'SelektUp was created as a platform to share knowledge, simplify preparation, and empower every learner — not just to succeed in exams, but to grow, evolve, and achieve success in every path they choose.'

export default function AboutSection() {
  const [storyOpen, setStoryOpen] = useState(false)
  return (
    <Box py={{ base: 16, md: 24 }} bg="white">
      <Container maxW="7xl">
        <Flex gap={{ base: 10, lg: 20 }} align="center" flexDir={{ base: 'column', lg: 'row' }}>
          {/* Team photo */}
          <Box flex={1} w="full">
            <Image
              src="/teams.jpeg"
              alt="SelektUp team"
              borderRadius="2xl"
              w="full"
              objectFit="cover"
              boxShadow="0 12px 40px rgba(0,0,0,0.12)"
            />
          </Box>

          {/* Text block */}
          <VStack align="flex-start" flex={1} gap={6}>
            <Box>
              <Text color="#039BE5" fontWeight={700} fontSize="xs" letterSpacing="0.12em" textTransform="uppercase" mb={3}>
                About SeleKtUp
              </Text>
              <Heading fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }} fontWeight={800} color="#039BE5" lineHeight={1.2}>
                SelektUp:{' '}
                <Box as="span" color="#E91E8C">A Smarter Approach to Competitive Excellence</Box>
              </Heading>
            </Box>

            <Text color="gray.600" lineHeight={1.85} fontSize="md">
              SelektUp is a modern Ed-Tech platform built with the vision of making competitive exam preparation simple, smart, and accessible for every learner. We combine innovative digital tools, expert-driven content, and data-driven insights to create a future-ready learning ecosystem.

              At SelektUp, we understand that today's students need more than just study material they need clarity, direction, and consistency. Our platform is designed to provide a structured learning environment that adapts to evolving exam trends and changing patterns.
            </Text>

            <Text color="gray.600" lineHeight={1.85} fontSize="md">
              We focus on helping learners stay updated, organized, and confident throughout their preparation journey, empowering them to achieve their academic and career goals.
            </Text>

            <Box pt={2}>
              <Box
                as="button"
                px={7}
                py={3}
                bg="transparent"
                color="#E91E8C"
                fontSize="sm"
                fontWeight={700}
                borderRadius="lg"
                border="2px solid #E91E8C"
                cursor="pointer"
                transition="all 0.25s"
                _hover={{ bg: '#E91E8C', color: 'white', transform: 'translateY(-2px)', boxShadow: '0 6px 18px rgba(3,155,229,0.35)' }}
                onClick={() => setStoryOpen(true)}
              >
                Our Story
              </Box>
            </Box>
          </VStack>
        </Flex>
      </Container>

      {/* ── Attractive Story Modal ── */}
      <Dialog.Root open={storyOpen} onOpenChange={(e) => setStoryOpen(e.open)} scrollBehavior="inside">
        <Portal>
          <Dialog.Backdrop bg="rgba(12,18,34,0.75)" backdropFilter="blur(6px)" />
          <Dialog.Positioner p={{ base: 4, md: 8 }}>
            <Dialog.Content
              borderRadius="2xl"
              overflow="hidden"
              maxW="660px"
              w="full"
              boxShadow="0 32px 80px rgba(12,18,34,0.4)"
            >
              {/* ── Hero Banner ── */}
              <Box
                bg="linear-gradient(135deg, #0C1222 0%, #1a3a6b 50%, #039BE5 100%)"
                px={{ base: 6, md: 10 }}
                pt={10}
                pb={9}
                position="relative"
                overflow="hidden"
              >
                {/* decorative blobs */}
                <Box position="absolute" top="-30px" right="-30px" w="140px" h="140px" borderRadius="full" bg="rgba(233,30,140,0.18)" />
                <Box position="absolute" bottom="-20px" left="25%" w="100px" h="100px" borderRadius="full" border="2px solid rgba(255,255,255,0.08)" />
                <Box position="absolute" top="40%" left="-20px" w="60px" h="60px" borderRadius="full" bg="rgba(3,155,229,0.2)" />

                <Dialog.CloseTrigger asChild position="absolute" top={4} right={4} zIndex={2}>
                  <CloseButton
                    size="sm"
                    color="rgba(255,255,255,0.7)"
                    _hover={{ color: 'white', bg: 'rgba(255,255,255,0.12)' }}
                  />
                </Dialog.CloseTrigger>

                {/* pill label */}
                <Box
                  display="inline-flex"
                  alignItems="center"
                  px={3}
                  py="5px"
                  bg="rgba(233,30,140,0.18)"
                  border="1px solid rgba(233,30,140,0.4)"
                  borderRadius="full"
                  mb={4}
                >
                  <Text fontSize="10px" color="#E91E8C" fontWeight={800} letterSpacing="0.14em" textTransform="uppercase">
                    Our Journey
                  </Text>
                </Box>

                <Dialog.Title>
                  <Heading fontSize={{ base: '2xl', md: '3xl' }} fontWeight={900} color="white" lineHeight={1.15}>
                    The Story Behind{' '}
                    <Box as="span" color="#E91E8C">SelektUp</Box>
                  </Heading>
                </Dialog.Title>

                <Text color="rgba(255,255,255,0.6)" fontSize="sm" mt={3} lineHeight={1.6} position="relative" zIndex={1}>
                  From a shared dream to a platform that empowers every learner.
                </Text>
              </Box>

              {/* ── Story Body ── */}
              <Dialog.Body px={{ base: 6, md: 10 }} pt={8} pb={2} overflowY="auto" maxH="60vh" bg="white">
                <VStack align="stretch" gap={5}>
                  {STORY_PARAGRAPHS.map((para, i) => (
                    <Text key={i} color="gray.600" lineHeight={1.95} fontSize="sm">
                      {para}
                    </Text>
                  ))}
                </VStack>

                {/* ── Divider ── */}
                <Flex align="center" gap={4} my={7}>
                  <Box flex={1} h="1px" bg="linear-gradient(to right, transparent, #E91E8C55)" />
                  <Text fontSize="10px" fontWeight={800} color="#E91E8C" letterSpacing="0.14em" textTransform="uppercase" whiteSpace="nowrap">
                    That dream eventually took shape
                  </Text>
                  <Box flex={1} h="1px" bg="linear-gradient(to left, transparent, #039BE555)" />
                </Flex>

                {/* ── Closing Quote ── */}
                <Box
                  mb={8}
                  p={6}
                  borderRadius="xl"
                  bg="linear-gradient(135deg, rgba(233,30,140,0.05) 0%, rgba(3,155,229,0.05) 100%)"
                  border="1px solid"
                  borderColor="rgba(233,30,140,0.18)"
                  position="relative"
                >
                  <Box color="#E91E8C" mb={3} opacity={0.7}>
                    <FaQuoteLeft size={18} />
                  </Box>
                  <Text color="#0C1222" fontSize="sm" fontWeight={600} lineHeight={1.9} fontStyle="italic">
                    {CLOSING_QUOTE}
                  </Text>
                  <Box
                    position="absolute"
                    bottom={4}
                    right={5}
                    w="8px"
                    h="8px"
                    borderRadius="full"
                    bg="linear-gradient(135deg, #E91E8C, #039BE5)"
                    opacity={0.5}
                  />
                </Box>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Box>
  )
}

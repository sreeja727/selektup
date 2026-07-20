import { Link as RouterLink, useParams, Navigate } from 'react-router-dom'
import { Box, Container, Stack, HStack, Text, Heading, Button, SimpleGrid } from '@chakra-ui/react'
import { FaArrowLeft, FaClipboardList, FaClock, FaStar, FaPlayCircle, FaExclamationTriangle } from 'react-icons/fa'
import { getTest } from '../../data/testSeries'
import { isLoggedIn } from '../../utils/auth'
import { isPurchased } from '../../utils/purchases'

function InfoTile({ tile }) {
  return (
    <Stack
      gap={2}
      align="center"
      textAlign="center"
      bg="white"
      borderRadius="xl"
      border="1px solid"
      borderColor="gray.100"
      p={5}
    >
      <Box color={tile.color}>
        <tile.Icon size={20} />
      </Box>
      <Text fontSize="xl" fontWeight={800} color="#0C1222">{tile.value}</Text>
      <Text fontSize="xs" color="gray.500" fontWeight={600} textTransform="uppercase" letterSpacing="0.06em">
        {tile.label}
      </Text>
    </Stack>
  )
}

export default function TestDetailPage() {
  const { categorySlug, testSlug } = useParams()
  const result = getTest(categorySlug, testSlug)

  if (!result) return <Navigate to="/test-series" replace />
  const { category, test } = result

  if (!isLoggedIn()) {
    return <Navigate to={`/login?redirect=/test-series/${categorySlug}/${testSlug}`} replace />
  }
  if (!isPurchased(categorySlug, testSlug)) {
    return <Navigate to={`/checkout/${categorySlug}/${testSlug}`} replace />
  }

  return (
    <Box bg="#F8F9FA" minH="70vh" py={{ base: 12, md: 16 }}>
      <Container maxW="4xl">
        <Stack gap={8}>
          <HStack
            as={RouterLink}
            to={`/test-series/${category.slug}`}
            gap={2}
            color="gray.500"
            fontSize="sm"
            fontWeight={600}
            _hover={{ color: category.color, textDecoration: 'none' }}
            w="fit-content"
          >
            <FaArrowLeft size={12} />
            <Text>{category.title}</Text>
          </HStack>

          <Box bg="white" borderRadius="2xl" border="1px solid" borderColor="gray.100" boxShadow="0 2px 14px rgba(0,0,0,0.06)" p={{ base: 6, md: 10 }}>
            <Stack gap={6}>
              <HStack gap={4}>
                <Box
                  w={14} h={14}
                  borderRadius="xl"
                  bg={category.bg}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color={category.color}
                >
                  <category.Icon size={26} />
                </Box>
                <Stack gap={1}>
                  <Text fontSize="xs" fontWeight={700} color={category.color} textTransform="uppercase" letterSpacing="0.08em">
                    {category.title}
                  </Text>
                  <Heading fontSize={{ base: 'xl', md: '2xl' }} fontWeight={900} color="#0C1222">
                    {test.title}
                  </Heading>
                </Stack>
              </HStack>

              <SimpleGrid columns={{ base: 3 }} gap={4}>
                <InfoTile tile={{ Icon: FaClipboardList, label: 'Questions', value: test.questions, color: category.color }} />
                <InfoTile tile={{ Icon: FaClock, label: 'Minutes', value: test.duration, color: category.color }} />
                <InfoTile tile={{ Icon: FaStar, label: 'Marks', value: test.marks, color: category.color }} />
              </SimpleGrid>

              <HStack
                bg="rgba(230,81,0,0.08)"
                border="1px solid"
                borderColor="rgba(230,81,0,0.25)"
                borderRadius="lg"
                p={4}
                gap={3}
                align="flex-start"
              >
                <Box color="#E65100" mt={0.5}>
                  <FaExclamationTriangle size={16} />
                </Box>
                <Text fontSize="sm" color="#7A3C00" fontWeight={500}>
                  Once you start the test, it must be completed in one sitting. Leaving the test screen,
                  navigating back, or closing the tab will automatically end and submit your test.
                </Text>
              </HStack>

              <Button
                size="lg"
                bg={category.color}
                color="white"
                fontWeight={700}
                borderRadius="xl"
                _hover={{ opacity: 0.9, transform: 'translateY(-2px)' }}
                transition="all 0.2s"
              >
                <FaPlayCircle />
                Start Test
              </Button>

              <Text fontSize="xs" color="gray.400" textAlign="center">
                Test-taking coming soon.
              </Text>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}

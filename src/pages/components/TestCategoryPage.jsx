import { Link as RouterLink, useParams, useNavigate, Navigate } from 'react-router-dom'
import { Box, Container, Stack, HStack, Text, Heading, Button } from '@chakra-ui/react'
import { FaArrowLeft, FaClipboardList, FaClock, FaPlayCircle, FaLock } from 'react-icons/fa'
import { getCategory } from '../../data/testSeries'
import { isLoggedIn } from '../../utils/auth'
import { isPurchased } from '../../utils/purchases'

export default function TestCategoryPage() {
  const { categorySlug } = useParams()
  const category = getCategory(categorySlug)
  const navigate = useNavigate()

  if (!category) return <Navigate to="/test-series" replace />

  function goToTest(test) {
    const path = `/test-series/${category.slug}/${test.slug}`
    if (!isPurchased(category.slug, test.slug)) {
      return
    } else if (!isLoggedIn()) {
      navigate(`/login?redirect=${path}`)
    } else {
      navigate(path)
    }
  }

  return (
    <Box>
      <Box bg="linear-gradient(135deg, #0C1222 0%, #0a1628 100%)" py={{ base: 12, md: 16 }}>
        <Container maxW="7xl">
          <Stack gap={4}>
            <HStack
              as={RouterLink}
              to="/test-series"
              gap={2}
              color="rgba(255,255,255,0.65)"
              fontSize="sm"
              fontWeight={600}
              _hover={{ color: 'white', textDecoration: 'none' }}
              w="fit-content"
            >
              <FaArrowLeft size={12} />
              <Text>All Categories</Text>
            </HStack>
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
                <Heading fontSize={{ base: 'xl', md: '2xl' }} fontWeight={900} color="white">
                  {category.title}
                </Heading>
                <Text fontSize="sm" color="rgba(255,255,255,0.6)">
                  {category.tests.length} Mock Tests
                </Text>
              </Stack>
            </HStack>
          </Stack>
        </Container>
      </Box>

      <Box bg="#F8F9FA" py={{ base: 12, md: 16 }}>
        <Container maxW="7xl">
          <Stack gap={4}>
            {category.tests.map((test) => {
              // Payment gateway isn't integrated yet, so nothing is ever truly
              // unlocked here regardless of stale local purchase data.
              const unlocked = false
              return (
                <HStack
                  key={test.slug}
                  onClick={() => goToTest(test)}
                  justify="space-between"
                  align="center"
                  bg="white"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="gray.100"
                  boxShadow="0 2px 10px rgba(0,0,0,0.04)"
                  p={{ base: 4, md: 6 }}
                  cursor="pointer"
                  transition="all 0.2s"
                  _hover={{
                    borderColor: category.color,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                    transform: 'translateY(-2px)',
                  }}
                >
                  <Stack gap={1}>
                    <HStack gap={2}>
                      <Text fontWeight={700} color="#0C1222">
                        {test.title}
                      </Text>
                      {!unlocked && (
                        <Box color="gray.400">
                          <FaLock size={11} />
                        </Box>
                      )}
                    </HStack>
                    <HStack gap={4} color="gray.500" fontSize="xs">
                      <HStack gap={1}>
                        <FaClipboardList size={11} />
                        <Text>{test.questions} Questions</Text>
                      </HStack>
                      <HStack gap={1}>
                        <FaClock size={11} />
                        <Text>{test.duration} Minutes</Text>
                      </HStack>
                    </HStack>
                  </Stack>

                  <Button
                    size="sm"
                    bg={category.color}
                    color="white"
                    _hover={{ opacity: 0.9 }}
                  >
                    {unlocked ? <FaPlayCircle /> : <FaLock size={12} />}
                    {unlocked ? 'Start' : 'Unlock'}
                  </Button>
                </HStack>
              )
            })}
          </Stack>
        </Container>
      </Box>
    </Box>
  )
}

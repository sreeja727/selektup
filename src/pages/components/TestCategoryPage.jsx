import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link as RouterLink, useParams, useNavigate, Navigate } from 'react-router-dom'
import { Box, Container, Stack, HStack, Text, Heading, Button, SimpleGrid, Badge } from '@chakra-ui/react'
import {
  FaArrowLeft, FaClipboardList, FaBookOpen, FaLock, FaStar, FaPlayCircle,
  FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaSyncAlt, FaEnvelope,
} from 'react-icons/fa'
import { isLoggedIn } from '../../utils/auth'
import { fetchTestCategories, fetchTestCategoryDetail, requestCategoryAccess } from '../actions'
import {
  getTestCategories, getTestCategoriesLoading,
  getTestCategoryDetail, getTestCategoryDetailLoading,
  getRequestCategoryAccessLoading,
} from '../selectors'
import { ACCESS_STATUS } from '../constants'
import Loader from '../../components/Loader'

const CATEGORY_COLOR = '#E91E8C'

function InfoChip({ tile }) {
  return (
    <Stack gap={1} align="center" textAlign="center" bg="white" borderRadius="xl" border="1px solid" borderColor="gray.100" p={4}>
      <Box color={tile.color}><tile.Icon size={16} /></Box>
      <Text fontSize="md" fontWeight={800} color="#0C1222">{tile.value}</Text>
      <Text fontSize="2xs" color="gray.500" fontWeight={600} textTransform="uppercase" letterSpacing="0.06em">{tile.label}</Text>
    </Stack>
  )
}

function AccessPanel({ price, status, justSubmitted, requestLoading, detailLoading, onRequest, onRefresh }) {
  if (status === ACCESS_STATUS.APPROVED) {
    return (
      <HStack bg="rgba(34,197,94,0.08)" border="1px solid" borderColor="rgba(34,197,94,0.3)" borderRadius="xl" p={5} gap={3}>
        <Box color="#22C55E"><FaCheckCircle size={20} /></Box>
        <Stack gap={0}>
          <Text fontWeight={700} color="#0C1222">Access Approved</Text>
          <Text fontSize="sm" color="gray.600">Every mock test in this category is unlocked. Good luck!</Text>
        </Stack>
      </HStack>
    )
  }

  if (status === ACCESS_STATUS.PENDING) {
    return (
      <Stack gap={4} bg="white" borderRadius="2xl" border="1px solid" borderColor="gray.100" boxShadow="0 2px 14px rgba(0,0,0,0.06)" p={{ base: 6, md: 8 }} align="center" textAlign="center">
        <Box color="#E65100"><FaHourglassHalf size={32} /></Box>
        <Heading fontSize="lg" fontWeight={900} color="#0C1222">
          {justSubmitted ? 'Request Submitted Successfully' : 'Access Pending'}
        </Heading>
        <Badge colorPalette="orange" rounded="md" px={3} py={1}>Pending Approval</Badge>
        <Text color="gray.600" fontSize="sm" maxW="480px">
          {justSubmitted
            ? 'Your request has been sent successfully. Our admin will verify your payment and approve access. Please check again later.'
            : 'Your request is under verification. Please wait until the admin approves it.'}
        </Text>
        <HStack gap={3}>
          <Button size="sm" variant="outline" onClick={onRefresh} loading={detailLoading}>
            <FaSyncAlt size={12} /> Refresh Status
          </Button>
          {justSubmitted && (
            <Button as={RouterLink} to="/test-series" size="sm" bg={CATEGORY_COLOR} color="white" _hover={{ opacity: 0.9 }}>
              Back to Categories
            </Button>
          )}
        </HStack>
      </Stack>
    )
  }

  if (status === ACCESS_STATUS.REJECTED) {
    return (
      <Stack gap={4} bg="white" borderRadius="2xl" border="1px solid" borderColor="gray.100" boxShadow="0 2px 14px rgba(0,0,0,0.06)" p={{ base: 6, md: 8 }} align="center" textAlign="center">
        <Box color="#DC2626"><FaTimesCircle size={32} /></Box>
        <Heading fontSize="lg" fontWeight={900} color="#0C1222">Access Rejected</Heading>
        <Text color="gray.600" fontSize="sm" maxW="480px">
          Your request could not be approved. Please contact the administrator.
        </Text>
        <HStack gap={3}>
          <Button as="a" href="mailto:selektup@gmail.com" size="sm" variant="outline">
            <FaEnvelope size={12} /> Contact Admin
          </Button>
          <Button size="sm" bg={CATEGORY_COLOR} color="white" _hover={{ opacity: 0.9 }} onClick={onRequest} loading={requestLoading}>
            Request Again
          </Button>
        </HStack>
      </Stack>
    )
  }

  // NOT_REQUESTED (or not yet known)
  return (
    <Stack gap={4} bg="white" borderRadius="2xl" border="1px solid" borderColor="gray.100" boxShadow="0 2px 14px rgba(0,0,0,0.06)" p={{ base: 6, md: 8 }} align="center" textAlign="center">
      <Box color="gray.400"><FaLock size={28} /></Box>
      <Heading fontSize="lg" fontWeight={900} color="#0C1222">Category Locked</Heading>
      <Text color="gray.600" fontSize="sm" maxW="480px">
        This category requires approval before attending mock tests.
      </Text>
      <Text fontWeight={900} fontSize="2xl" color={CATEGORY_COLOR}>₹{price}</Text>
      <Button size="lg" bg={CATEGORY_COLOR} color="white" fontWeight={700} borderRadius="xl" _hover={{ opacity: 0.9 }} onClick={onRequest} loading={requestLoading}>
        <FaLock size={12} /> Request Category Access
      </Button>
    </Stack>
  )
}

export default function TestCategoryPage() {
  const { categoryId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const loggedIn = isLoggedIn()

  const categories = useSelector(getTestCategories)
  const categoriesLoading = useSelector(getTestCategoriesLoading)
  const detail = useSelector(getTestCategoryDetail)
  const detailLoading = useSelector(getTestCategoryDetailLoading)
  const requestLoading = useSelector(getRequestCategoryAccessLoading)
  const [justSubmitted, setJustSubmitted] = useState(false)

  useEffect(() => {
    dispatch(fetchTestCategories())
  }, [dispatch])

  useEffect(() => {
    if (loggedIn && categoryId) {
      dispatch(fetchTestCategoryDetail(categoryId))
    }
  }, [dispatch, categoryId, loggedIn])

  const category = useMemo(
    () => categories.find((c) => String(c.id) === categoryId),
    [categories, categoryId]
  )

  const detailMatches = detail && String(detail.id) === categoryId
  const status = detailMatches ? detail.accessStatus : undefined
  const tests = detailMatches ? (detail.tests || []) : []
  const unlocked = status === ACCESS_STATUS.APPROVED

  if (categoriesLoading && !category) return <Loader fullScreen />
  if (!categoriesLoading && !category) return <Navigate to="/test-series" replace />

  function handleRequest() {
    setJustSubmitted(true)
    dispatch(requestCategoryAccess(categoryId))
  }

  function handleRefresh() {
    dispatch(fetchTestCategoryDetail(categoryId))
  }

  return (
    <Box>
      <Box bg="linear-gradient(135deg, #0C1222 0%, #0a1628 100%)" py={{ base: 12, md: 16 }}>
        <Container maxW="7xl">
          <Stack gap={5}>
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
            <HStack gap={4} align="flex-start">
              <Box
                w={14} h={14}
                borderRadius="xl"
                bg="rgba(233,30,140,0.10)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color={CATEGORY_COLOR}
                flexShrink={0}
              >
                <FaBookOpen size={26} />
              </Box>
              <Stack gap={2}>
                <Heading fontSize={{ base: 'xl', md: '2xl' }} fontWeight={900} color="white">
                  {category.title}
                </Heading>
                <Text fontSize="sm" color="rgba(255,255,255,0.65)" maxW="640px" lineHeight="tall">
                  {category.description}
                </Text>
              </Stack>
            </HStack>
          </Stack>
        </Container>
      </Box>

      <Box bg="#F8F9FA" py={{ base: 12, md: 16 }}>
        <Container maxW="7xl">
          <Stack gap={8}>
            <SimpleGrid columns={{ base: 2, md: 3 }} gap={4}>
              <InfoChip tile={{ Icon: FaStar, label: 'Price', value: `₹${category.price}`, color: CATEGORY_COLOR }} />
              <InfoChip tile={{ Icon: FaClipboardList, label: 'Total Tests', value: category.totalTests, color: CATEGORY_COLOR }} />
              <InfoChip
                tile={{
                  Icon: unlocked ? FaCheckCircle : FaLock,
                  label: 'Access',
                  value: unlocked ? 'Unlocked' : 'Locked',
                  color: unlocked ? '#22C55E' : 'gray.500',
                }}
              />
            </SimpleGrid>

            {loggedIn ? (
              <AccessPanel
                price={category.price}
                status={status}
                justSubmitted={justSubmitted}
                requestLoading={requestLoading}
                detailLoading={detailLoading}
                onRequest={handleRequest}
                onRefresh={handleRefresh}
              />
            ) : (
              <HStack bg="rgba(3,155,229,0.08)" border="1px solid" borderColor="rgba(3,155,229,0.25)" borderRadius="xl" p={5} gap={3} justify="space-between" flexWrap="wrap">
                <HStack gap={3}>
                  <Box color="#039BE5"><FaLock size={18} /></Box>
                  <Text fontSize="sm" color="#0C1222" fontWeight={500}>
                    Login to check your access status for this category.
                  </Text>
                </HStack>
                <Button
                  as={RouterLink}
                  to={`/login?redirect=/test-series/${categoryId}`}
                  size="sm"
                  bg="#039BE5"
                  color="white"
                  _hover={{ bg: '#0277BD' }}
                >
                  Login
                </Button>
              </HStack>
            )}

            <Stack gap={4}>
              <Heading fontSize="md" fontWeight={800} color="#0C1222">Mock Tests</Heading>

              {/* Real per-test titles need the authed detail call, and the backend
                  only returns the real tests[] once access is approved — until
                  then (or while it's still loading), show locked placeholder rows
                  using the public totalTests count so the list still reads as
                  "10 tests, locked" instead of looking empty. */}
              {detailMatches && tests.length > 0 ? tests.map((test) => (
                <HStack
                  key={test.id}
                  justify="space-between"
                  align="center"
                  bg="white"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="gray.100"
                  boxShadow="0 2px 10px rgba(0,0,0,0.04)"
                  p={{ base: 4, md: 6 }}
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
                        <Text>{test.questionCount} Questions</Text>
                      </HStack>
                    </HStack>
                  </Stack>

                  {unlocked ? (
                    <Button
                      size="sm"
                      bg={CATEGORY_COLOR}
                      color="white"
                      _hover={{ opacity: 0.9 }}
                      onClick={() => navigate(`/test-series/${categoryId}/${test.id}`)}
                    >
                      <FaPlayCircle size={12} />
                      Start
                    </Button>
                  ) : (
                    <Button size="sm" bg="gray.200" color="gray.500" disabled>
                      Locked
                    </Button>
                  )}
                </HStack>
              )) : Array.from({ length: category.totalTests || 0 }, (_, i) => (
                <HStack
                  key={i}
                  justify="space-between"
                  align="center"
                  bg="white"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="gray.100"
                  boxShadow="0 2px 10px rgba(0,0,0,0.04)"
                  p={{ base: 4, md: 6 }}
                  opacity={0.75}
                >
                  <HStack gap={2}>
                    <Text fontWeight={700} color="#0C1222">
                      Mock Test {i + 1}
                    </Text>
                    <Box color="gray.400">
                      <FaLock size={11} />
                    </Box>
                  </HStack>

                  <Button size="sm" bg="gray.200" color="gray.500" disabled>
                    Locked
                  </Button>
                </HStack>
              ))}

              {(category.totalTests || 0) === 0 && (
                <Text color="gray.500" fontSize="sm">No mock tests published in this category yet.</Text>
              )}
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  )
}

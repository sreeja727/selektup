import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link as RouterLink } from 'react-router-dom'
import { Box, Container, SimpleGrid, Stack, HStack, Text, Heading } from '@chakra-ui/react'
import { FaArrowRight, FaClipboardList, FaBookOpen } from 'react-icons/fa'
import { fetchTestCategories } from '../actions'
import { getTestCategories, getTestCategoriesLoading } from '../selectors'
import Loader from '../../components/Loader'

const PALETTE = [
  { bg: 'rgba(233,30,140,0.10)', color: '#E91E8C' },
  { bg: 'rgba(3,155,229,0.10)', color: '#039BE5' },
  { bg: 'rgba(103,58,183,0.10)', color: '#673AB7' },
  { bg: 'rgba(0,137,123,0.10)', color: '#00897B' },
]

function CategoryCard({ category }) {
  const { bg, color } = PALETTE[category.id % PALETTE.length]

  return (
    <Box
      as={RouterLink}
      to={`/test-series/${category.id}`}
      bg="white"
      borderRadius="2xl"
      p={7}
      border="2px solid transparent"
      boxShadow="0 2px 14px rgba(0,0,0,0.06)"
      transition="all 0.25s"
      display="block"
      position="relative"
      _hover={{
        textDecoration: 'none',
        transform: 'translateY(-4px)',
        boxShadow: '0 14px 40px rgba(0,0,0,0.10)',
        borderColor: color,
      }}
    >
      <Stack gap={4}>
        <Box
          w={14} h={14}
          borderRadius="xl"
          bg={bg}
          display="flex"
          alignItems="center"
          justifyContent="center"
          color={color}
        >
          <FaBookOpen size={26} />
        </Box>

        <Stack gap={1}>
          <Heading fontSize="lg" fontWeight={800} color="#0C1222">
            {category.title}
          </Heading>
          <Text fontSize="sm" color="gray.600" lineHeight={1.7}>
            {category.description}
          </Text>
        </Stack>

        <HStack justify="space-between" pt={2} borderTop="1px solid" borderColor="gray.100">
          <HStack gap={2} color="gray.500">
            <FaClipboardList size={13} />
            <Text fontSize="xs" fontWeight={600}>{category.totalTests} Tests</Text>
          </HStack>
          <Text fontSize="sm" fontWeight={800} color="#0C1222">₹{category.price}</Text>
        </HStack>

        <HStack
          justify="center"
          gap={2}
          bg={bg}
          color={color}
          borderRadius="lg"
          py={2}
          fontSize="xs"
          fontWeight={700}
        >
          <Text>View Category</Text>
          <FaArrowRight size={11} />
        </HStack>
      </Stack>
    </Box>
  )
}

export default function TestSeriesPage() {
  const dispatch = useDispatch()
  const categories = useSelector(getTestCategories)
  const loading = useSelector(getTestCategoriesLoading)

  useEffect(() => {
    dispatch(fetchTestCategories())
  }, [dispatch])

  return (
    <Box>
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
              TEST SERIES
            </Box>
            <Text
              fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
              fontWeight={900} color="white" lineHeight="short"
              maxW="700px"
            >
              Practice With{' '}
              <Box as="span" bg="linear-gradient(90deg,#E91E8C,#039BE5)" backgroundClip="text" color="transparent">
                Mock Test Series
              </Box>
            </Text>
            <Text fontSize={{ base: 'md', md: 'lg' }} color="rgba(255,255,255,0.65)" maxW="560px" lineHeight="tall">
              Choose a category to access mock tests designed to match your exam pattern.
            </Text>
          </Stack>
        </Container>
      </Box>

      <Box bg="#F8F9FA" py={{ base: 14, md: 20 }}>
        <Container maxW="7xl">
          {loading && categories.length === 0 ? (
            <Loader />
          ) : categories.length === 0 ? (
            <Text textAlign="center" color="gray.500">No test categories available yet.</Text>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={7}>
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </SimpleGrid>
          )}
        </Container>
      </Box>
    </Box>
  )
}

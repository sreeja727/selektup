import { Link as RouterLink } from 'react-router-dom'
import { Box, Container, SimpleGrid, Stack, HStack, Text, Heading, Badge } from '@chakra-ui/react'
import { FaArrowRight, FaClipboardList } from 'react-icons/fa'
import { TEST_CATEGORIES } from '../../data/testSeries'

function CategoryCard({ category }) {
  const available = category.available !== false

  return (
    <Box
      as={available ? RouterLink : 'div'}
      to={available ? `/test-series/${category.slug}` : undefined}
      bg="white"
      borderRadius="2xl"
      p={7}
      border="2px solid transparent"
      boxShadow="0 2px 14px rgba(0,0,0,0.06)"
      transition="all 0.25s"
      display="block"
      position="relative"
      opacity={available ? 1 : 0.6}
      cursor={available ? 'pointer' : 'not-allowed'}
      _hover={available ? {
        textDecoration: 'none',
        transform: 'translateY(-4px)',
        boxShadow: '0 14px 40px rgba(0,0,0,0.10)',
        borderColor: category.color,
      } : undefined}
    >
      {!available && (
        <Badge
          position="absolute"
          top={4}
          right={4}
          colorPalette="gray"
          bg="gray.100"
          color="gray.600"
          fontWeight={700}
          fontSize="2xs"
          px={2.5}
          py={1}
          borderRadius="full"
        >
          Coming Soon
        </Badge>
      )}

      <Stack gap={4}>
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
            <Text fontSize="xs" fontWeight={600}>{category.tests.length} Tests</Text>
          </HStack>
          <Text fontSize="sm" fontWeight={800} color="#0C1222">₹{category.price}</Text>
        </HStack>

        {available ? (
          <HStack
            justify="center"
            gap={2}
            bg={category.bg}
            color={category.color}
            borderRadius="lg"
            py={2}
            fontSize="xs"
            fontWeight={700}
          >
            <Text>View Category</Text>
            <FaArrowRight size={11} />
          </HStack>
        ) : (
          <HStack
            justify="center"
            gap={2}
            bg="gray.100"
            color="gray.500"
            borderRadius="lg"
            py={2}
            fontSize="xs"
            fontWeight={700}
          >
            <Text>Coming Soon</Text>
          </HStack>
        )}
      </Stack>
    </Box>
  )
}

export default function TestSeriesPage() {
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
              Choose a category to access 10 mock tests designed to match your exam pattern.
            </Text>
          </Stack>
        </Container>
      </Box>

      <Box bg="#F8F9FA" py={{ base: 14, md: 20 }}>
        <Container maxW="7xl">
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={7}>
            {TEST_CATEGORIES.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </SimpleGrid>
        </Container>
      </Box>
    </Box>
  )
}

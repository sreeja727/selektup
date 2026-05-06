import { useState } from 'react'
import { Box, Container, VStack, Text, Heading, Image, HStack, IconButton, useBreakpointValue } from '@chakra-ui/react'
import { FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const FACULTY = [
  {
      
    name: 'Albert orestes',
    role: 'Senior faculty for',
    subject: 'Geography',
    photo: '/ori sir.PNG',
    color: '#039BE5',
  },
  {
    name: 'Sooraj G R',
    role: 'Senior faculty for',
    subject: 'History',
    photo: '/Sooraj.PNG',
    color: '#E91E8C',
  },
  {
    name: 'Nithya jeejo',
    role: 'Senior faculty for',
    subject: ' Economics',
    photo: '/Nithya.PNG',
    color: '#039BE5',
  },
  {
    name: 'Kevin tom jose',
    role: 'Senior faculty for ',
    subject: 'Polity',
    photo: '/TOM.PNG',
    color: '#E91E8C',
  },
  {
    name: 'Dr salmafarooq',
    role: 'Senior faculty for',
    subject: ' Science and technology',
    photo: '/salma.PNG',
    color: '#039BE5',
  },
  {
    name: 'Jom J Jose',
    role: '',
    subject: 'Technical Head',
    photo: '/jom.PNG',
    color: '#E91E8C',
  },
  {
    name: 'Muhammed Suhai',
    role: 'Senior faculty for',
    subject: 'International Relation',
    photo: '/suhail.PNG',
    color: '#039BE5',
  },

  {
    name: 'Arya prasad ks',
    role: 'Senior faculty for',
    subject: 'History',
    photo: '/arya.PNG',
    color: '#E91E8C',
  },
  {
    name: 'Muhammad safeer',
    role: 'Senior faculty for ',
    subject: 'Psychology',
    photo: '/safeer.PNG',
    color: '#039BE5',
  },
  {
    name: 'Irene babu',
    role: 'Senior faculty for',
    subject: 'English',
    photo: '/IRENE.PNG',
    color: '#E91E8C',
  },
   {
    name: 'Soya',
    role: 'Senior faculty for ',
    subject: 'Malayalam',
    photo: '/soya.PNG',
    color: '#039BE5',
  },
]

const ARROW_BTN = {
  size: 'md',
  bg: 'rgba(255,255,255,0.07)',
  color: 'white',
  borderRadius: 'full',
  border: '1px solid rgba(255,255,255,0.13)',
  _hover: { bg: 'rgba(233,30,140,0.25)', borderColor: 'rgba(233,30,140,0.6)', color: '#E91E8C' },
  _active: { bg: 'rgba(233,30,140,0.35)' },
}

export default function FacultySection() {
  const [start, setStart] = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const [dir, setDir] = useState(1)

  const total = FACULTY.length
  const visibleCount = useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 5 }) ?? 5

  const go = (d) => {
    setDir(d)
    setStart(s => (s + d + total) % total)
    setAnimKey(k => k + 1)
  }

  const jumpTo = (i) => {
    const dist = (i - start + total) % total
    setDir(dist <= total / 2 ? 1 : -1)
    setStart(i)
    setAnimKey(k => k + 1)
  }

  const visible = Array.from({ length: visibleCount }, (_, i) =>
    FACULTY[(start + i) % total]
  )

  const slideSx = {
    '@keyframes fadeSlideRight': {
      from: { opacity: 0, transform: 'translateX(48px)' },
      to: { opacity: 1, transform: 'translateX(0)' },
    },
    '@keyframes fadeSlideLeft': {
      from: { opacity: 0, transform: 'translateX(-48px)' },
      to: { opacity: 1, transform: 'translateX(0)' },
    },
    animation: `${dir > 0 ? 'fadeSlideRight' : 'fadeSlideLeft'} 0.38s cubic-bezier(0.25,0.46,0.45,0.94)`,
  }

  return (
    <Box
      py={{ base: 16, md: 24 }}
      bg="linear-gradient(135deg, #080e1a 0%, #0C1222 50%, #0d1f35 100%)"
      position="relative"
      overflow="hidden"
    >
      {/* decorative blobs */}
      <Box
        position="absolute"
        top="-15%"
        right="-5%"
        w="400px"
        h="400px"
        borderRadius="full"
        bg="rgba(233,30,140,0.06)"
        border="1px solid rgba(233,30,140,0.1)"
      />
      <Box
        position="absolute"
        bottom="-10%"
        left="-8%"
        w="350px"
        h="350px"
        borderRadius="full"
        bg="rgba(3,155,229,0.05)"
      />

      <Container maxW="7xl" position="relative" zIndex={1}>
        {/* heading */}
        <VStack gap={4} mb={14} textAlign="center">
          <Text color="#E91E8C" fontWeight={700} fontSize="xs" letterSpacing="0.12em" textTransform="uppercase">
            Expert Team
          </Text>
          <Heading fontSize={{ base: '2xl', md: '4xl' }} fontWeight={800} color="white">
            Meet Our Faculty
          </Heading>
          <Text color="rgba(255,255,255,0.55)" maxW="560px" fontSize={{ base: 'md', md: 'lg' }} lineHeight={1.7}>
            Learn from mentors who bring deep expertise and a passion for guiding every student to succeed.
          </Text>
        </VStack>

        {/* carousel wrapper */}
        <Box position="relative" px={{ base: 10, md: 12 }}>
          {/* prev arrow */}
          <IconButton
            aria-label="Previous faculty"
            onClick={() => go(-1)}
            position="absolute"
            left="0"
            top="50%"
            transform="translateY(-50%)"
            zIndex={2}
            {...ARROW_BTN}
          >
            <FaChevronLeft />
          </IconButton>

          {/* animated cards row */}
          <HStack
            key={animKey}
            gap={5}
            align="stretch"
            sx={slideSx}
          >
            {visible.map((f, i) => (
              <VStack
                key={i}
                flex="1"
                minW="0"
                gap={4}
                p={5}
                bg="rgba(255,255,255,0.04)"
                borderRadius="2xl"
                border="1px solid rgba(255,255,255,0.08)"
                textAlign="center"
                transition="all 0.3s"
                _hover={{
                  bg: 'rgba(255,255,255,0.09)',
                  borderColor: f.color === '#E91E8C' ? 'rgba(233,30,140,0.45)' : 'rgba(3,155,229,0.45)',
                  transform: 'translateY(-6px)',
                  boxShadow: f.color === '#E91E8C'
                    ? '0 16px 48px rgba(233,30,140,0.15)'
                    : '0 16px 48px rgba(3,155,229,0.15)',
                }}
              >
                {/* photo */}
                <Box
                  w="150px"
                  h="150px"
                  mx="auto"
                  borderRadius="full"
                  border={`3px solid ${f.color}`}
                  overflow="hidden"
                  bg={`${f.color}22`}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  boxShadow={`0 0 0 6px ${f.color}18`}
                  flexShrink={0}
                >
                  <Image
                    src={f.photo}
                    alt={f.name}
                    w="full"
                    h="full"
                    objectFit="cover"
                    fallback={
                      <Text fontWeight={800} fontSize="xl" color={f.color}>
                        {f.initials}
                      </Text>
                    }
                  />
                </Box>

                {/* info */}
                <VStack gap={1.5}>
                  <Text fontWeight={800} color="white" fontSize="sm" lineHeight={1.25} noOfLines={1}>
                    {f.name}
                  </Text>
                  <Text fontWeight={600} color="rgba(255,255,255,0.45)" fontSize="xs">
                    {f.role}
                  </Text>
                  <Text  fontWeight={700} color={f.color} lineHeight={1.5} noOfLines={2}>
                    {f.subject}
                  </Text>
                </VStack>

                {/* stars */}
                {/* <HStack gap={1} justify="center">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Box key={s} color={f.color} opacity={s < 4 ? 1 : 0.3}>
                      <FaStar size={10} />
                    </Box>
                  ))}
                </HStack> */}
              </VStack>
            ))}
          </HStack>

          {/* next arrow */}
          <IconButton
            aria-label="Next faculty"
            onClick={() => go(1)}
            position="absolute"
            right="0"
            top="50%"
            transform="translateY(-50%)"
            zIndex={2}
            {...ARROW_BTN}
          >
            <FaChevronRight />
          </IconButton>
        </Box>

        {/* dot indicators */}
        <HStack justify="center" mt={10} gap={2} flexWrap="wrap">
          {FACULTY.map((_, i) => (
            <Box
              key={i}
              as="button"
              w={i === start ? '24px' : '8px'}
              h="8px"
              borderRadius="full"
              bg={i === start ? '#E91E8C' : 'rgba(255,255,255,0.2)'}
              transition="all 0.35s"
              cursor="pointer"
              onClick={() => jumpTo(i)}
            />
          ))}
        </HStack>
      </Container>
    </Box>
  )
}

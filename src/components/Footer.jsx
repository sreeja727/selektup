import { Box, Container, SimpleGrid, VStack, HStack, Text, Heading } from '@chakra-ui/react'
import {
  FaFacebook, FaTwitter, FaYoutube, FaInstagram, FaLinkedin, FaTelegram,
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaArrowRight,
} from 'react-icons/fa'
import { FaThreads } from 'react-icons/fa6'
import { selektup } from '../assets'

const COURSES = [
  'Degree Prelims PYQ Live Solving Sessions',
  'SelektUp PSC Mentorship Programme',
  'SelektUp KTET Psychology Classes',
  'Engineering Graphics Crash Course',
]
const LINKS = [
  { label: 'About Us', href: '/about' },
  { label: 'Our Faculty', href: '#' },
  { label: 'Blog', href: '#' },
  { label: 'Contact Us', href: '/contact' },
]
const STUDY_MATERIALS = [
  { label: 'Telegram', Icon: FaTelegram, href: 'https://t.me/selektup', color: '#0088cc' },
  { label: 'YouTube', Icon: FaYoutube, href: 'https://www.youtube.com/@SeleKtUp', color: '#FF0000' },
]
const SOCIAL = [
  { Icon: FaFacebook, color: '#1877F2', href: 'https://facebook.com/profile.php?id=61585841854078' },
  { Icon: FaYoutube, color: '#FF0000', href: 'https://www.youtube.com/@SeleKtUp' },
  { Icon: FaInstagram, color: '#E91E8C', href: 'https://instagram.com/selektup/' },
  { Icon: FaTelegram, color: '#0088cc', href: 'https://t.me/selektup' },
  { Icon: FaThreads, color: '#000000', href: 'https://www.threads.net/@selektup' },
]

export default function Footer() {
  return (
    <Box as="footer" bg="#060c18" color="white">
      <Container maxW="7xl" py={{ base: 14, md: 20 }}>
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={{ base: 10, md: 12 }}>
          <VStack align="flex-start" gap={5}>
            <Box as="a" href="#" display="flex" alignItems="center" gap={3}>
              <Box
                as="img"
                src={selektup}
                h="48px"
                objectFit="contain"
                alt="SeleKtUp"
                style={{ filter: 'brightness(1.1)' }}
              />
              <Box display="flex" flexDirection="column" lineHeight={1}>
                <Text
                  fontWeight="extrabold"
                  fontSize="xl"
                  bgGradient="linear(to-r, #E91E8C, #039BE5)"
                  bgClip="text"
                  color="transparent"
                  letterSpacing="-0.02em"
                  lineHeight={1.1}
                >
                  seleKtUp
                </Text>

              </Box>
            </Box>
            <Text color="gray.500" fontSize="sm" lineHeight={1.85}>
              SelektUp is a premier coaching platform dedicated to shaping future professionals through expert guidance, structured learning, and result-oriented strategies            </Text>
            <HStack gap={3}>
              {SOCIAL.map(({ Icon, color, href }, i) => (
                <Box
                  key={i}
                  as="a"
                  href={href}
                  target={href !== '#' ? '_blank' : undefined}
                  rel={href !== '#' ? 'noopener noreferrer' : undefined}
                  w={9}
                  h={9}
                  borderRadius="full"
                  bg="rgba(255,255,255,0.07)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="gray.500"
                  transition="all 0.25s"
                  _hover={{ bg: color, color: 'white', transform: 'translateY(-2px)' }}
                >
                  <Icon size={14} as={Icon} />
                </Box>
              ))}
            </HStack>
          </VStack>

          <VStack align="flex-start" gap={4}>
            <Heading fontSize="sm" fontWeight={700} color="white" textTransform="uppercase" letterSpacing="0.08em">
              Our Courses
            </Heading>
            {COURSES.map(c => (
              <HStack
                key={c}
                as="a"
                href="/courses"
                gap={2}
                fontSize="sm"
                color="gray.500"
                transition="all 0.2s"
                _hover={{ color: '#E91E8C', textDecoration: 'none' }}
              >
                <Box color="#E91E8C" opacity={0.5}><FaArrowRight size={9} /></Box>
                <Text>{c}</Text>
              </HStack>
            ))}
          </VStack>

          {/* Quick Links */}
          <VStack align="flex-start" gap={4}>
            <Heading fontSize="sm" fontWeight={700} color="white" textTransform="uppercase" letterSpacing="0.08em">
              Quick Links
            </Heading>
            {LINKS.map(({ label, href }) => (
              <HStack
                key={label}
                as="a"
                href={href}
                gap={2}
                fontSize="sm"
                color="gray.500"
                transition="all 0.2s"
                _hover={{ color: '#039BE5', textDecoration: 'none' }}
              >
                <Box color="#039BE5" opacity={0.7}><FaArrowRight size={9} /></Box>
                <Text>{label}</Text>
              </HStack>
            ))}

            <Text fontSize="xs" fontWeight={700} color="gray.400" textTransform="uppercase" letterSpacing="0.08em" pt={1}>
              Study Materials
            </Text>
            {STUDY_MATERIALS.map((item) => (
              <HStack
                key={item.label}
                as="a"
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                gap={2}
                fontSize="sm"
                color={item.color}
                fontWeight={600}
                transition="all 0.2s"
                _hover={{ opacity: 0.75, textDecoration: 'none' }}
              >
                <item.Icon size={13} />
                <Text>{item.label}</Text>
              </HStack>
            ))}
          </VStack>

          {/* Contact */}
          <VStack align="flex-start" gap={5}>
            <Heading fontSize="sm" fontWeight={700} color="white" textTransform="uppercase" letterSpacing="0.08em">
              Contact Us
            </Heading>

            <HStack gap={3} align="flex-start">
              <Box color="#E91E8C" mt="3px" flexShrink={0}><FaMapMarkerAlt size={14} /></Box>
              <Text fontSize="sm" color="gray.500" lineHeight={1.75}>
                Selektup Lords building Opp CET sreekaryam<br />
                Thiruvananthapuram
              </Text>
            </HStack>

            <HStack gap={3}>
              <Box color="#039BE5" flexShrink={0}><FaPhone size={13} /></Box>
              <Box as="a" href="tel:+919876543210" fontSize="sm" color="gray.500"
                _hover={{ color: '#039BE5' }} transition="color 0.2s">
                +91 8089712121
              </Box>
            </HStack>

            <HStack gap={3}>
              <Box color="#E91E8C" flexShrink={0}><FaEnvelope size={13} /></Box>
              <Box as="a" href="mailto:info@selektup.com" fontSize="sm" color="gray.500"
                _hover={{ color: '#E91E8C' }} transition="color 0.2s">
                Selektup@gmail.com
              </Box>
            </HStack>

          </VStack>
        </SimpleGrid>
      </Container>

      {/* Bottom bar */}
      <Box borderTop="1px solid rgba(255,255,255,0.06)" py={6}>
        <Container maxW="7xl">
          <HStack justify="space-between" flexWrap="wrap" gap={4}>
            <Text fontSize="sm" color="gray.600">
              © 2025 SeleKtUp  Academy. All rights reserved.
            </Text>
            <HStack gap={6} flexWrap="wrap">
              {['Privacy Policy', 'Terms of Service',].map(l => (
                <Box key={l} as="a" href="#" fontSize="sm" color="gray.600"
                  _hover={{ color: 'white' }} transition="color 0.2s">
                  {l}
                </Box>
              ))}
            </HStack>
          </HStack>
        </Container>
      </Box>
    </Box>
  )
}

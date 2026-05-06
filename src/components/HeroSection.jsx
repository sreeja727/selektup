import { Box, Text, Heading, Container } from '@chakra-ui/react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

const SLIDES = [
  {
    title: 'Are you ready to prepare with the right strategy?',
    subtitle: `Begin your preparation with the right guidance and a clear strategy. Our platform offers structured learning, expert mentorship, and proven techniques to help you crack competitive government exams with confidence from day one.`,
    overlay: 'linear-gradient(120deg, rgba(10,4,40,0.92) 0%, rgba(50,8,80,0.78) 45%, rgba(233,30,140,0.28) 100%)',
  },
  {
    title: 'Still searching for the right mentorship to succeed?',
    subtitle: 'Highly experienced mentors who bring years of expertise in competitive exams. With deep subject knowledge, proven strategies, and personalized guidance, our mentors ensure you stay focused, confident, and fully prepared to achieve your goals.',
    overlay: 'linear-gradient(120deg, rgba(10,4,40,0.92) 0%, rgba(50,8,80,0.78) 45%, rgba(233,30,140,0.28) 100%)',
  },
]

export default function HeroSection() {
  return (
    <Box>
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        loop
      >
        {SLIDES.map((slide, i) => (
          <SwiperSlide key={i}>
            <Box
              minH={{ base: '100svh', md: '88vh' }}
              display="flex"
              alignItems="center"
              position="relative"
              overflow="hidden"
            >
              {/* Blurred background image */}
              <Box
                position="absolute"
                inset={0}
                backgroundImage="url('/bgimg.jpeg')"
                backgroundSize="cover"
                backgroundPosition="center"
                filter="blur(4px) brightness(0.55)"
                transform="scale(1.08)"
              />
              {/* Per-slide gradient overlay */}
              <Box
                position="absolute"
                inset={0}
                style={{ background: slide.overlay }}
              />

              <Container maxW="7xl" position="relative" zIndex={1} py={{ base: 24, md: 0 }}>
                <Box maxW="700px">
                  <Heading
                    as="h1"
                    fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}
                    fontWeight={900}
                    color="white"
                    lineHeight={1.1}
                    letterSpacing="-1px"
                    mb={6}
                    whiteSpace="pre-line"
                  >
                    {slide.title}
                  </Heading>

                  <Text
                    fontSize={{ base: 'md', md: 'lg', lg: 'xl' }}
                    color="rgba(255,255,255,0.72)"
                    lineHeight={1.78}
                    mb={10}
                    maxW="580px"
                  >
                    {slide.subtitle}
                  </Text>

                </Box>
              </Container>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  )
}

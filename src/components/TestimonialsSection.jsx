import { Box, Container, VStack, HStack, Text, Heading } from '@chakra-ui/react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { FaQuoteLeft, FaStar } from 'react-icons/fa'

const TESTIMONIALS = [
  {
    name: 'Riyas P',
    rank: 'PSC Degree Prelims Aspirant',
    text: "Before PSC Degree Prelims, I made it a habit to watch SelektUp's daily 10 PYQ sessions. It really helped me stay consistent and understand the question patterns better. The explanations were simple and to the point. Honestly, these free sessions made a big difference in my revision. Thank you for providing such helpful content for aspirants like us.",
    initials: 'RP',
    accent: '#E91E8C',
  },
  {
    name: 'Anjali S',
    rank: 'SelektUp Mentorship Program',
    text: "Before joining SelektUp, my preparation had no clear direction. SelektUp's mentorship program really helped me understand how to study smart, especially through PYQs. The mentors are supportive, and regular follow ups kept me consistent. The materials are simple and exam-focused, and recorded classes made revision easy. It's not a shortcut, but it definitely gave me the clarity and guidance I needed.",
    initials: 'AS',
    accent: '#039BE5',
  },
  {
    name: 'Vishnu Mohan',
    rank: 'SelektUp Mentorship Program',
    text: "The best part of SelektUp for me was the mentors. They are very approachable and always ready to clear doubts, even small ones. It didn't feel like a typical class — they actually understand where we struggle and guide us patiently. Their support and constant motivation really helped me stay confident and consistent in my preparation.",
    initials: 'VM',
    accent: '#E91E8C',
  },
  {
    name: 'Sneha Santhosh',
    rank: 'PYQ Live Sessions Student',
    text: "I could score around 10+ extra marks just from the PYQ live question predictions by SelektUp. The questions were very close to what came in the exam, and it really boosted my confidence. Thank you SelektUp for such accurate and helpful sessions!",
    initials: 'SS',
    accent: '#039BE5',
  },
  {
    name: 'Reshma Raveendran',
    rank: 'KTET Qualified',
    text: "Psychology was the toughest part for me in KTET. But Safeer sir's classes made a huge difference. His way of teaching was very clear and easy to understand, which helped me improve a lot. I was able to clear KTET with a good margin, and I'm really thankful for such authentic and effective psychology classes.",
    initials: 'RR',
    accent: '#E91E8C',
  },
]

export default function TestimonialsSection() {
  return (
    <Box py={{ base: 16, md: 24 }} bg="#F8F9FA">
      <Container maxW="7xl">
        <VStack gap={4} mb={14} textAlign="center">
          <Text color="#039BE5" fontWeight={700} fontSize="xs" letterSpacing="0.12em" textTransform="uppercase">
            SelektUp Success Stories
          </Text>
          <Heading fontSize={{ base: '2xl', md: '4xl' }} fontWeight={800} color="#0C1222">
            What Our Aspirants Say
          </Heading>
          <Text color="gray.600" maxW="560px" fontSize={{ base: 'md', md: 'lg' }} lineHeight={1.7}>
            Real experiences from aspirants who trusted our guidance and stayed consistent.
          </Text>
        </VStack>

        <Swiper
          className="testimonials-swiper"
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640:  { slidesPerView: 1 },
            768:  { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          style={{ paddingBottom: '52px' }}
        >
          {TESTIMONIALS.map((t, i) => (
            <SwiperSlide key={i} style={{ height: 'auto' }}>
              <Box
                bg="white"
                p={8}
                borderRadius="2xl"
                boxShadow="0 2px 16px rgba(0,0,0,0.07)"
                border="2px solid transparent"
                h="full"
                display="flex"
                flexDir="column"
                transition="all 0.3s"
                _hover={{ borderColor: t.accent, boxShadow: `0 8px 28px ${t.accent}22` }}
              >
                <Box color={`${t.accent}33`} mb={4}>
                  <FaQuoteLeft size={30} />
                </Box>

                <HStack gap={1} mb={4}>
                  {[...Array(5)].map((_, j) => (
                    <FaStar key={j} size={13} color="#E91E8C" />
                  ))}
                </HStack>

                <Text color="gray.700" lineHeight={1.85} fontSize="sm" flex={1} mb={7}>
                  "{t.text}"
                </Text>

                <HStack gap={3}>
                  <Box
                    w={11}
                    h={11}
                    borderRadius="full"
                    bg={`${t.accent}18`}
                    border={`2px solid ${t.accent}`}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                  >
                    <Text fontWeight={800} color={t.accent} fontSize="sm">{t.initials}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight={700} color="#0C1222" fontSize="sm">{t.name}</Text>
                    <Text fontSize="xs" color={t.accent} fontWeight={600}>{t.rank}</Text>
                  </Box>
                </HStack>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </Box>
  )
}

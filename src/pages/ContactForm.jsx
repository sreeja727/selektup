import {Box,Button,Grid,GridItem,Input,Text,VStack,Textarea,} from '@chakra-ui/react'
import { useState } from 'react'
import { rtdb } from '../firebase'
import { ref, push } from 'firebase/database'

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    district: '',
    message: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (error) setError('')
  }

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.phone.trim() || !formData.district.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields.')
      return
    }
    setIsLoading(true)
    setError('')
    try {
      await push(ref(rtdb, 'enquiries'), {
        ...formData,
        createdAt: new Date().toISOString(),
      })
      localStorage.setItem('enquirySubmitted', 'true')
      setSubmitted(true)
    } catch (err) {
      console.error('Error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box bg="#F8F9FA" minH="calc(100vh - 88px)">
      <Box
        bg="linear-gradient(135deg, #0C1222 0%, #1a0830 50%, #0277BD 100%)"
        py={{ base: 14, md: 20 }}
        textAlign="center"
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top="-20%"
          right="-5%"
          w="360px"
          h="360px"
          borderRadius="full"
          bg="rgba(233,30,140,0.08)"
          border="1px solid rgba(233,30,140,0.12)"
        />
        <Box
          position="absolute"
          bottom="-15%"
          left="-5%"
          w="280px"
          h="280px"
          borderRadius="full"
          bg="rgba(3,155,229,0.07)"
        />
        <Box position="relative" zIndex={1}>
          <Text
            color="#E91E8C"
            fontWeight={700}
            fontSize="xs"
            letterSpacing="0.14em"
            textTransform="uppercase"
            mb={3}
          >
            Get in Touch
          </Text>
          <Text
            fontSize={{ base: '2xl', md: '4xl' }}
            fontWeight={900}
            color="white"
            lineHeight={1.2}
          >
            Join the SeleKtUp Family Today
          </Text>
          <Text
            color="rgba(255,255,255,0.65)"
            fontSize={{ base: 'md', md: 'lg' }}
            mt={4}
            maxW="480px"
            mx="auto"
            lineHeight={1.75}
          >
            Fill in the form below and our counseling team will reach out within 24 hours.
          </Text>
        </Box>
      </Box>

      {/* Card area */}
      <Box maxW="860px" mx="auto" px={{ base: 4, md: 8 }} py={{ base: 10, md: 16 }}>
        <Box
          bg="white"
          borderRadius="2xl"
          p={{ base: 6, md: 10 }}
          boxShadow="0 4px 28px rgba(0,0,0,0.09)"
          border="1px solid"
          borderColor="gray.100"
        >
          {submitted ? (
            /* ── Thank-you state ── */
            <VStack gap={4} py={10} textAlign="center">
              <Box
                w={16}
                h={16}
                borderRadius="full"
                bg="rgba(233,30,140,0.1)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="2xl"
              >
                ✓
              </Box>
              <Text fontSize="2xl" fontWeight={900} color="#0C1222">
                Thank You for Submitting!
              </Text>
              <Text color="gray.500" maxW="380px" lineHeight={1.75}>
                We've received your enquiry. Our counseling team will reach out to you within 24 hours.
              </Text>
            </VStack>
          ) : (
            /* ── Form state ── */
            <>
              <Text fontSize="xl" fontWeight={800} color="#0C1222" mb={1}>
                Enquiry Form
              </Text>
              <Text fontSize="sm" color="gray.500" mb={8}>
                All fields marked{' '}
                <span style={{ color: '#E91E8C', fontWeight: 700 }}>*</span>{' '}
                are required.
              </Text>

              <VStack gap={6}>
                <Grid
                  templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
                  gap={6}
                  w="100%"
                >
                  <GridItem>
                    <Text mb={2} fontSize="sm" fontWeight={600} color="#0C1222">
                      Name <span style={{ color: '#E91E8C' }}>*</span>
                    </Text>
                    <Input
                      placeholder="Your full name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      borderColor="gray.200"
                      borderWidth="2px"
                      borderRadius="lg"
                      _focus={{ borderColor: '#E91E8C', boxShadow: '0 0 0 3px rgba(233,30,140,0.12)' }}
                      _hover={{ borderColor: '#E91E8C' }}
                    />
                  </GridItem>

                  <GridItem>
                    <Text mb={2} fontSize="sm" fontWeight={600} color="#0C1222">
                      Email
                    </Text>
                    <Input
                      placeholder="Enter valid email id"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      borderColor="gray.200"
                      borderWidth="2px"
                      borderRadius="lg"
                      _focus={{ borderColor: '#039BE5', boxShadow: '0 0 0 3px rgba(3,155,229,0.12)' }}
                      _hover={{ borderColor: '#039BE5' }}
                    />
                  </GridItem>

                  <GridItem>
                    <Text mb={2} fontSize="sm" fontWeight={600} color="#0C1222">
                      District <span style={{ color: '#E91E8C' }}>*</span>
                    </Text>
                    <Input
                      placeholder="Enter your district"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      borderColor="gray.200"
                      borderWidth="2px"
                      borderRadius="lg"
                      _focus={{ borderColor: '#E91E8C', boxShadow: '0 0 0 3px rgba(233,30,140,0.12)' }}
                      _hover={{ borderColor: '#E91E8C' }}
                    />
                  </GridItem>

                  <GridItem>
                    <Text mb={2} fontSize="sm" fontWeight={600} color="#0C1222">
                      Phone Number <span style={{ color: '#E91E8C' }}>*</span>
                    </Text>
                    <Input
                      placeholder="Enter phone number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      borderColor="gray.200"
                      borderWidth="2px"
                      borderRadius="lg"
                      _focus={{ borderColor: '#039BE5', boxShadow: '0 0 0 3px rgba(3,155,229,0.12)' }}
                      _hover={{ borderColor: '#039BE5' }}
                    />
                  </GridItem>
                </Grid>

                <Box w="100%">
                  <Text mb={2} fontSize="sm" fontWeight={600} color="#0C1222">
                    Message <span style={{ color: '#E91E8C' }}>*</span>
                  </Text>
                  <Textarea
                    placeholder="Write your message..."
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    borderColor="gray.200"
                    borderWidth="2px"
                    borderRadius="lg"
                    _focus={{ borderColor: '#E91E8C', boxShadow: '0 0 0 3px rgba(233,30,140,0.12)' }}
                    _hover={{ borderColor: '#E91E8C' }}
                  />
                </Box>

                {error && (
                  <Text color="red.500" fontSize="sm" alignSelf="flex-start">
                    {error}
                  </Text>
                )}

                <Button
                  bg="#E91E8C"
                  color="white"
                  px={10}
                  py={6}
                  borderRadius="lg"
                  fontWeight={700}
                  fontSize="md"
                  _hover={{
                    bg: '#C2185B',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(233,30,140,0.4)',
                  }}
                  transition="all 0.25s"
                  alignSelf="flex-start"
                  onClick={handleSubmit}
                  loading={isLoading}
                  disabled={isLoading}
                >
                  Submit Enquiry
                </Button>
              </VStack>
            </>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default ContactForm

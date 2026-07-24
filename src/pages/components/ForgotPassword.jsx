import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Box, Button, HStack, Input, Text, VStack } from '@chakra-ui/react'
import { FaLifeRing, FaPhoneAlt, FaEnvelope, FaCheckCircle, FaMobileAlt } from 'react-icons/fa'
import { toaster } from '../../components/ui/toaster'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'

export default function ForgotPassword() {
  const [contact, setContact] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  // TODO: this endpoint doesn't exist yet — implement it on the backend so it
  // actually lands in the admin's "Password Reset Requests" queue. Expected contract:
  //   POST /api/auth/request-password-reset
  //   body: { contact }  // the mobile number the user typed
  //   -> { success: true } | { success: false, message }
  const handleSubmit = async () => {
    if (!contact.trim()) {
      setError('Please enter your registered mobile number')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/request-password-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact: contact.trim() }),
      })
      const data = await res.json()
      if (data.success) {
        setSent(true)
        toaster.create({ title: 'Request sent', description: 'Our admin team has been notified.', type: 'success', duration: 4000, closable: true })
      } else {
        const message = data.message || 'Something went wrong. Please try again.'
        setError(message)
        toaster.create({ title: 'Request failed', description: message, type: 'error', duration: 4000, closable: true })
      }
    } catch {
      const message = 'Unable to reach the server right now. Please try again, or contact support directly below.'
      setError(message)
      toaster.create({ title: 'Request failed', description: message, type: 'error', duration: 4000, closable: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      bg="#F4F6F8"
      minH="calc(100vh - 88px)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
      py={10}
    >
      <Box
        bg="white"
        borderRadius="2xl"
        boxShadow="0 4px 28px rgba(0,0,0,0.09)"
        border="1px solid"
        borderColor="gray.100"
        p={{ base: 6, md: 10 }}
        w="100%"
        maxW="440px"
      >
        <Text fontWeight="900" fontSize="2xl" letterSpacing="-0.5px" textAlign="center" mb={6}>
          <span style={{ color: '#039BE5' }}>SeleKt</span>
          <span style={{ color: '#E91E8C' }}>Up</span>
        </Text>

        {!sent ? (
          <VStack gap={4} textAlign="center">
            <Box color="#039BE5" fontSize="48px">
              <FaLifeRing />
            </Box>

            <Text fontWeight={800} fontSize="xl" color="#0C1222">
              Forgot Password?
            </Text>

            <Text fontSize="sm" color="gray.500" maxW="340px">
              Enter your registered mobile number and notify our admin team.
              We'll verify your identity and reset your password for you.
            </Text>

            <Box w="100%">
              <Box position="relative">
                <Box
                  position="absolute"
                  left={3}
                  top="50%"
                  transform="translateY(-50%)"
                  color="gray.400"
                  zIndex={1}
                  pointerEvents="none"
                >
                  <FaMobileAlt size={14} />
                </Box>
                <Input
                  pl="36px"
                  placeholder="Enter your registered mobile number"
                  value={contact}
                  onChange={(e) => {
                    setContact(e.target.value)
                    setError('')
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  borderColor={error ? 'red.400' : 'gray.200'}
                  borderWidth="2px"
                  borderRadius="lg"
                  _focus={{ borderColor: '#039BE5', boxShadow: '0 0 0 3px rgba(3,155,229,0.12)' }}
                  _hover={{ borderColor: '#039BE5' }}
                />
              </Box>
              {error && <Text color="red.500" fontSize="xs" mt={1} textAlign="left">{error}</Text>}
            </Box>

            <Button
              w="100%"
              bg="#039BE5"
              color="white"
              fontWeight={700}
              borderRadius="lg"
              fontSize="md"
              py={6}
              onClick={handleSubmit}
              loading={loading}
              disabled={loading}
              _hover={{
                bg: '#0277BD',
                transform: 'translateY(-1px)',
                boxShadow: '0 6px 20px rgba(3,155,229,0.4)',
              }}
              transition="all 0.2s"
            >
              Notify Admin
            </Button>

            <Text fontSize="xs" color="gray.400" mt={1}>Or reach us directly:</Text>

            <VStack gap={3} w="100%">
              <HStack
                as="a"
                href="tel:+918089712121"
                w="100%"
                justify="center"
                gap={2}
                py={3}
                borderRadius="lg"
                border="1px solid"
                borderColor="gray.200"
                color="#0C1222"
                fontWeight={600}
                fontSize="sm"
                _hover={{ borderColor: '#039BE5', color: '#039BE5' }}
                transition="all 0.15s"
              >
                <FaPhoneAlt size={13} />
                <Text>+91 8089712121</Text>
              </HStack>

              <HStack
                as="a"
                href="mailto:selektup@gmail.com"
                w="100%"
                justify="center"
                gap={2}
                py={3}
                borderRadius="lg"
                border="1px solid"
                borderColor="gray.200"
                color="#0C1222"
                fontWeight={600}
                fontSize="sm"
                _hover={{ borderColor: '#039BE5', color: '#039BE5' }}
                transition="all 0.15s"
              >
                <FaEnvelope size={13} />
                <Text>selektup@gmail.com</Text>
              </HStack>
            </VStack>

            <Text fontSize="sm" color="gray.500" mt={2}>
              Remember your password?{' '}
              <Box as={Link} to="/login" color="#039BE5" fontWeight={700} _hover={{ textDecoration: 'underline' }}>
                Back to Login
              </Box>
            </Text>
          </VStack>
        ) : (
          <VStack gap={4} py={4} textAlign="center">
            <Box color="green.400" fontSize="52px">
              <FaCheckCircle />
            </Box>
            <Text fontWeight={800} fontSize="xl" color="#0C1222">Request Sent</Text>
            <Text fontSize="sm" color="gray.500" maxW="320px">
              Our admin team has been notified and will reset your password shortly.
              You'll receive your temporary password via email or SMS.
            </Text>
            <Button
              as={Link}
              to="/login"
              bg="#039BE5"
              color="white"
              fontWeight={700}
              borderRadius="lg"
              fontSize="md"
              px={8}
              py={6}
              mt={2}
              _hover={{
                bg: '#0277BD',
                transform: 'translateY(-1px)',
                boxShadow: '0 6px 20px rgba(3,155,229,0.4)',
              }}
              transition="all 0.2s"
            >
              Back to Login
            </Button>
          </VStack>
        )}
      </Box>
    </Box>
  )
}

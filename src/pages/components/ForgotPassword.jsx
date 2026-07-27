import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Button, HStack, Input, Text, VStack } from '@chakra-ui/react'
import { FaLifeRing, FaPhoneAlt, FaEnvelope, FaCheckCircle, FaMobileAlt } from 'react-icons/fa'
import { forgotPassword } from '../actions'
import { getApiLoading } from '../common/selectors'

const MOBILE_RE = /^[6-9]\d{9}$/

export default function ForgotPassword() {
  const dispatch = useDispatch()
  const loading = useSelector(getApiLoading)
  const [mobile, setMobile] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = () => {
    const trimmed = mobile.trim()
    if (!trimmed) {
      setError('Please enter your registered mobile number')
      return
    }
    if (!MOBILE_RE.test(trimmed)) {
      setError('Enter a valid 10-digit mobile number')
      return
    }
    setError('')
    dispatch(forgotPassword({ mobile: trimmed }))
    setSent(true)
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
              Enter your registered mobile number. We'll send a password reset
              link to the email address linked to your account.
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
                  value={mobile}
                  onChange={(e) => {
                    setMobile(e.target.value)
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
              Send Reset Link
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
            <Text fontWeight={800} fontSize="xl" color="#0C1222">Check Your Email</Text>
            <Text fontSize="sm" color="gray.500" maxW="320px">
              If that mobile number is registered, we've sent a password reset
              link to the email address on file. Click the link to set a new password.
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

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Button, HStack, Input, Text, VStack } from '@chakra-ui/react'
import { FaPhoneAlt, FaEnvelope, FaMobileAlt, FaShieldAlt } from 'react-icons/fa'
import { forgotPassword, verifyOtp } from '../actions'
import { getApiLoading, getForgotPasswordData } from '../selectors'

const MOBILE_RE = /^[6-9]\d{9}$/
const OTP_RE = /^\d{6}$/

export default function ForgotPassword() {
  const dispatch = useDispatch()
  const loading = useSelector(getApiLoading)
  const forgotPasswordData = useSelector(getForgotPasswordData)

  const [step, setStep] = useState('mobile') // 'mobile' | 'otp'
  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState('')
  const [mobileError, setMobileError] = useState('')
  const [otpError, setOtpError] = useState('')
  // Tracks the forgotPasswordData object we've already reacted to, so a stale
  // success from an earlier visit in this session doesn't skip straight to
  // the OTP step on mount.
  const [handledForgotPasswordData, setHandledForgotPasswordData] = useState(forgotPasswordData)

  if (forgotPasswordData && forgotPasswordData !== handledForgotPasswordData) {
    setHandledForgotPasswordData(forgotPasswordData)
    if (forgotPasswordData.success) {
      setStep('otp')
    } else {
      setMobileError(forgotPasswordData.message || 'No account found for that mobile number.')
    }
  }

  const handleSendOtp = () => {
    const trimmed = mobile.trim()
    if (!trimmed) {
      setMobileError('Please enter your registered mobile number')
      return
    }
    if (!MOBILE_RE.test(trimmed)) {
      setMobileError('Enter a valid 10-digit mobile number')
      return
    }
    setMobileError('')
    dispatch(forgotPassword({ mobile: trimmed }))
  }

  const handleVerifyOtp = () => {
    const trimmed = otp.trim()
    if (!OTP_RE.test(trimmed)) {
      setOtpError('Enter the 6-digit code sent to your email')
      return
    }
    setOtpError('')
    dispatch(verifyOtp({ mobile: mobile.trim(), otp: trimmed }))
  }

  const handleChangeMobile = () => {
    setStep('mobile')
    setOtp('')
    setOtpError('')
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

        {step === 'mobile' ? (
          <VStack gap={4} textAlign="center">
            <Box color="#039BE5" fontSize="48px">
              <FaMobileAlt />
            </Box>

            <Text fontWeight={800} fontSize="xl" color="#0C1222">
              Forgot Password?
            </Text>

            <Text fontSize="sm" color="gray.500" maxW="340px">
              Enter your registered mobile number. We'll email a one-time
              password (OTP) to the address linked to your account.
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
                    setMobileError('')
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
                  borderColor={mobileError ? 'red.400' : 'gray.200'}
                  borderWidth="2px"
                  borderRadius="lg"
                  _focus={{ borderColor: '#039BE5', boxShadow: '0 0 0 3px rgba(3,155,229,0.12)' }}
                  _hover={{ borderColor: '#039BE5' }}
                />
              </Box>
              {mobileError && <Text color="red.500" fontSize="xs" mt={1} textAlign="left">{mobileError}</Text>}
            </Box>

            <Button
              w="100%"
              bg="#039BE5"
              color="white"
              fontWeight={700}
              borderRadius="lg"
              fontSize="md"
              py={6}
              onClick={handleSendOtp}
              loading={loading}
              disabled={loading}
              _hover={{
                bg: '#0277BD',
                transform: 'translateY(-1px)',
                boxShadow: '0 6px 20px rgba(3,155,229,0.4)',
              }}
              transition="all 0.2s"
            >
              Send OTP
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
          <VStack gap={4} textAlign="center">
            <Box color="#039BE5" fontSize="48px">
              <FaShieldAlt />
            </Box>

            <Text fontWeight={800} fontSize="xl" color="#0C1222">
              Enter OTP
            </Text>

            <Text fontSize="sm" color="gray.500" maxW="340px">
              We've emailed a 6-digit code to the address linked to{' '}
              <Text as="span" fontWeight={700} color="#0C1222">{mobile}</Text>.
              Enter it below to continue.
            </Text>

            <Box w="100%">
              <Input
                textAlign="center"
                letterSpacing="0.3em"
                fontWeight={700}
                fontSize="lg"
                inputMode="numeric"
                maxLength={6}
                placeholder="••••••"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
                  setOtpError('')
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleVerifyOtp()}
                borderColor={otpError ? 'red.400' : 'gray.200'}
                borderWidth="2px"
                borderRadius="lg"
                _focus={{ borderColor: '#039BE5', boxShadow: '0 0 0 3px rgba(3,155,229,0.12)' }}
                _hover={{ borderColor: '#039BE5' }}
              />
              {otpError && <Text color="red.500" fontSize="xs" mt={1} textAlign="left">{otpError}</Text>}
            </Box>

            <Button
              w="100%"
              bg="#039BE5"
              color="white"
              fontWeight={700}
              borderRadius="lg"
              fontSize="md"
              py={6}
              onClick={handleVerifyOtp}
              loading={loading}
              disabled={loading}
              _hover={{
                bg: '#0277BD',
                transform: 'translateY(-1px)',
                boxShadow: '0 6px 20px rgba(3,155,229,0.4)',
              }}
              transition="all 0.2s"
            >
              Verify OTP
            </Button>

            <HStack gap={4} fontSize="sm">
              <Box
                as="button"
                type="button"
                color="#039BE5"
                fontWeight={700}
                onClick={handleSendOtp}
                disabled={loading}
                _hover={{ textDecoration: 'underline' }}
              >
                Resend OTP
              </Box>
              <Box
                as="button"
                type="button"
                color="gray.500"
                fontWeight={600}
                onClick={handleChangeMobile}
                _hover={{ textDecoration: 'underline' }}
              >
                Change mobile number
              </Box>
            </HStack>

            <Text fontSize="sm" color="gray.500" mt={2}>
              Remember your password?{' '}
              <Box as={Link} to="/login" color="#039BE5" fontWeight={700} _hover={{ textDecoration: 'underline' }}>
                Back to Login
              </Box>
            </Text>
          </VStack>
        )}
      </Box>
    </Box>
  )
}

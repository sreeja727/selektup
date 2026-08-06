import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Button, Input, Text, VStack } from '@chakra-ui/react'
import { FaLock, FaEye, FaEyeSlash, FaExclamationTriangle } from 'react-icons/fa'
import { resetPassword } from '../actions'
import { getApiLoading } from '../selectors'


const PASSWORD_MIN_LENGTH = 6

export default function ResetPassword() {
  const dispatch = useDispatch()
  const loading = useSelector(getApiLoading)
  const location = useLocation()
  const { resetToken } = location.state || {}

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})

  const validate = () => {
    const errors = {}
    if (!password) errors.password = 'Password is required'
    else if (password.length < PASSWORD_MIN_LENGTH) errors.password = `Password must be at least ${PASSWORD_MIN_LENGTH} characters`
    if (!confirmPassword) errors.confirmPassword = 'Please confirm your password'
    else if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match'
    return errors
  }

  const handleSubmit = () => {
    const errors = validate()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    setFieldErrors({})
    dispatch(resetPassword({ resetToken, password }))
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

        {!resetToken ? (
          <VStack gap={4} textAlign="center">
            <Box color="red.400" fontSize="48px">
              <FaExclamationTriangle />
            </Box>
            <Text fontWeight={800} fontSize="xl" color="#0C1222">OTP Verification Required</Text>
            <Text fontSize="sm" color="gray.500" maxW="320px">
              This page needs to be reached from the "Forgot Password" flow after verifying your OTP.
            </Text>
            <Button
              as={Link}
              to="/forgot-password"
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
              Start Over
            </Button>
          </VStack>
        ) : (
          <VStack gap={5} textAlign="center">
            <Box color="#039BE5" fontSize="48px">
              <FaLock />
            </Box>
            <Text fontWeight={800} fontSize="xl" color="#0C1222">Reset Your Password</Text>
            <Text fontSize="sm" color="gray.500" maxW="340px">
              Choose a new password for your account.
            </Text>

            <Box w="100%" textAlign="left">
              <Text mb={2} fontSize="sm" fontWeight={600} color="#0C1222">New Password</Text>
              <Box position="relative">
                <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" color="gray.400" zIndex={1} pointerEvents="none">
                  <FaLock size={14} />
                </Box>
                <Input
                  pl="36px"
                  pr="40px"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password (min. 6 characters)"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setFieldErrors((f) => ({ ...f, password: '' }))
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  borderColor={fieldErrors.password ? 'red.400' : 'gray.200'}
                  borderWidth="2px"
                  borderRadius="lg"
                  _focus={{ borderColor: '#039BE5', boxShadow: '0 0 0 3px rgba(3,155,229,0.12)' }}
                  _hover={{ borderColor: '#039BE5' }}
                />
                <Box
                  position="absolute" right={3} top="50%" transform="translateY(-50%)"
                  color="gray.400" cursor="pointer" zIndex={1}
                  onClick={() => setShowPassword((v) => !v)}
                  _hover={{ color: '#039BE5' }}
                >
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </Box>
              </Box>
              {fieldErrors.password && (
                <Text color="red.500" fontSize="xs" mt={1}>{fieldErrors.password}</Text>
              )}
            </Box>

            <Box w="100%" textAlign="left">
              <Text mb={2} fontSize="sm" fontWeight={600} color="#0C1222">Confirm Password</Text>
              <Box position="relative">
                <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" color="gray.400" zIndex={1} pointerEvents="none">
                  <FaLock size={14} />
                </Box>
                <Input
                  pl="36px"
                  pr="40px"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    setFieldErrors((f) => ({ ...f, confirmPassword: '' }))
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  borderColor={fieldErrors.confirmPassword ? 'red.400' : 'gray.200'}
                  borderWidth="2px"
                  borderRadius="lg"
                  _focus={{ borderColor: '#039BE5', boxShadow: '0 0 0 3px rgba(3,155,229,0.12)' }}
                  _hover={{ borderColor: '#039BE5' }}
                />
                <Box
                  position="absolute" right={3} top="50%" transform="translateY(-50%)"
                  color="gray.400" cursor="pointer" zIndex={1}
                  onClick={() => setShowConfirm((v) => !v)}
                  _hover={{ color: '#039BE5' }}
                >
                  {showConfirm ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </Box>
              </Box>
              {fieldErrors.confirmPassword && (
                <Text color="red.500" fontSize="xs" mt={1}>{fieldErrors.confirmPassword}</Text>
              )}
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
              Reset Password
            </Button>

            <Text fontSize="sm" color="gray.500">
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

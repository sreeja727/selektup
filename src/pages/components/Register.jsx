import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Box, Button, Input, Text, VStack } from '@chakra-ui/react'
import { FaUser, FaPhoneAlt, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'
import { register } from '../actions'
import { registerUser } from '../../utils/auth'
import { toaster } from '../../components/ui/toaster'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Register() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [fullName, setFullName] = useState('')
  const [emailOrMobile, setEmailOrMobile] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')

  const validate = () => {
    const errors = {}
    if (!fullName.trim())        errors.fullName       = 'Full name is required'
    if (!emailOrMobile.trim())   errors.emailOrMobile  = 'Mobile number is required'
    if (!email.trim())           errors.email          = 'Email is required for account recovery and notifications'
    else if (!EMAIL_RE.test(email.trim())) errors.email = 'Enter a valid email address'
    if (!password)               errors.password       = 'Password is required'
    else if (password.length < 6) errors.password      = 'Password must be at least 6 characters'

    return errors
  }

  const handleSubmit = () => {
    const errors = validate()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    setFieldErrors({})
    setError('')

    const localResult = registerUser({ name: fullName, identifier: emailOrMobile, email, password })
    if (!localResult.success) {
      setError(localResult.error)
      toaster.create({ title: 'Registration failed', description: localResult.error, type: 'error', duration: 4000, closable: true })
      return
    }

    localStorage.setItem('selektup_has_registered', 'true')
    // Best-effort: also let the backend know, if one is reachable.
    dispatch(register({ fullName, emailOrMobile, email, password }))
    toaster.create({ title: 'Account created', description: 'Please log in to continue.', type: 'success', duration: 4000, closable: true })
    navigate('/login')
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
        {/* Logo */}
        <Text fontWeight="900" fontSize="2xl" letterSpacing="-0.5px" textAlign="center" mb={1}>
          <span style={{ color: '#039BE5' }}>SeleKt</span>
          <span style={{ color: '#E91E8C' }}>Up</span>
        </Text>

        {/* Heading */}
        <VStack gap={0} mb={6} textAlign="center">
          <Text fontWeight={800} fontSize="xl" color="#0C1222">Create Your Account</Text>
          <Text fontSize="sm" color="gray.500">Join thousands of students on SeleKtUp</Text>
        </VStack>

        {/* Error alert */}
        {error && (
          <Box
            bg="red.50"
            border="1px solid"
            borderColor="red.200"
            borderRadius="lg"
            px={4}
            py={3}
            mb={5}
          >
            <Text color="red.600" fontSize="sm">{error}</Text>
          </Box>
        )}

        <VStack gap={5}>
          {/* Full Name */}
          <Box w="100%">
            <Text mb={2} fontSize="sm" fontWeight={600} color="#0C1222">Full Name</Text>
            <Box position="relative">
              <Box
                position="absolute" left={3} top="50%" transform="translateY(-50%)"
                color="gray.400" zIndex={1} pointerEvents="none"
              >
                <FaUser size={14} />
              </Box>
              <Input
                pl="36px"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value)
                  setFieldErrors((f) => ({ ...f, fullName: '' }))
                }}
                borderColor={fieldErrors.fullName ? 'red.400' : 'gray.200'}
                borderWidth="2px"
                borderRadius="lg"
                _focus={{ borderColor: '#039BE5', boxShadow: '0 0 0 3px rgba(3,155,229,0.12)' }}
                _hover={{ borderColor: '#039BE5' }}
              />
            </Box>
            {fieldErrors.fullName && (
              <Text color="red.500" fontSize="xs" mt={1}>{fieldErrors.fullName}</Text>
            )}
          </Box>

          {/* Mobile Number */}
          <Box w="100%">
            <Text mb={2} fontSize="sm" fontWeight={600} color="#0C1222">Mobile Number</Text>
            <Box position="relative">
              <Box
                position="absolute" left={3} top="50%" transform="translateY(-50%)"
                color="gray.400" zIndex={1} pointerEvents="none"
              >
                <FaPhoneAlt size={14} />
              </Box>
              <Input
                pl="36px"
                placeholder="Enter your mobile number"
                value={emailOrMobile}
                onChange={(e) => {
                  setEmailOrMobile(e.target.value)
                  setFieldErrors((f) => ({ ...f, emailOrMobile: '' }))
                }}
                borderColor={fieldErrors.emailOrMobile ? 'red.400' : 'gray.200'}
                borderWidth="2px"
                borderRadius="lg"
                _focus={{ borderColor: '#039BE5', boxShadow: '0 0 0 3px rgba(3,155,229,0.12)' }}
                _hover={{ borderColor: '#039BE5' }}
              />
            </Box>
            {fieldErrors.emailOrMobile && (
              <Text color="red.500" fontSize="xs" mt={1}>{fieldErrors.emailOrMobile}</Text>
            )}
          </Box>

          {/* Email */}
          <Box w="100%">
            <Text mb={2} fontSize="sm" fontWeight={600} color="#0C1222">Email</Text>
            <Box position="relative">
              <Box
                position="absolute" left={3} top="50%" transform="translateY(-50%)"
                color="gray.400" zIndex={1} pointerEvents="none"
              >
                <FaEnvelope size={14} />
              </Box>
              <Input
                pl="36px"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setFieldErrors((f) => ({ ...f, email: '' }))
                }}
                borderColor={fieldErrors.email ? 'red.400' : 'gray.200'}
                borderWidth="2px"
                borderRadius="lg"
                _focus={{ borderColor: '#039BE5', boxShadow: '0 0 0 3px rgba(3,155,229,0.12)' }}
                _hover={{ borderColor: '#039BE5' }}
              />
            </Box>
            {fieldErrors.email && (
              <Text color="red.500" fontSize="xs" mt={1}>{fieldErrors.email}</Text>
            )}
          </Box>

          {/* Password */}
          <Box w="100%">
            <Text mb={2} fontSize="sm" fontWeight={600} color="#0C1222">Password</Text>
            <Box position="relative">
              <Box
                position="absolute" left={3} top="50%" transform="translateY(-50%)"
                color="gray.400" zIndex={1} pointerEvents="none"
              >
                <FaLock size={14} />
              </Box>
              <Input
                pl="36px"
                pr="40px"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password (min. 6 characters)"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setFieldErrors((f) => ({ ...f, password: '' }))
                }}
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

          {/* Confirm Password */}
          {/* <Box w="100%">
            <Text mb={2} fontSize="sm" fontWeight={600} color="#0C1222">Confirm Password</Text>
            <Box position="relative">
              <Box
                position="absolute" left={3} top="50%" transform="translateY(-50%)"
                color="gray.400" zIndex={1} pointerEvents="none"
              >
                <FaLock size={14} />
              </Box>
              <Input
                pl="36px"
                pr="40px"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  setFieldErrors((f) => ({ ...f, confirmPassword: '' }))
                }}
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
          </Box> */}

          {/* Submit */}
          <Button
            w="100%"
            bg="#039BE5"
            color="white"
            fontWeight={700}
            borderRadius="lg"
            fontSize="md"
            py={6}
            onClick={handleSubmit}
            _hover={{
              bg: '#0277BD',
              transform: 'translateY(-1px)',
              boxShadow: '0 6px 20px rgba(3,155,229,0.4)',
            }}
            transition="all 0.2s"
          >
            Create Account
          </Button>
        </VStack>

        {/* Already have account */}
        <Text textAlign="center" mt={5} fontSize="sm" color="gray.500">
          Already have an account?{' '}
          <Box
            as={Link}
            to="/login"
            color="#039BE5"
            fontWeight={700}
            _hover={{ textDecoration: 'underline' }}
          >
            Login
          </Box>
        </Text>
      </Box>
    </Box>
  )
}
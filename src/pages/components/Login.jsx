import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Box, Button, HStack, Input, Text, VStack } from '@chakra-ui/react'
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'
import { login } from '../actions'
import { getLoginData } from '../selectors'
import { useDispatch, useSelector } from 'react-redux'
import { loginAdmin } from '../../utils/adminAuth'
import { loginUser } from '../../utils/auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export default function Login() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const redirect = searchParams.get('redirect')
    const loginData = useSelector(getLoginData)

  const [emailOrMobile, setEmailOrMobile] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, ] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [handledLoginData, setHandledLoginData] = useState(null)

  if (loginData && loginData.success === false && loginData !== handledLoginData) {
    setHandledLoginData(loginData)
    setError(loginData.message || 'Invalid email/mobile or password.')
  }

  const validate = () => {
    const errors = {}
    if (!emailOrMobile.trim()) errors.emailOrMobile = 'This field is required'
    if (!password.trim()) errors.password = 'This field is required'
    return errors
  }

  const handleSubmit =  () => {
    const errors = validate()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    setFieldErrors({})
    setError('')

    const adminResult = loginAdmin({ email: emailOrMobile, password })
    if (adminResult.success) {
      navigate('/admin/dashboard', { replace: true })
      return
    }

    const localResult = loginUser({ identifier: emailOrMobile, password })
    if (localResult.success) {
      navigate(redirect || '/test-series', { replace: true })
      return
    }

    // No local account matched (or backend is the source of truth) - try the API.
    dispatch(login({  emailOrMobile, password }))

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

        {/* Subtitle */}
        <VStack gap={0} mb={6} textAlign="center">
          <Text fontWeight={800} fontSize="xl" color="#0C1222">Welcome Back 👋</Text>
          <Text fontSize="sm" color="gray.500">Login to continue</Text>
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
          {/* Email / Mobile */}
          <Box w="100%">
            <Text mb={2} fontSize="sm" fontWeight={600} color="#0C1222">
              Email / Mobile Number
            </Text>
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
                <FaUser size={14} />
              </Box>
              <Input
                pl="36px"
                placeholder="Enter Email or Mobile Number"
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

          {/* Password */}
          <Box w="100%">
            <Text mb={2} fontSize="sm" fontWeight={600} color="#0C1222">
              Password
            </Text>
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
                <FaLock size={14} />
              </Box>
              <Input
                pl="36px"
                pr="40px"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter Password"
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
                position="absolute"
                right={3}
                top="50%"
                transform="translateY(-50%)"
                color="gray.400"
                cursor="pointer"
                zIndex={1}
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

          {/* Remember Me */}
          <HStack w="100%" gap={2}>
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ accentColor: '#039BE5', width: '15px', height: '15px', cursor: 'pointer' }}
            />
            <label
              htmlFor="rememberMe"
              style={{ fontSize: '14px', color: '#4A5568', cursor: 'pointer', userSelect: 'none' }}
            >
              Remember Me
            </label>
          </HStack>

          {/* Login button */}
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
            Login
          </Button>
        </VStack>

        {/* Forgot password */}
        <Text textAlign="center" mt={4} fontSize="sm">
          <Box
            as={Link}
            to="/forgot-password"
            color="#039BE5"
            fontWeight={600}
            _hover={{ textDecoration: 'underline' }}
          >
            Forgot Password?
          </Box>
        </Text>

        {/* Create account */}
        <Text textAlign="center" mt={3} fontSize="sm" color="gray.500">
          New here?{' '}
          <Box
            as={Link}
            to="/register"
            color="#039BE5"
            fontWeight={700}
            _hover={{ textDecoration: 'underline' }}
          >
            Create an account
          </Box>
        </Text>
      </Box>
    </Box>
  )
}
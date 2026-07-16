import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Box, Button, HStack, Input, Text, VStack } from '@chakra-ui/react'
import { FaUser, FaKey, FaLock, FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

// ── Step 1: enter email/mobile ──────────────────────────────────────────────
function StepRequestOtp({ onSuccess }) {
  const [emailOrMobile, setEmailOrMobile] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldError, setFieldError] = useState('')

  const handleSubmit = async () => {
    if (!emailOrMobile.trim()) {
      setFieldError('This field is required')
      return
    }
    setFieldError('')
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrMobile: emailOrMobile.trim() }),
      })
      const data = await res.json()
      if (data.success) {
        onSuccess(emailOrMobile.trim())
      } else {
        setError(data.message || 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Unable to connect to server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <VStack gap={0} mb={6} textAlign="center">
        <Text fontWeight={800} fontSize="xl" color="#0C1222">Forgot Password?</Text>
        <Text fontSize="sm" color="gray.500" mt={1}>
          Enter your registered email and we'll send you a 6-digit OTP.
        </Text>
      </VStack>

      {error && <ErrorBox message={error} />}

      <VStack gap={5}>
        <FieldWrapper
          label="Email / Mobile Number"
          icon={<FaUser size={14} />}
          error={fieldError}
        >
          <Input
            pl="36px"
            placeholder="Enter your registered email or mobile"
            value={emailOrMobile}
            onChange={(e) => {
              setEmailOrMobile(e.target.value)
              setFieldError('')
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            borderColor={fieldError ? 'red.400' : 'gray.200'}
            borderWidth="2px"
            borderRadius="lg"
            _focus={{ borderColor: '#039BE5', boxShadow: '0 0 0 3px rgba(3,155,229,0.12)' }}
            _hover={{ borderColor: '#039BE5' }}
          />
        </FieldWrapper>

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
          Send OTP
        </Button>
      </VStack>

      <Text textAlign="center" mt={5} fontSize="sm" color="gray.500">
        Remember your password?{' '}
        <Box
          as={Link}
          to="/login"
          color="#039BE5"
          fontWeight={700}
          _hover={{ textDecoration: 'underline' }}
        >
          Back to Login
        </Box>
      </Text>
    </>
  )
}

// ── Step 2: enter OTP + new password ────────────────────────────────────────
function StepResetPassword({ emailOrMobile, onSuccess }) {
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendMessage, setResendMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const passwordRules =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/

  const validate = () => {
    const errors = {}
    if (!otp.trim()) errors.otp = 'OTP is required'
    else if (!/^\d{6}$/.test(otp.trim())) errors.otp = 'OTP must be 6 digits'
    if (!newPassword) errors.newPassword = 'New password is required'
    else if (!passwordRules.test(newPassword))
      errors.newPassword =
        'Min 8 chars with uppercase, lowercase, digit & special character'
    if (!confirmPassword) errors.confirmPassword = 'Please confirm your password'
    else if (newPassword !== confirmPassword)
      errors.confirmPassword = 'Passwords do not match'
    return errors
  }

  const handleSubmit = async () => {
    const errors = validate()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    setFieldErrors({})
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailOrMobile,
          otp: otp.trim(),
          newPassword,
        }),
      })
      const data = await res.json()
      if (data.success) {
        onSuccess()
      } else {
        setError(data.message || 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Unable to connect to server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResendLoading(true)
    setResendMessage('')
    setError('')
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrMobile }),
      })
      const data = await res.json()
      if (data.success) {
        setResendMessage('A new OTP has been sent to your email.')
        setOtp('')
      } else {
        setError(data.message || 'Failed to resend OTP.')
      }
    } catch {
      setError('Unable to connect to server. Please try again.')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <>
      <VStack gap={0} mb={2} textAlign="center">
        <Text fontWeight={800} fontSize="xl" color="#0C1222">Enter OTP & New Password</Text>
        <Text fontSize="sm" color="gray.500" mt={1}>
          OTP sent to{' '}
          <Box as="span" color="#039BE5" fontWeight={600}>
            {emailOrMobile}
          </Box>
        </Text>
      </VStack>

      {error && <ErrorBox message={error} />}

      {resendMessage && (
        <Box
          bg="green.50"
          border="1px solid"
          borderColor="green.200"
          borderRadius="lg"
          px={4}
          py={3}
          mb={4}
          mt={2}
        >
          <Text color="green.700" fontSize="sm">{resendMessage}</Text>
        </Box>
      )}

      <VStack gap={5} mt={4}>
        {/* OTP */}
        <FieldWrapper label="6-Digit OTP" icon={<FaKey size={14} />} error={fieldErrors.otp}>
          <Input
            pl="36px"
            placeholder="Enter OTP from email"
            value={otp}
            maxLength={6}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, '')
              setOtp(v)
              setFieldErrors((f) => ({ ...f, otp: '' }))
            }}
            borderColor={fieldErrors.otp ? 'red.400' : 'gray.200'}
            borderWidth="2px"
            borderRadius="lg"
            letterSpacing="6px"
            fontWeight={700}
            fontSize="lg"
            _focus={{ borderColor: '#039BE5', boxShadow: '0 0 0 3px rgba(3,155,229,0.12)' }}
            _hover={{ borderColor: '#039BE5' }}
          />
        </FieldWrapper>

        {/* New Password */}
        <PasswordField
          label="New Password"
          placeholder="Enter new password"
          value={newPassword}
          show={showPassword}
          onToggle={() => setShowPassword((v) => !v)}
          onChange={(v) => {
            setNewPassword(v)
            setFieldErrors((f) => ({ ...f, newPassword: '' }))
          }}
          error={fieldErrors.newPassword}
        />

        {/* Confirm Password */}
        <PasswordField
          label="Confirm New Password"
          placeholder="Re-enter new password"
          value={confirmPassword}
          show={showConfirm}
          onToggle={() => setShowConfirm((v) => !v)}
          onChange={(v) => {
            setConfirmPassword(v)
            setFieldErrors((f) => ({ ...f, confirmPassword: '' }))
          }}
          error={fieldErrors.confirmPassword}
        />

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
      </VStack>

      <HStack justifyContent="center" mt={4} gap={1} flexWrap="wrap">
        <Text fontSize="sm" color="gray.500">Didn't receive the OTP?</Text>
        <Box
          as="button"
          fontSize="sm"
          color="#039BE5"
          fontWeight={700}
          onClick={handleResend}
          disabled={resendLoading}
          _hover={{ textDecoration: 'underline' }}
          cursor="pointer"
          bg="transparent"
          border="none"
          p={0}
        >
          {resendLoading ? 'Resending…' : 'Resend OTP'}
        </Box>
      </HStack>
    </>
  )
}

// ── Step 3: success ──────────────────────────────────────────────────────────
function StepSuccess() {
  return (
    <VStack gap={4} py={6} textAlign="center">
      <Box color="green.400" fontSize="56px">
        <FaCheckCircle />
      </Box>
      <Text fontWeight={800} fontSize="xl" color="#0C1222">Password Reset!</Text>
      <Text fontSize="sm" color="gray.500" maxW="320px">
        Your password has been updated successfully. You can now log in with your new password.
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
        Go to Login
      </Button>
    </VStack>
  )
}

// ── Shared sub-components ────────────────────────────────────────────────────
function ErrorBox({ message }) {
  return (
    <Box
      bg="red.50"
      border="1px solid"
      borderColor="red.200"
      borderRadius="lg"
      px={4}
      py={3}
      mb={4}
    >
      <Text color="red.600" fontSize="sm">{message}</Text>
    </Box>
  )
}

function FieldWrapper({ label, icon, error, children }) {
  return (
    <Box w="100%">
      <Text mb={2} fontSize="sm" fontWeight={600} color="#0C1222">{label}</Text>
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
          {icon}
        </Box>
        {children}
      </Box>
      {error && <Text color="red.500" fontSize="xs" mt={1}>{error}</Text>}
    </Box>
  )
}

function PasswordField({ label, placeholder, value, show, onToggle, onChange, error }) {
  return (
    <FieldWrapper label={label} icon={<FaLock size={14} />} error={error}>
      <Input
        pl="36px"
        pr="40px"
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        borderColor={error ? 'red.400' : 'gray.200'}
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
        onClick={onToggle}
        _hover={{ color: '#039BE5' }}
      >
        {show ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
      </Box>
    </FieldWrapper>
  )
}

// ── Root component ───────────────────────────────────────────────────────────
export default function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)          // 1 = request OTP, 2 = reset, 3 = success
  const [emailOrMobile, setEmailOrMobile] = useState('')

  const handleOtpSent = (value) => {
    setEmailOrMobile(value)
    setStep(2)
  }

  const handleResetSuccess = () => {
    setStep(3)
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

        {/* Step indicator dots */}
        {step < 3 && (
          <HStack justifyContent="center" gap={2} mb={5}>
            {[1, 2].map((s) => (
              <Box
                key={s}
                w={step === s ? '20px' : '8px'}
                h="8px"
                borderRadius="full"
                bg={step >= s ? '#039BE5' : 'gray.200'}
                transition="all 0.3s"
              />
            ))}
          </HStack>
        )}

        {step === 1 && <StepRequestOtp onSuccess={handleOtpSent} />}
        {step === 2 && (
          <StepResetPassword
            emailOrMobile={emailOrMobile}
            onSuccess={handleResetSuccess}
          />
        )}
        {step === 3 && <StepSuccess />}
      </Box>
    </Box>
  )
}
import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Button, Input, Text, VStack } from '@chakra-ui/react'
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'
import { changePassword } from '../actions'
import { actions } from '../slice'
import { getApiLoading, getChangePasswordData } from '../selectors'
import { isLoggedIn } from '../../utils/auth'

export default function ChangePassword() {
  const dispatch = useDispatch()
  const loading = useSelector(getApiLoading)
  const changePasswordData = useSelector(getChangePasswordData)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [handledResult, setHandledResult] = useState(changePasswordData)

 
  if (changePasswordData && changePasswordData !== handledResult) {
    setHandledResult(changePasswordData)
    if (changePasswordData.success) {
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setFieldErrors({})
    } else {
      setFieldErrors((f) => ({ ...f, currentPassword: changePasswordData.message || 'Current password is incorrect' }))
    }
  }

  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />
  }

  const validate = () => {
    const errors = {}
    if (!currentPassword) errors.currentPassword = 'Enter your current password'
    if (!newPassword) errors.newPassword = 'Enter a new password'
    else if (newPassword.length < 6) errors.newPassword = 'New password must be at least 6 characters'
    if (!confirmPassword) errors.confirmPassword = 'Please confirm your new password'
    else if (newPassword !== confirmPassword) errors.confirmPassword = 'Passwords do not match'
    if (currentPassword && newPassword && currentPassword === newPassword) {
      errors.newPassword = 'New password must be different from your current password'
    }
    return errors
  }

  const handleSubmit = () => {
    const errors = validate()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    setFieldErrors({})
    dispatch(actions.clearChangePasswordStatus())
    dispatch(changePassword({ currentPassword, newPassword }))
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

        <VStack gap={5} textAlign="center">
          <Box color="#039BE5" fontSize="48px">
            <FaLock />
          </Box>
          <Text fontWeight={800} fontSize="xl" color="#0C1222">Change Password</Text>
          <Text fontSize="sm" color="gray.500" maxW="340px">
            Enter your current password and choose a new one.
          </Text>

          <Box w="100%" textAlign="left">
            <Text mb={2} fontSize="sm" fontWeight={600} color="#0C1222">Current Password</Text>
            <Box position="relative">
              <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" color="gray.400" zIndex={1} pointerEvents="none">
                <FaLock size={14} />
              </Box>
              <Input
                pl="36px"
                pr="40px"
                type={showCurrent ? 'text' : 'password'}
                placeholder="Enter your current password"
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value)
                  setFieldErrors((f) => ({ ...f, currentPassword: '' }))
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                borderColor={fieldErrors.currentPassword ? 'red.400' : 'gray.200'}
                borderWidth="2px"
                borderRadius="lg"
                _focus={{ borderColor: '#039BE5', boxShadow: '0 0 0 3px rgba(3,155,229,0.12)' }}
                _hover={{ borderColor: '#039BE5' }}
              />
              <Box
                position="absolute" right={3} top="50%" transform="translateY(-50%)"
                color="gray.400" cursor="pointer" zIndex={1}
                onClick={() => setShowCurrent((v) => !v)}
                _hover={{ color: '#039BE5' }}
              >
                {showCurrent ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </Box>
            </Box>
            {fieldErrors.currentPassword && (
              <Text color="red.500" fontSize="xs" mt={1}>{fieldErrors.currentPassword}</Text>
            )}
          </Box>

          <Box w="100%" textAlign="left">
            <Text mb={2} fontSize="sm" fontWeight={600} color="#0C1222">New Password</Text>
            <Box position="relative">
              <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" color="gray.400" zIndex={1} pointerEvents="none">
                <FaLock size={14} />
              </Box>
              <Input
                pl="36px"
                pr="40px"
                type={showNew ? 'text' : 'password'}
                placeholder="Min. 6 characters"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value)
                  setFieldErrors((f) => ({ ...f, newPassword: '' }))
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                borderColor={fieldErrors.newPassword ? 'red.400' : 'gray.200'}
                borderWidth="2px"
                borderRadius="lg"
                _focus={{ borderColor: '#039BE5', boxShadow: '0 0 0 3px rgba(3,155,229,0.12)' }}
                _hover={{ borderColor: '#039BE5' }}
              />
              <Box
                position="absolute" right={3} top="50%" transform="translateY(-50%)"
                color="gray.400" cursor="pointer" zIndex={1}
                onClick={() => setShowNew((v) => !v)}
                _hover={{ color: '#039BE5' }}
              >
                {showNew ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </Box>
            </Box>
            {fieldErrors.newPassword && (
              <Text color="red.500" fontSize="xs" mt={1}>{fieldErrors.newPassword}</Text>
            )}
          </Box>

          <Box w="100%" textAlign="left">
            <Text mb={2} fontSize="sm" fontWeight={600} color="#0C1222">Confirm New Password</Text>
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
            Change Password
          </Button>

          <Text fontSize="sm" color="gray.500">
            <Box as={Link} to="/" color="#039BE5" fontWeight={700} _hover={{ textDecoration: 'underline' }}>
              Back to Home
            </Box>
          </Text>
        </VStack>
      </Box>
    </Box>
  )
}

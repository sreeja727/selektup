import { useState } from 'react'
import {
  Box,
  Button,
  Grid,
  GridItem,
  Input,
  NativeSelect,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react'
import { toaster } from '../../components/ui/toaster'

// TODO: update VITE_API_BASE_URL in .env to match your backend port (currently 8081)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const EMPTY_FORM = { name: '', email: '', phone: '', district: '', message: '' }

export default function ContactForm() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [fieldErrors, setFieldErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    // Clear the inline error for this field as the user types
    if (fieldErrors[name]) setFieldErrors((fe) => ({ ...fe, [name]: '' }))
    if (apiError) setApiError('')
    if (successMsg) setSuccessMsg('')
  }

  const validate = () => {
    const errors = {}
    if (!form.name.trim())     errors.name     = 'Name is required'
    if (!form.district.trim()) errors.district = 'District is required'
    if (!form.phone.trim())    errors.phone    = 'Phone number is required'
    if (!form.message.trim())  errors.message  = 'Message is required'
    if (form.email.trim() && !EMAIL_RE.test(form.email.trim()))
      errors.email = 'Enter a valid email address'
    return errors
  }

  const handleSubmit = async () => {
    const errors = validate()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    setFieldErrors({})
    setApiError('')
    setSuccessMsg('')
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE_URL}/api/home/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:     form.name.trim(),
          email:    form.email.trim() || null,
          phone:    form.phone.trim(),
          district: form.district.trim(),
          message:  form.message.trim(),
        }),
      })
      const data = await res.json()
      if (data.success) {
        setForm(EMPTY_FORM)
        const message = data.message || "Thanks! We'll get back to you soon."
        setSuccessMsg(message)
        toaster.create({ title: 'Enquiry submitted', description: message, type: 'success', duration: 4000, closable: true })
      } else {
        const message = data.message || 'Something went wrong. Please try again.'
        setApiError(message)
        toaster.create({ title: 'Submission failed', description: message, type: 'error', duration: 4000, closable: true })
      }
    } catch {
      const message = 'Unable to connect to server. Please try again.'
      setApiError(message)
      toaster.create({ title: 'Submission failed', description: message, type: 'error', duration: 4000, closable: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box bg="#F8F9FA" minH="calc(100vh - 88px)">

      {/* ── Thin gradient banner strip ── */}
      <Box
        h="8px"
        bg="linear-gradient(135deg, #0C1222 0%, #1a0830 50%, #0277BD 100%)"
      />

      {/* ── Card area ── */}
      <Box maxW="860px" mx="auto" px={{ base: 4, md: 8 }} py={{ base: 10, md: 16 }}>
        <Box
          bg="white"
          borderRadius="2xl"
          p={{ base: 6, md: 10 }}
          boxShadow="0 4px 28px rgba(0,0,0,0.09)"
          border="1px solid"
          borderColor="gray.100"
        >
          {/* Heading */}
          <Text fontSize="2xl" fontWeight={800} color="#0C1222" mb={1}>
            Enquiry Form
          </Text>
          <Text fontSize="sm" color="gray.500" mb={8}>
            All fields marked{' '}
            <Box as="span" color="#E91E8C" fontWeight={700}>*</Box>
            {' '}are required.
          </Text>

          {/* API success alert */}
          {successMsg && (
            <Box
              bg="green.50"
              border="1px solid"
              borderColor="green.300"
              borderRadius="lg"
              px={4}
              py={3}
              mb={6}
              display="flex"
              alignItems="center"
              gap={2}
            >
              <Box color="green.500" fontSize="lg" lineHeight={1}>✓</Box>
              <Text color="green.700" fontSize="sm" fontWeight={600}>{successMsg}</Text>
            </Box>
          )}

          {/* API error alert */}
          {apiError && (
            <Box
              bg="red.50"
              border="1px solid"
              borderColor="red.200"
              borderRadius="lg"
              px={4}
              py={3}
              mb={6}
            >
              <Text color="red.600" fontSize="sm">{apiError}</Text>
            </Box>
          )}

          <VStack gap={6}>
            {/* Row 1: Name + Email */}
            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
              gap={6}
              w="100%"
            >
              <GridItem>
                <FieldLabel>Name <Asterisk /></FieldLabel>
                <Input
                  name="name"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange}
                  borderColor={fieldErrors.name ? 'red.400' : 'gray.200'}
                  borderWidth="2px"
                  borderRadius="lg"
                  _focus={{ borderColor: '#E91E8C', boxShadow: '0 0 0 3px rgba(233,30,140,0.12)' }}
                  _hover={{ borderColor: '#E91E8C' }}
                />
                <FieldError msg={fieldErrors.name} />
              </GridItem>

              <GridItem>
                <FieldLabel>Email</FieldLabel>
                <Input
                  name="email"
                  placeholder="Enter valid email id"
                  value={form.email}
                  onChange={handleChange}
                  borderColor={fieldErrors.email ? 'red.400' : 'gray.200'}
                  borderWidth="2px"
                  borderRadius="lg"
                  _focus={{ borderColor: '#039BE5', boxShadow: '0 0 0 3px rgba(3,155,229,0.12)' }}
                  _hover={{ borderColor: '#039BE5' }}
                />
                <FieldError msg={fieldErrors.email} />
              </GridItem>

              {/* Row 2: District + Phone */}
              <GridItem>
                <FieldLabel>District <Asterisk /></FieldLabel>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    name="district"
                    value={form.district}
                    onChange={handleChange}
                    borderColor={fieldErrors.district ? 'red.400' : 'gray.200'}
                    borderWidth="2px"
                    borderRadius="lg"
                    _focus={{ borderColor: '#E91E8C', boxShadow: '0 0 0 3px rgba(233,30,140,0.12)' }}
                    _hover={{ borderColor: '#E91E8C' }}
                  >
                    <option value="" disabled>Select your district</option>
                    <option value="Thiruvananthapuram">Thiruvananthapuram</option>
                    <option value="Kollam">Kollam</option>
                    <option value="Pathanamthitta">Pathanamthitta</option>
                    <option value="Alappuzha">Alappuzha</option>
                    <option value="Kottayam">Kottayam</option>
                    <option value="Idukki">Idukki</option>
                    <option value="Ernakulam">Ernakulam</option>
                    <option value="Thrissur">Thrissur</option>
                    <option value="Palakkad">Palakkad</option>
                    <option value="Malappuram">Malappuram</option>
                    <option value="Kozhikode">Kozhikode</option>
                    <option value="Wayanad">Wayanad</option>
                    <option value="Kannur">Kannur</option>
                    <option value="Kasaragod">Kasaragod</option>
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
                <FieldError msg={fieldErrors.district} />
              </GridItem>

              <GridItem>
                <FieldLabel>Phone Number <Asterisk /></FieldLabel>
                <Input
                  name="phone"
                  placeholder="Enter phone number"
                  value={form.phone}
                  onChange={handleChange}
                  borderColor={fieldErrors.phone ? 'red.400' : 'gray.200'}
                  borderWidth="2px"
                  borderRadius="lg"
                  _focus={{ borderColor: '#E91E8C', boxShadow: '0 0 0 3px rgba(233,30,140,0.12)' }}
                  _hover={{ borderColor: '#E91E8C' }}
                />
                <FieldError msg={fieldErrors.phone} />
              </GridItem>
            </Grid>

            {/* Message — full width */}
            <Box w="100%">
              <FieldLabel>Message <Asterisk /></FieldLabel>
              <Textarea
                name="message"
                placeholder="Write your message..."
                value={form.message}
                onChange={handleChange}
                rows={5}
                borderColor={fieldErrors.message ? 'red.400' : 'gray.200'}
                borderWidth="2px"
                borderRadius="lg"
                resize="vertical"
                _focus={{ borderColor: '#E91E8C', boxShadow: '0 0 0 3px rgba(233,30,140,0.12)' }}
                _hover={{ borderColor: '#E91E8C' }}
              />
              <FieldError msg={fieldErrors.message} />
            </Box>

            {/* Submit — left-aligned, content-width */}
            <Box w="100%" display="flex">
              <Button
                bg="#E91E8C"
                color="white"
                px={10}
                py={6}
                borderRadius="lg"
                fontWeight={700}
                fontSize="md"
                onClick={handleSubmit}
                loading={loading}
                disabled={loading}
                _hover={{
                  bg: '#C2185B',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(233,30,140,0.4)',
                }}
                transition="all 0.25s"
              >
                Submit Enquiry
              </Button>
            </Box>
          </VStack>
        </Box>
      </Box>
    </Box>
  )
}

// ── Small reusable sub-components ────────────────────────────────────────────

function FieldLabel({ children }) {
  return (
    <Text mb={2} fontSize="sm" fontWeight={600} color="#0C1222">
      {children}
    </Text>
  )
}

function Asterisk() {
  return <Box as="span" color="#E91E8C">{' '}*</Box>
}

function FieldError({ msg }) {
  if (!msg) return null
  return <Text color="red.500" fontSize="xs" mt={1}>{msg}</Text>
}
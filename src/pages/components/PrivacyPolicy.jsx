import { Box, Container, Heading, Text, VStack, HStack, Flex, List, Separator } from "@chakra-ui/react";
import {
  FaUserShield, FaDatabase, FaCookieBite, FaShareAlt, FaLock, FaGlobe,
  FaChild, FaHandsHelping, FaUserSlash, FaEdit, FaEnvelope, FaCheckCircle,
} from "react-icons/fa";

function Bullets({ items }) {
  return (
    <List.Root gap={2.5} w="full">
      {items.map((item) => (
        <List.Item key={item} display="flex" alignItems="flex-start" gap={2.5}>
          <List.Indicator asChild color="#E91E8C" mt="5px" flexShrink={0}>
            <FaCheckCircle size={12} />
          </List.Indicator>
          <Text color="gray.600" lineHeight={1.8} fontSize="md">{item}</Text>
        </List.Item>
      ))}
    </List.Root>
  );
}

function PolicyPoint({ icon, title, children }) {
  const Icon = icon;
  return (
    <Box py={{ base: 6, md: 7 }}>
      <HStack gap={4} align="center" mb={4}>
        <Flex
          flexShrink={0}
          w={10}
          h={10}
          borderRadius="lg"
          align="center"
          justify="center"
          bg="linear-gradient(135deg, #E91E8C22, #E91E8C11)"
          color="#E91E8C"
        >
          <Icon size={17} />
        </Flex>
        <Heading fontSize={{ base: "md", md: "lg" }} fontWeight={800} color="#0C1222">
          {title}
        </Heading>
      </HStack>
      <VStack align="flex-start" gap={4} pl={{ base: 0, md: 14 }}>
        {children}
      </VStack>
      <Separator mt={{ base: 6, md: 7 }} borderColor="gray.100" />
    </Box>
  );
}

export default function PrivacyPolicy() {
  return (
    <Box bg="gray.50" minH="100vh">
      {/* Hero banner */}
      <Box
        bg="linear-gradient(135deg, #0C1222 0%, #0d2045 60%, #0a3060 100%)"
        py={{ base: 16, md: 24 }}
        position="relative"
        overflow="hidden"
      >
        <Box position="absolute" top="-60px" right="-60px" w="300px" h="300px" borderRadius="full"
          border="2px solid rgba(233,30,140,0.18)" />
        <Box position="absolute" bottom="-80px" left="-80px" w="340px" h="340px" borderRadius="full"
          border="2px solid rgba(3,155,229,0.15)" />
        <Box position="absolute" top="30%" right="15%" w="120px" h="120px" borderRadius="full"
          bg="rgba(233,30,140,0.07)" />

        <Container maxW="7xl" position="relative" zIndex={1}>
          <VStack gap={4} textAlign="center" color="white">
            <Text fontSize="xs" fontWeight={800} letterSpacing="0.18em" textTransform="uppercase" color="#E91E8C">
              Selektup
            </Text>
            <Heading fontSize={{ base: "3xl", md: "5xl" }} fontWeight={900} lineHeight={1.15}>
              Privacy <Box as="span" color="#E91E8C">Policy</Box>
            </Heading>
            <Text color="gray.300" maxW="2xl" fontSize={{ base: "sm", md: "md" }} lineHeight={1.8}>
              A quick, plain-language look at how we collect, use and protect your data.
            </Text>
            <HStack
              bg="rgba(255,255,255,0.08)"
              border="1px solid rgba(255,255,255,0.15)"
              borderRadius="full"
              px={5}
              py={2}
              mt={2}
            >
              <Text fontSize="sm" color="gray.200">
                <Box as="span" color="#E91E8C" fontWeight={700}>Effective Date:</Box> July 1, 2026
              </Text>
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* Single content container */}
      <Container maxW="5xl" mt={{ base: -10, md: -14 }} pb={{ base: 14, md: 20 }} position="relative" zIndex={2}>
        <Box
          bg="white"
          borderRadius="2xl"
          boxShadow="0 12px 40px rgba(0,0,0,0.12)"
          border="1px solid"
          borderColor="gray.100"
          px={{ base: 6, md: 10 }}
          py={{ base: 2, md: 4 }}
        >
          <Box py={{ base: 6, md: 7 }}>
            <Text color="gray.600" lineHeight={1.9} fontSize="md">
              Welcome to <Box as="span" fontWeight={700} color="#0C1222">SelektUp</Box>. We value your
              privacy here's a short summary of what we collect, why, and how we keep it safe.
            </Text>
            <Separator mt={{ base: 6, md: 7 }} borderColor="gray.100" />
          </Box>

          <PolicyPoint icon={FaDatabase} title="1. Information We Collect">
            <Bullets items={[
              "Personal details — name, email, phone, and DOB or photo if provided.",
              "Educational info — exam stage, qualification and subject interests.",
              "Usage data — login activity, device/browser info, course and quiz progress.",
              "Communication — messages when you contact support or share feedback.",
            ]} />
            <Text color="gray.600" lineHeight={1.9} fontSize="md">
              Payments are handled by secure third-party gateways we never store your card, UPI or
              banking details.
            </Text>
          </PolicyPoint>

          <PolicyPoint icon={FaUserShield} title="2. How We Use Your Information">
            <Bullets items={[
              "Manage your account and deliver courses, quizzes and mock tests.",
              "Personalize your learning and track progress.",
              "Send account and course notifications.",
              "Improve our platform and respond to support requests.",
              "Prevent fraud and meet legal obligations.",
            ]} />
          </PolicyPoint>

          <PolicyPoint icon={FaCookieBite} title="3. Cookies & Tracking">
            <Text color="gray.600" lineHeight={1.9} fontSize="md">
              Cookies keep you signed in, remember your preferences, and help us understand how
              SelektUp is used. You can disable them in your browser anytime, though some features
              may not work as expected.
            </Text>
          </PolicyPoint>

          <PolicyPoint icon={FaShareAlt} title="4. Sharing of Information">
            <Text color="gray.600" lineHeight={1.9} fontSize="md">
              We never sell or rent your data. It's shared only with trusted partners who help us
              operate payment, hosting and analytics providers  or when required by law.
            </Text>
          </PolicyPoint>

          <PolicyPoint icon={FaLock} title="5. Data Security & Retention">
            <Text color="gray.600" lineHeight={1.9} fontSize="md">
              We use industry-standard safeguards to protect your information, though no online
              service can guarantee absolute security. We keep your data only as long as needed to
              provide our services or meet legal requirements.
            </Text>
          </PolicyPoint>

          <PolicyPoint icon={FaGlobe} title="6. Third-Party & Public Content">
            <Text color="gray.600" lineHeight={1.9} fontSize="md">
              SelektUp may link to third-party tools (video, analytics, payments) with their own
              privacy practices. Anything you post in forums or discussions is visible to other
              users, so please avoid sharing sensitive details publicly.
            </Text>
          </PolicyPoint>

          <PolicyPoint icon={FaChild} title="7. Children's Privacy">
            <Text color="gray.600" lineHeight={1.9} fontSize="md">
              SelektUp is built for students preparing for competitive exams. Users under 18 should
              use the platform with a parent or guardian's guidance.
            </Text>
          </PolicyPoint>

          <PolicyPoint icon={FaHandsHelping} title="8. Your Rights">
            <Bullets items={[
              "Access, update or correct your personal information.",
              "Request deletion of your account.",
              "Withdraw consent or raise privacy concerns anytime.",
            ]} />
          </PolicyPoint>

          <PolicyPoint icon={FaUserSlash} title="9. Account Deletion & Refunds">
            <Text color="gray.600" lineHeight={1.9} fontSize="md">
              Request account deletion anytime by contacting support  we'll process it within a
              reasonable time, subject to legal retention needs. Course purchases are generally
              non-refundable once access is granted, unless stated otherwise in our Refund Policy.
            </Text>
          </PolicyPoint>

          <PolicyPoint icon={FaEdit} title="10. Policy Updates">
            <Text color="gray.600" lineHeight={1.9} fontSize="md">
              We may update this policy as our services evolve. Changes will be posted here with a
              revised effective date 
               continued use means you accept the update.
            </Text>
          </PolicyPoint>

          <Box py={{ base: 6, md: 7 }}>
            <HStack gap={4} align="center" mb={4}>
              <Flex
                flexShrink={0}
                w={10}
                h={10}
                borderRadius="lg"
                align="center"
                justify="center"
                bg="linear-gradient(135deg, #E91E8C22, #E91E8C11)"
                color="#E91E8C"
              >
                <FaEnvelope size={17} />
              </Flex>
              <Heading fontSize={{ base: "md", md: "lg" }} fontWeight={800} color="#0C1222">
                11. Contact Us
              </Heading>
            </HStack>
            <VStack align="flex-start" gap={4} pl={{ base: 0, md: 14 }}>
              <Text color="gray.600" lineHeight={1.9} fontSize="md" fontWeight={700}>SelektUP</Text>
              <Text color="gray.600" lineHeight={1.9} fontSize="md">Email: support@selektup.com</Text>
              <Text color="gray.600" lineHeight={1.9} fontSize="md">Website: https://selektup.com</Text>
            </VStack>
          </Box>

          <Box
            bg="pink.50"
            borderLeft="4px solid #E91E8C"
            borderRadius="md"
            px={{ base: 5, md: 7 }}
            py={{ base: 5, md: 6 }}
            mb={{ base: 6, md: 8 }}
          >
            <Text color="#0C1222" fontWeight={700} fontSize="md" fontStyle="italic" lineHeight={1.8}>
              By accessing or using SelektUp, you acknowledge that you have read, understood and
              agreed to this Privacy Policy.
            </Text>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

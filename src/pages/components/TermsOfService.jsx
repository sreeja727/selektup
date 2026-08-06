import { Box, Container, Heading, Text, VStack, HStack, Flex, List, Separator } from "@chakra-ui/react";
import {
  FaIdBadge, FaUserShield, FaGraduationCap, FaBan, FaCopyright, FaCreditCard,
  FaUndo, FaCommentDots, FaServer, FaExclamationCircle, FaBalanceScale,
  FaUserSlash, FaLock, FaEdit, FaGavel, FaEnvelope, FaCheckCircle,
} from "react-icons/fa";

function Bullets({ items }) {
  return (
    <List.Root gap={2.5} w="full">
      {items.map((item) => (
        <List.Item key={item} display="flex" alignItems="flex-start" gap={2.5}>
          <List.Indicator asChild color="#039BE5" mt="5px" flexShrink={0}>
            <FaCheckCircle size={12} />
          </List.Indicator>
          <Text color="gray.600" lineHeight={1.8} fontSize="md">{item}</Text>
        </List.Item>
      ))}
    </List.Root>
  );
}

function TermPoint({ icon, title, children }) {
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
          bg="linear-gradient(135deg, #039BE522, #039BE511)"
          color="#039BE5"
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

export default function TermsOfService() {
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
          border="2px solid rgba(3,155,229,0.18)" />
        <Box position="absolute" bottom="-80px" left="-80px" w="340px" h="340px" borderRadius="full"
          border="2px solid rgba(233,30,140,0.15)" />
        <Box position="absolute" top="30%" right="15%" w="120px" h="120px" borderRadius="full"
          bg="rgba(3,155,229,0.07)" />

        <Container maxW="7xl" position="relative" zIndex={1}>
          <VStack gap={4} textAlign="center" color="white">
            <Text fontSize="xs" fontWeight={800} letterSpacing="0.18em" textTransform="uppercase" color="#039BE5">
              Selektup
            </Text>
            <Heading fontSize={{ base: "3xl", md: "5xl" }} fontWeight={900} lineHeight={1.15}>
              Terms of <Box as="span" color="#039BE5">Service</Box>
            </Heading>
            <Text color="gray.300" maxW="2xl" fontSize={{ base: "sm", md: "md" }} lineHeight={1.8}>
              The rules and guidelines that govern your use of SelektUp's courses, mock tests and
              learning platform.
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
                <Box as="span" color="#039BE5" fontWeight={700}>Effective Date:</Box> July 1, 2026
              </Text>
            </HStack>
          </VStack>
        </Container>
      </Box>

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
              Welcome to <Box as="span" fontWeight={700} color="#0C1222">SelektUp</Box>. These Terms
              of Service govern your access to and use of our website, learning platform, courses,
              mock tests, study materials and related services.
            </Text>
            <Separator mt={{ base: 6, md: 7 }} borderColor="gray.100" />
          </Box>

          <TermPoint icon={FaIdBadge} title="1. Eligibility">
            <Text color="gray.600" lineHeight={1.9} fontSize="md">
              You must be at least 13 years old to use SelektUp. Users below 18 years should use the
              platform under the guidance of a parent or legal guardian.
            </Text>
          </TermPoint>

          <TermPoint icon={FaUserShield} title="2. User Account">
            <Bullets items={[
              "Provide accurate registration details.",
              "Keep your password confidential.",
              "Update your profile when necessary.",
              "Be responsible for all activities under your account.",
            ]} />
          </TermPoint>

          <TermPoint icon={FaGraduationCap} title="3. Educational Services">
            <Text color="gray.600" lineHeight={1.9} fontSize="md" mb={1}>
              SelektUp provides:
            </Text>
            <Bullets items={[
              "UPSC courses and video lectures",
              "Study notes and current affairs",
              "Mock tests and practice quizzes",
              "Previous year questions",
              "Performance analysis",
            ]} />
          </TermPoint>

          <TermPoint icon={FaBan} title="4. Acceptable Use">
            <Text color="gray.600" lineHeight={1.9} fontSize="md" mb={1}>
              Users must not:
            </Text>
            <Bullets items={[
              "Share account credentials.",
              "Copy or redistribute course materials.",
              "Upload harmful software.",
              "Attempt unauthorized access.",
              "Harass other users.",
              "Use the platform illegally.",
            ]} />
          </TermPoint>

          <TermPoint icon={FaCopyright} title="5. Intellectual Property">
            <Text color="gray.600" lineHeight={1.9} fontSize="md">
              All videos, notes, quizzes, graphics, logos, study materials and website content
              belong to SelektUp and are protected by copyright and intellectual property laws.
            </Text>
          </TermPoint>

          <TermPoint icon={FaCreditCard} title="6. Payments & Subscriptions">
            <Text color="gray.600" lineHeight={1.9} fontSize="md">
              Premium courses require payment through secure third-party payment gateways.
              Subscription benefits remain active during the purchased period.
            </Text>
          </TermPoint>

          <TermPoint icon={FaUndo} title="7. Refund Policy">
            <Text color="gray.600" lineHeight={1.9} fontSize="md">
              Refund requests are governed by our Refund Policy. Unless otherwise specified,
              purchases are generally non-refundable after course access has been granted.
            </Text>
          </TermPoint>

          <TermPoint icon={FaCommentDots} title="8. User Content">
            <Text color="gray.600" lineHeight={1.9} fontSize="md">
              Users retain ownership of the content they submit, such as comments, questions and
              discussions. SelektUp reserves the right to remove content that violates these Terms.
            </Text>
          </TermPoint>

          <TermPoint icon={FaServer} title="9. Service Availability">
            <Text color="gray.600" lineHeight={1.9} fontSize="md">
              We strive to provide uninterrupted access to the platform. However, maintenance,
              upgrades or technical issues may occasionally cause temporary interruptions.
            </Text>
          </TermPoint>

          <TermPoint icon={FaExclamationCircle} title="10. Disclaimer">
            <Text color="gray.600" lineHeight={1.9} fontSize="md">
              SelektUp provides educational guidance only. We do not guarantee UPSC success,
              government employment or any particular examination score.
            </Text>
          </TermPoint>

          <TermPoint icon={FaBalanceScale} title="11. Limitation of Liability">
            <Text color="gray.600" lineHeight={1.9} fontSize="md">
              SelektUp shall not be liable for data loss, service interruptions, examination
              outcomes or any indirect damages resulting from the use of the platform.
            </Text>
          </TermPoint>

          <TermPoint icon={FaUserSlash} title="12. Suspension & Termination">
            <Text color="gray.600" lineHeight={1.9} fontSize="md">
              We reserve the right to suspend or permanently terminate accounts that violate these
              Terms or misuse our services.
            </Text>
          </TermPoint>

          <TermPoint icon={FaLock} title="13. Privacy">
            <Text color="gray.600" lineHeight={1.9} fontSize="md">
              Your use of SelektUp is also governed by our Privacy Policy.
            </Text>
          </TermPoint>

          <TermPoint icon={FaEdit} title="14. Changes to Terms">
            <Text color="gray.600" lineHeight={1.9} fontSize="md">
              We may revise these Terms from time to time. Continued use of the platform after
              updates indicates your acceptance of the revised Terms.
            </Text>
          </TermPoint>

          <TermPoint icon={FaGavel} title="15. Governing Law">
            <Text color="gray.600" lineHeight={1.9} fontSize="md">
              These Terms are governed by the laws of India.
            </Text>
          </TermPoint>

          <Box py={{ base: 6, md: 7 }}>
            <HStack gap={4} align="center" mb={4}>
              <Flex
                flexShrink={0}
                w={10}
                h={10}
                borderRadius="lg"
                align="center"
                justify="center"
                bg="linear-gradient(135deg, #039BE522, #039BE511)"
                color="#039BE5"
              >
                <FaEnvelope size={17} />
              </Flex>
              <Heading fontSize={{ base: "md", md: "lg" }} fontWeight={800} color="#0C1222">
                16. Contact Us
              </Heading>
            </HStack>
            <VStack align="flex-start" gap={4} pl={{ base: 0, md: 14 }}>
              <Text color="gray.600" lineHeight={1.9} fontSize="md" fontWeight={700}>SelektUp</Text>
              <Text color="gray.600" lineHeight={1.9} fontSize="md">Email: support@selektup.com</Text>
              <Text color="gray.600" lineHeight={1.9} fontSize="md">Website: https://selektup.com</Text>
            </VStack>
          </Box>

          <Box
            bg="blue.50"
            borderLeft="4px solid #039BE5"
            borderRadius="md"
            px={{ base: 5, md: 7 }}
            py={{ base: 5, md: 6 }}
            mb={{ base: 6, md: 8 }}
          >
            <Text color="#0C1222" fontWeight={700} fontSize="md" fontStyle="italic" lineHeight={1.8}>
              By using SelektUp, you acknowledge that you have read, understood and agreed to these
              Terms of Service.
            </Text>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

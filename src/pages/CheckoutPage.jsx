import { useState } from "react";
import { Link as RouterLink, useParams, useNavigate, Navigate } from "react-router-dom";
import { Box, Container, Stack, HStack, Text, Heading, Button } from "@chakra-ui/react";
import { FaArrowLeft, FaCheckCircle, FaLock, FaClipboardList, FaClock } from "react-icons/fa";
import { getTest } from "../data/testSeries";
import { isLoggedIn } from "../utils/auth";
import { isPurchased, purchaseTest } from "../utils/purchases";

export default function CheckoutPage() {
  const { categorySlug, testSlug } = useParams();
  const navigate = useNavigate();
  const [paid, setPaid] = useState(false);
  const result = getTest(categorySlug, testSlug);

  if (!result) return <Navigate to="/test-series" replace />;

  if (!isLoggedIn()) {
    return <Navigate to={`/login?redirect=/checkout/${categorySlug}/${testSlug}`} replace />;
  }

  const { category, test } = result;

  if (isPurchased(categorySlug, testSlug) && !paid) {
    return <Navigate to={`/test-series/${categorySlug}/${testSlug}`} replace />;
  }

  function handlePay() {
    purchaseTest(categorySlug, testSlug);
    setPaid(true);
  }

  return (
    <Box bg="#F8F9FA" minH="70vh" py={{ base: 12, md: 16 }}>
      <Container maxW="lg">
        <Stack gap={6}>
          {!paid && (
            <HStack
              as={RouterLink}
              to={`/test-series/${categorySlug}`}
              gap={2}
              color="gray.500"
              fontSize="sm"
              fontWeight={600}
              _hover={{ color: category.color, textDecoration: "none" }}
              w="fit-content"
            >
              <FaArrowLeft size={12} />
              <Text>{category.title}</Text>
            </HStack>
          )}

          <Box
            bg="white"
            borderRadius="2xl"
            border="1px solid"
            borderColor="gray.100"
            boxShadow="0 2px 14px rgba(0,0,0,0.06)"
            p={{ base: 6, md: 10 }}
          >
            {!paid ? (
              <Stack gap={6}>
                <Stack gap={1}>
                  <Text fontSize="xs" fontWeight={700} color={category.color} textTransform="uppercase" letterSpacing="0.08em">
                    {category.title}
                  </Text>
                  <Heading fontSize={{ base: "xl", md: "2xl" }} fontWeight={900} color="#0C1222">
                    {test.title}
                  </Heading>
                </Stack>

                <Stack gap={3} bg="#F8F9FA" borderRadius="xl" p={5}>
                  <HStack justify="space-between">
                    <HStack gap={2} color="gray.600" fontSize="sm">
                      <FaClipboardList size={12} />
                      <Text>{test.questions} Questions</Text>
                    </HStack>
                    <HStack gap={2} color="gray.600" fontSize="sm">
                      <FaClock size={12} />
                      <Text>{test.duration} Minutes</Text>
                    </HStack>
                  </HStack>
                </Stack>

                <HStack justify="space-between" pt={2} borderTop="1px solid" borderColor="gray.100">
                  <Text fontWeight={700} color="#0C1222">Amount to Pay</Text>
                  <Text fontWeight={900} fontSize="xl" color={category.color}>₹{test.price}</Text>
                </HStack>

                <Button
                  size="lg"
                  bg={category.color}
                  color="white"
                  fontWeight={700}
                  borderRadius="xl"
                  _hover={{ opacity: 0.9 }}
                  onClick={handlePay}
                >
                  <FaLock />
                  Pay ₹{test.price} & Unlock
                </Button>

                <Text fontSize="xs" color="gray.400" textAlign="center">
                  Payment gateway integration pending — this is a placeholder checkout.
                </Text>
              </Stack>
            ) : (
              <Stack gap={5} align="center" textAlign="center">
                <Box color="#22C55E">
                  <FaCheckCircle size={48} />
                </Box>
                <Heading fontSize="xl" fontWeight={900} color="#0C1222">
                  Payment Successful
                </Heading>
                <Text color="gray.600" fontSize="sm">
                  You've unlocked <b>{test.title}</b> from {category.title}.
                </Text>
                <Button
                  size="lg"
                  bg={category.color}
                  color="white"
                  fontWeight={700}
                  borderRadius="xl"
                  _hover={{ opacity: 0.9 }}
                  onClick={() => navigate(`/test-series/${categorySlug}/${testSlug}`)}
                >
                  Go to Test
                </Button>
              </Stack>
            )}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

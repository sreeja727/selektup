import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Image,
  Text,
  VStack,
  Separator,
  Badge,
} from "@chakra-ui/react";

import { FaCheckCircle, FaLock } from "react-icons/fa";

export default function PaymentPage() {
  return (
    <Box bg="gray.50" minH="100vh" py={{ base: 6, md: 10 }}>
      <Container maxW="7xl">

        <Heading mb={{ base: 6, md: 8 }} fontSize={{ base: "xl", md: "2xl" }}>
          Complete Your Purchase
        </Heading>

        <Grid
          templateColumns={{ base: "1fr", lg: "2fr 1fr" }}
          gap={{ base: 6, md: 8 }}
        >

          {/* LEFT */}

          <Box
            bg="white"
            p={{ base: 5, md: 8 }}
            rounded="xl"
            shadow="md"
          >

            <Image
              src="selektup banner.jpg"
              rounded="lg"
              mb={6}
              w="100%"
            />

            <Heading size="md">
              UPSC Prelims Test Series
            </Heading>

            <Badge
              mt={3}
              colorScheme="green"
            >
              Best Seller
            </Badge>

            <Text mt={5} color="gray.600">
              Get access to a complete UPSC Mock Test Series
              designed by experienced faculty.
            </Text>

            <VStack
              align="start"
              gap={4}
              mt={8}
            >

              <Flex align="center">
                <FaCheckCircle color="green" />
                <Text ml={3}>
                  100 Full-Length Mock Tests
                </Text>
              </Flex>

              <Flex align="center">
                <FaCheckCircle color="green" />
                <Text ml={3}>
                  90 Minutes Per Test
                </Text>
              </Flex>

              <Flex align="center">
                <FaCheckCircle color="green" />
                <Text ml={3}>
                  Detailed Performance Analysis
                </Text>
              </Flex>

              <Flex align="center">
                <FaCheckCircle color="green" />
                <Text ml={3}>
                  12 Months Access
                </Text>
              </Flex>

            </VStack>

          </Box>

          {/* RIGHT */}

          <Box
            bg="white"
            p={{ base: 5, md: 8 }}
            rounded="xl"
            shadow="md"
            h="fit-content"
          >

            <Heading size="md" mb={6}>
              Order Summary
            </Heading>

            <Flex justify="space-between" mb={4} flexWrap="wrap" gap={1}>
              <Text>Price</Text>
              <Text>₹999</Text>
            </Flex>

            <Flex justify="space-between" mb={4} flexWrap="wrap" gap={1}>
              <Text>Discount</Text>
              <Text color="green.500">₹0</Text>
            </Flex>

            <Flex justify="space-between" mb={4} flexWrap="wrap" gap={1}>
              <Text>GST (18%)</Text>
              <Text>₹180</Text>
            </Flex>

            <Separator my={5} />

            <Flex
              justify="space-between"
              fontWeight="bold"
              fontSize="lg"
            >
              <Text>Total</Text>
              <Text>₹1179</Text>
            </Flex>

            <Button
              colorScheme="blue"
              size="lg"
              w="full"
              mt={8}
            >
              Proceed to Pay
            </Button>

            <Flex
              mt={6}
              align="center"
              justify="center"
            >
              <FaLock />

              <Text
                ml={2}
                fontSize="sm"
                color="gray.500"
              >
                Secure Payment
              </Text>
            </Flex>

          </Box>

        </Grid>

      </Container>
    </Box>
  );
}
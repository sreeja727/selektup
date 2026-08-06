import { Box, Button, Container, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import { FaArrowLeft, FaBan, FaCheck } from "react-icons/fa";

export default function AlreadyAttempted({ categoryTitle, testTitle, color = "#E91E8C", onBack, onReview }) {
  return (
    <Box bg="#F8F9FA" minH="100vh" py={{ base: 10, md: 14 }}>
      <Container maxW="4xl">
        <Stack gap={6}>
          <HStack
            as="button"
            onClick={onBack}
            gap={2}
            color="gray.500"
            fontSize="sm"
            fontWeight={600}
            _hover={{ color }}
            w="fit-content"
          >
            <FaArrowLeft size={12} />
            <Text>{categoryTitle}</Text>
          </HStack>

          <Box
            bg="white"
            borderRadius="2xl"
            border="1px solid"
            borderColor="gray.100"
            boxShadow="0 2px 14px rgba(0,0,0,0.06)"
            p={{ base: 6, md: 10 }}
          >
            <Stack align="center" gap={4} textAlign="center">
              <Box
                w={16}
                h={16}
                borderRadius="full"
                bg="gray.100"
                color="gray.500"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <FaBan size={26} />
              </Box>

              <Heading fontSize={{ base: "xl", md: "2xl" }} fontWeight={900} color="#0C1222">
                Already Attempted
              </Heading>

              <Text color="gray.600" maxW="480px">
                You have already attempted this mock test. Each mock test can only be attempted once.
              </Text>

              <Text fontWeight={700} color="#0C1222">{testTitle}</Text>

              <Stack direction={{ base: "column", sm: "row" }} gap={4} mt={4} w={{ base: "100%", sm: "auto" }}>
                <Button variant="outline" borderRadius="lg" onClick={onBack} w={{ base: "100%", sm: "auto" }}>
                  <FaArrowLeft size={12} />
                  Back
                </Button>
                {onReview && (
                  <Button
                    bg={color}
                    color="white"
                    fontWeight={700}
                    borderRadius="lg"
                    _hover={{ opacity: 0.9 }}
                    onClick={onReview}
                    w={{ base: "100%", sm: "auto" }}
                  >
                    <FaCheck size={14} />
                    Review Answers
                  </Button>
                )}
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaCheckCircle, FaTimesCircle, FaLightbulb } from "react-icons/fa";

export default function Review() {
  const questions = [
    {
      id: 1,
      question: "What is the capital of India?",
      options: ["Delhi", "Mumbai", "Chennai", "Kolkata"],
      selected: "Mumbai",
      correct: "Delhi",
      explanation:
        "Delhi is the capital city of India.",
    },
    {
      id: 2,
      question: "Who is known as the Father of the Nation?",
      options: [
        "Jawaharlal Nehru",
        "Mahatma Gandhi",
        "Subhash Chandra Bose",
        "Dr. B.R. Ambedkar",
      ],
      selected: "Mahatma Gandhi",
      correct: "Mahatma Gandhi",
      explanation:
        "Mahatma Gandhi is known as the Father of the Nation.",
    },
  ];

  const [current, setCurrent] = useState(0);

  const q = questions[current];
  const isCorrect = q.selected === q.correct;

  return (
    <Box bg="#F8F9FA" minH="100vh" py={{ base: 10, md: 14 }}>
      <Container maxW="4xl">
        <Box
          bg="white"
          borderRadius="2xl"
          border="1px solid"
          borderColor="gray.100"
          boxShadow="0 2px 14px rgba(0,0,0,0.06)"
          p={{ base: 6, md: 10 }}
        >
          <HStack justify="space-between" align="center" mb={6} wrap="wrap" gap={3}>
            <Heading size="md" color="#0C1222" fontWeight={800}>
              Review Answers
            </Heading>

            <HStack gap={1.5}>
              {questions.map((item, index) => (
                <Box
                  key={item.id}
                  as="button"
                  onClick={() => setCurrent(index)}
                  w="8px"
                  h="8px"
                  borderRadius="full"
                  bg={index === current ? "#039BE5" : "gray.200"}
                  transition="all 0.15s"
                />
              ))}
            </HStack>
          </HStack>

          <Text
            display="inline-block"
            bg="blue.50"
            color="#039BE5"
            fontSize="xs"
            fontWeight={700}
            px={3}
            py={1}
            borderRadius="full"
            mb={4}
          >
            Question {current + 1} of {questions.length}
          </Text>

          <Text fontWeight={700} fontSize="lg" color="#0C1222" mb={6} lineHeight="1.5">
            {q.question}
          </Text>

          <Stack align="stretch" gap={3}>
            {q.options.map((option) => {
              const isCorrectOption = option === q.correct;
              const isSelectedOption = option === q.selected;
              return (
                <HStack
                  key={option}
                  justify="space-between"
                  p={4}
                  border="2px solid"
                  borderColor={
                    isCorrectOption
                      ? "green.400"
                      : isSelectedOption
                      ? "red.400"
                      : "gray.200"
                  }
                  borderRadius="lg"
                  bg={
                    isCorrectOption
                      ? "green.50"
                      : isSelectedOption
                      ? "red.50"
                      : "white"
                  }
                >
                  <Text color="#0C1222" fontWeight={500}>{option}</Text>
                  {isCorrectOption && <FaCheckCircle color="#22C55E" size={16} />}
                  {!isCorrectOption && isSelectedOption && <FaTimesCircle color="#EF5350" size={16} />}
                </HStack>
              );
            })}
          </Stack>

          <Stack gap={3} mt={6}>
            <HStack fontSize="sm">
              <Text fontWeight={700} color="#0C1222">Your Answer:</Text>
              <Text fontWeight={600} color={isCorrect ? "green.500" : "red.500"}>
                {q.selected}
              </Text>
            </HStack>

            <HStack fontSize="sm">
              <Text fontWeight={700} color="#0C1222">Correct Answer:</Text>
              <Text fontWeight={600} color="green.500">{q.correct}</Text>
            </HStack>

            <HStack
              align="flex-start"
              gap={3}
              bg="blue.50"
              p={4}
              borderRadius="lg"
            >
              <Box color="#039BE5" mt={0.5}>
                <FaLightbulb size={16} />
              </Box>
              <Box>
                <Text fontWeight={700} color="#0C1222" fontSize="sm" mb={1}>Explanation</Text>
                <Text fontSize="sm" color="gray.600">{q.explanation}</Text>
              </Box>
            </HStack>
          </Stack>

          <HStack mt={8} justify="space-between">
            <Button
              variant="outline"
              borderRadius="lg"
              disabled={current === 0}
              onClick={() => setCurrent(current - 1)}
            >
              <FaArrowLeft size={12} />
              Previous
            </Button>

            <Button
              bg="#039BE5"
              color="white"
              fontWeight={700}
              borderRadius="lg"
              _hover={{ bg: "#0277BD" }}
              disabled={current === questions.length - 1}
              onClick={() => setCurrent(current + 1)}
            >
              Next
              <FaArrowRight size={12} />
            </Button>
          </HStack>
        </Box>
      </Container>
    </Box>
  );
}

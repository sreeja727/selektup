import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  Badge,
  HStack,
} from "@chakra-ui/react";
import { useState } from "react";

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

  return (
    <Box bg="gray.100" minH="100vh" p={8}>
      <Box
        maxW="900px"
        mx="auto"
        bg="white"
        p={8}
        borderRadius="lg"
        boxShadow="md"
      >
        <Heading size="md" mb={5}>
          Review Answers
        </Heading>

        <Badge colorScheme="blue" mb={4}>
          Question {current + 1} of {questions.length}
        </Badge>

        <Text fontWeight="bold" fontSize="lg" mb={5}>
          {q.question}
        </Text>

        <VStack align="stretch" spacing={3}>
          {q.options.map((option) => (
            <Box
              key={option}
              p={3}
              border="1px solid"
              borderColor={
                option === q.correct
                  ? "green.400"
                  : option === q.selected
                  ? "red.400"
                  : "gray.200"
              }
              borderRadius="md"
              bg={
                option === q.correct
                  ? "green.50"
                  : option === q.selected
                  ? "red.50"
                  : "white"
              }
            >
              {option}
            </Box>
          ))}
        </VStack>

        <Box mt={6}>
          <Text>
            <strong>Your Answer:</strong>{" "}
            <Text
              as="span"
              color={q.selected === q.correct ? "green.500" : "red.500"}
            >
              {q.selected}
            </Text>
          </Text>

          <Text mt={2}>
            <strong>Correct Answer:</strong>{" "}
            <Text as="span" color="green.500">
              {q.correct}
            </Text>
          </Text>

          <Box
            mt={5}
            bg="blue.50"
            p={4}
            borderRadius="md"
          >
            <Text fontWeight="bold">Explanation</Text>

            <Text mt={2}>{q.explanation}</Text>
          </Box>
        </Box>

        <HStack mt={8} justify="space-between">
          <Button
            isDisabled={current === 0}
            onClick={() => setCurrent(current - 1)}
          >
            Previous
          </Button>

          <Button
            colorScheme="blue"
            isDisabled={current === questions.length - 1}
            onClick={() => setCurrent(current + 1)}
          >
            Next
          </Button>
        </HStack>
      </Box>
    </Box>
  );
}
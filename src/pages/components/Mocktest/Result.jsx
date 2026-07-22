import {
  Box,
  Button,
  Grid,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function Result() {
  const navigate = useNavigate();

  const result = {
    totalQuestions: 100,
    attempted: 90,
    correct: 72,
    wrong: 18,
    skipped: 10,
    negativeMarks: 12,
    finalScore: 60,
    cutoff: 35,
  };

  const pass = result.finalScore >= result.cutoff;

  return (
    <Box bg="gray.100" minH="100vh" p={8}>
      <Box
        maxW="900px"
        mx="auto"
        bg="white"
        p={8}
        borderRadius="lg"
        boxShadow="lg"
      >
        <VStack spacing={6}>
          <Heading color={pass ? "green.500" : "red.500"}>
            {pass ? "Congratulations!" : "Better Luck Next Time"}
          </Heading>

          <Text fontSize="lg">
            Your Mock Test has been completed successfully.
          </Text>

          <Grid
            templateColumns="repeat(2,1fr)"
            gap={5}
            w="100%"
          >
            <Box p={5} bg="gray.50" borderRadius="md">
              <Text>Total Questions</Text>
              <Heading size="md">{result.totalQuestions}</Heading>
            </Box>

            <Box p={5} bg="gray.50" borderRadius="md">
              <Text>Attempted</Text>
              <Heading size="md">{result.attempted}</Heading>
            </Box>

            <Box p={5} bg="green.50" borderRadius="md">
              <Text>Correct Answers</Text>
              <Heading size="md">{result.correct}</Heading>
            </Box>

            <Box p={5} bg="red.50" borderRadius="md">
              <Text>Wrong Answers</Text>
              <Heading size="md">{result.wrong}</Heading>
            </Box>

            <Box p={5} bg="yellow.50" borderRadius="md">
              <Text>Skipped</Text>
              <Heading size="md">{result.skipped}</Heading>
            </Box>

            <Box p={5} bg="orange.50" borderRadius="md">
              <Text>Negative Marks</Text>
              <Heading size="md">
                -{result.negativeMarks}
              </Heading>
            </Box>

            <Box
              p={5}
              bg="blue.50"
              borderRadius="md"
              gridColumn="span 2"
            >
              <Text>Final Score</Text>

              <Heading color="blue.600">
                {result.finalScore} / 100
              </Heading>
            </Box>
          </Grid>

          <Button
            colorScheme="blue"
            size="lg"
            onClick={() => navigate("/review")}
          >
            Review Answers
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}
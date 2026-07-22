import {
  Box,
  Button,
  Flex,
  Heading,
  List,
  ListItem,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function Instructions() {
  const navigate = useNavigate();

  const instructions = [
    "Read every question carefully before answering.",
    "The test contains 100 multiple-choice questions.",
    "Duration of the test is 120 minutes.",
    "Each question has only one correct answer.",
    "Every 3 wrong answers will reduce 2 marks.",
    "Do not refresh or close the browser during the exam.",
    "The test will be submitted automatically when the timer ends.",
    "You can navigate between questions anytime.",
    "Click 'Submit Test' once you have completed the exam.",
  ];

  return (
    <Box bg="gray.100" minH="100vh" py={10}>
      <Box
        maxW="900px"
        mx="auto"
        bg="white"
        borderRadius="lg"
        boxShadow="lg"
        p={8}
      >
        <Heading color="blue.600" mb={2}>
          UPSC Mock Test
        </Heading>

        <Text color="gray.600" mb={8}>
          Please read the instructions carefully before starting the exam.
        </Text>

        <Flex
          wrap="wrap"
          justify="space-between"
          bg="gray.50"
          p={5}
          borderRadius="md"
          mb={8}
        >
          <Box mb={3}>
            <Text fontWeight="bold">Total Questions</Text>
            <Text>100</Text>
          </Box>

          <Box mb={3}>
            <Text fontWeight="bold">Duration</Text>
            <Text>120 Minutes</Text>
          </Box>

          <Box mb={3}>
            <Text fontWeight="bold">Total Marks</Text>
            <Text>100</Text>
          </Box>

          <Box mb={3}>
            <Text fontWeight="bold">Cut Off</Text>
            <Text>35 Marks</Text>
          </Box>
        </Flex>

        <Box
          bg="red.50"
          borderLeft="5px solid"
          borderColor="red.500"
          p={4}
          mb={8}
        >
          <Heading size="sm" color="red.600">
            Negative Marking
          </Heading>

          <Text mt={2}>
            Every <b>3 wrong answers</b> will reduce <b>2 marks</b>.
          </Text>
        </Box>

        <Heading size="md" mb={4}>
          Instructions
        </Heading>

        <VStack align="stretch" spacing={3}>
          <List spacing={3}>
            {instructions.map((item, index) => (
              <ListItem key={index}>
                {index + 1}. {item}
              </ListItem>
            ))}
          </List>
        </VStack>

        <Flex justify="space-between" mt={10}>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>

          <Button
            colorScheme="blue"
            onClick={() => navigate("/mock-test")}
          >
            Start Test
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}
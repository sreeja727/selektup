import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import Timer from "./Timer";
import QuestionPalette from "./QuestionPalette";
import { useDisclosure } from "@chakra-ui/react";
import SubmitModal from "./SubmitModal";

export default function TestScreen() {
  const [selected, setSelected] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const question = {
    id: 1,
    question:
      "Which of the following statements about the Indian Constitution is correct?",
    options: [
      "It was adopted on 26 January 1950.",
      "It was drafted by the British Parliament.",
      "It is the shortest constitution in the world.",
      "It came into force in 1947.",
    ],
  };

  return (
    <Box bg="gray.100" minH="100vh" p={6}>
      {/* Header */}
      <Flex
        bg="white"
        p={5}
        borderRadius="lg"
        justify="space-between"
        align="center"
        boxShadow="md"
        mb={5}
      >
        <Heading size="md">UPSC Mock Test 1</Heading>

        <Timer
  duration={7200}
  onTimeUp={() => alert("Time Up! Test Submitted")}
/>
      </Flex>

      <Grid templateColumns="3fr 1fr" gap={6}>
        {/* Question Section */}
        <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
          <Text color="blue.600" fontWeight="bold" mb={2}>
            Question 1 / 100
          </Text>

          <Heading size="md" mb={6}>
            {question.question}
          </Heading>

          <RadioGroup.Root
            value={selected}
            onValueChange={(e) => setSelected(e.value)}
          >
            <Stack gap={5}>
              {question.options.map((item, index) => (
                <RadioGroup.Item
                  key={index}
                  value={item}
                  border="1px"
                  borderColor="gray.300"
                  p={4}
                  borderRadius="md"
                >
                  <RadioGroup.ItemHiddenInput />
                  <RadioGroup.ItemIndicator />
                  <RadioGroup.ItemText>{item}</RadioGroup.ItemText>
                </RadioGroup.Item>
              ))}
            </Stack>
          </RadioGroup.Root>

          <Flex mt={10} justify="space-between">
            <Button colorPalette="gray">Previous</Button>

            <Flex gap={3}>
              <Button colorPalette="yellow">
                Mark for Review
              </Button>

              <Button colorPalette="blue">
                Save & Next
              </Button>
<Button colorScheme="red" onClick={onOpen}>
    Submit
</Button>
<SubmitModal
    isOpen={isOpen}
    onClose={onClose}
    answered={72}
    notAnswered={20}
    review={8}
    onSubmit={() => {
        alert("Test Submitted Successfully");
        onClose();
    }}
/>
            </Flex>
          </Flex>
        </Box>

        {/* Question Palette */}
        <Box bg="white" p={5} borderRadius="lg" boxShadow="md">
          <Heading size="sm" mb={5}>
            Question Palette
          </Heading>
<QuestionPalette
  totalQuestions={100}
  currentQuestion={currentQuestion}
  onSelect={setCurrentQuestion}
/>
        </Box>
      </Grid>
    </Box>
    
  );
}
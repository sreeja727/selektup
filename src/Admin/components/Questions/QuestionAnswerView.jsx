import { Box, Flex, Image, Text, VStack } from "@chakra-ui/react";
import { CheckCircle2 } from "lucide-react";
import { QUESTION_KIND, getTypeConfig } from "../../../pages/questionTypes";

// Read-only, type-aware rendering of a question's answer — used by
// QuestionsView.jsx. Mirrors the fields QuestionTypeFields.jsx edits.
export default function QuestionAnswerView({ question }) {
  const config = getTypeConfig(question.type);

  if (config.kind === QUESTION_KIND.TEXT_ANSWER) {
    return (
      <VStack align="stretch" gap={2} mt={5}>
        <Text fontSize="xs" color="gray.400">Correct Answer</Text>
        <Box px={3} py={1.5} rounded="full" bg="green.50" border="1px solid" borderColor="green.200" w="fit-content">
          <Text color="green.700" fontWeight={600} fontSize="sm">{question.answerText}</Text>
        </Box>
      </VStack>
    );
  }

  return (
    <>
      {config.hasImage && question.imageUrl && (
        <Box mt={5}>
          <Text fontSize="xs" color="gray.400" mb={2}>Question Image</Text>
          <Image
            src={question.imageUrl}
            alt="Question"
            maxH="260px"
            objectFit="contain"
            borderRadius="lg"
            border="1px solid"
            borderColor="gray.100"
          />
        </Box>
      )}

      {config.hasAssertionReason && (
        <Box mt={5}>
          <Text fontSize="xs" color="gray.400" mb={1}>Reason</Text>
          <Text color="#0C1222">{question.reason}</Text>
        </Box>
      )}

      <VStack align="stretch" gap={2} mt={5}>
        <Text fontSize="xs" color="gray.400">Options</Text>
        {(question.options || []).map((opt, index) => {
          const isCorrectOpt = (question.correctOptionIndexes || []).includes(index);
          return (
            <Flex
              key={index}
              align="center"
              gap={2}
              p={3}
              rounded="lg"
              bg={isCorrectOpt ? "green.50" : "gray.50"}
              border="1px solid"
              borderColor={isCorrectOpt ? "green.200" : "gray.100"}
            >
              {isCorrectOpt && <CheckCircle2 size={16} color="#38A169" />}
              <Text color="#0C1222" fontWeight={isCorrectOpt ? 600 : 400}>{opt}</Text>
            </Flex>
          );
        })}
      </VStack>
    </>
  );
}

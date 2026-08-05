import {
  Box, Flex, Image, Table, Text, VStack,
} from "@chakra-ui/react";
import { CheckCircle2 } from "lucide-react";
import { QUESTION_KIND, getTypeConfig } from "../../../pages/questionTypes";

export default function QuestionAnswerView({ question }) {
  const config = getTypeConfig(question.type);

  if (config.kind === QUESTION_KIND.NUMERIC_ANSWER) {
    return (
      <VStack align="stretch" gap={2} mt={5}>
        <Text fontSize="xs" color="gray.400">Correct Numeric Answer</Text>
        <Box px={3} py={1.5} rounded="full" bg="green.50" border="1px solid" borderColor="green.200" w="fit-content">
          <Text color="green.700" fontWeight={600} fontSize="sm">
            {question.correctNumericAnswer}
            {question.numericTolerance ? ` (± ${question.numericTolerance})` : ""}
          </Text>
        </Box>
      </VStack>
    );
  }

  if (config.kind === QUESTION_KIND.TEXT_ANSWER) {
    if (config.manualGrading) {
      return (
        <Box mt={5} bg="gray.50" border="1px solid" borderColor="gray.100" rounded="lg" p={3}>
          <Text fontSize="sm" color="gray.600">No automatic answer key — graded manually.</Text>
        </Box>
      );
    }
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
      {config.hasPassage && (question.passageTitle || question.passageText) && (
        <Box mt={5} bg="gray.50" border="1px solid" borderColor="gray.100" rounded="lg" p={4}>
          {question.passageTitle && <Text fontWeight={700} color="#0C1222" mb={2}>{question.passageTitle}</Text>}
          {question.passageText && <Text color="gray.700" whiteSpace="pre-wrap" fontSize="sm">{question.passageText}</Text>}
        </Box>
      )}

      {config.hasTable && question.tableHeaders?.length > 0 && (
        <Box mt={5} overflowX="auto" border="1px solid" borderColor="gray.100" borderRadius="lg">
          <Table.Root size="sm">
            <Table.Header>
              <Table.Row bg="gray.50">
                {question.tableHeaders.map((header, i) => (
                  <Table.ColumnHeader key={i}>{header}</Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {(question.tableRows || []).map((row, rowIndex) => (
                <Table.Row key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <Table.Cell key={cellIndex}>{cell}</Table.Cell>
                  ))}
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      )}

      {config.hasStatements && question.statements?.length > 0 && (
        <VStack align="stretch" gap={1} mt={5}>
          <Text fontSize="xs" color="gray.400" mb={1}>Statements</Text>
          {question.statements.map((statement, index) => (
            <Text key={index} color="#0C1222">{index + 1}. {statement}</Text>
          ))}
        </VStack>
      )}

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
              p={{ base: 2, md: 3 }}
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

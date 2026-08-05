import {
  Box, Image, RadioGroup, Stack, Table, Text,
} from "@chakra-ui/react";
import { getTypeConfig } from "../../../questionTypes";

// Single reusable renderer for every single-select, options-based question
// type: Single MCQ, Statement-based, Assertion & Reason, Paragraph-based,
// Table-based, Image-based, and True/False. They all share the exact same
// shape (a stem + N options + one correct answer) — the only differences
// are purely presentational (a shared passage, a numbered statement list, a
// data table, an image, or an Assertion/Reason preamble), driven by
// `hasPassage`/`hasStatements`/`hasTable`/`hasImage`/`hasAssertionReason` on
// the type's config. A new single-select type never needs a new component,
// just a config entry.
export default function CommonMCQQuestion({ question, value, onChange }) {
  const config = getTypeConfig(question.type);

  return (
    <Box>
      {config.hasPassage && (question.passageTitle || question.passageText) && (
        <Box mb={6} bg="gray.50" borderRadius="lg" p={4}>
          {question.passageTitle && <Text fontWeight={700} color="#0C1222" mb={2}>{question.passageTitle}</Text>}
          {question.passageText && <Text color="#0C1222" whiteSpace="pre-wrap">{question.passageText}</Text>}
        </Box>
      )}

      {config.hasTable && question.tableHeaders?.length > 0 && (
        <Box mb={6} overflowX="auto" border="1px solid" borderColor="gray.100" borderRadius="lg">
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
        <Stack gap={1} mb={6}>
          {question.statements.map((statement, index) => (
            <Text key={index} color="#0C1222">{index + 1}. {statement}</Text>
          ))}
        </Stack>
      )}

      {config.hasImage && question.imageUrl && (
        <Image
          src={question.imageUrl}
          alt="Question"
          mb={6}
          maxH={{ base: "200px", md: "320px" }}
          objectFit="contain"
          borderRadius="lg"
          border="1px solid"
          borderColor="gray.100"
        />
      )}

      {config.hasAssertionReason && (
        <Stack gap={1} mb={6} bg="gray.50" borderRadius="lg" p={4}>
          <Text color="#0C1222"><Text as="span" fontWeight={700}>Reason (R): </Text>{question.reason}</Text>
        </Stack>
      )}

      <RadioGroup.Root value={value || ""} onValueChange={(e) => onChange(e.value)}>
        <Stack gap={3}>
          {(question.options || []).map((item, index) => {
            const active = value === item;
            return (
              <RadioGroup.Item
                key={index}
                value={item}
                border="2px solid"
                borderColor={active ? "#039BE5" : "gray.200"}
                bg={active ? "rgba(3,155,229,0.06)" : "white"}
                p={{ base: 3, md: 4 }}
                borderRadius="lg"
                cursor="pointer"
                transition="all 0.15s"
                _hover={{ borderColor: "#039BE5" }}
              >
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemIndicator />
                <RadioGroup.ItemText color="#0C1222" fontWeight={500}>{item}</RadioGroup.ItemText>
              </RadioGroup.Item>
            );
          })}
        </Stack>
      </RadioGroup.Root>
    </Box>
  );
}

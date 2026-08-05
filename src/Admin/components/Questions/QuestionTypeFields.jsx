import {
  Box, Button, Field, HStack, IconButton, Image, Input, Stack, Table, Text, Textarea, VStack,
} from "@chakra-ui/react";
import { Plus, X } from "lucide-react";
import {
  QUESTION_KIND, getTypeConfig, toggleCorrectOption, addStatement, removeStatement,
  addTableRow, removeTableRow, addTableColumn, removeTableColumn,
} from "../../../pages/questionTypes";
import { fieldStyle } from "./fieldStyle";

// The dynamic body of the Add/Edit question form — everything below the
// Question/Explanation textareas that changes shape per question type.
// Reused by both QuestionsAdd.jsx and QuestionsEdit.jsx so a new question
// type only needs an entry in questionTypes.js plus (if it needs a new
// `kind`) a new branch here, not a change to either screen. Every
// options-based type has exactly 4 fixed slots (optionA-D on the backend) —
// no adding/removing options.
export default function QuestionTypeFields({
  type, fields, setFields, errors, clearError,
}) {
  const config = getTypeConfig(type);
  const isMulti = config.kind === QUESTION_KIND.MULTI_SELECT;
  const canEditOptions = !config.fixedOptions;

  const updateField = (key, value) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    clearError(key);
  };

  if (config.kind === QUESTION_KIND.NUMERIC_ANSWER) {
    return (
      <Stack direction={{ base: "column", md: "row" }} gap={5} align={{ base: "stretch", md: "start" }}>
        <Field.Root flex={1}>
          <Field.Label>Correct Numeric Answer</Field.Label>
          <Input
            type="number"
            placeholder="e.g. 42"
            value={fields.correctNumericAnswer}
            onChange={(e) => updateField("correctNumericAnswer", e.target.value)}
            {...fieldStyle}
            borderColor={errors.correctNumericAnswer ? "red.400" : fieldStyle.borderColor}
          />
          {errors.correctNumericAnswer && <Text color="red.500" fontSize="xs" mt={1}>{errors.correctNumericAnswer}</Text>}
        </Field.Root>
        <Field.Root flex={1}>
          <Field.Label>Tolerance (±)</Field.Label>
          <Input
            type="number"
            placeholder="0"
            value={fields.numericTolerance}
            onChange={(e) => updateField("numericTolerance", e.target.value)}
            {...fieldStyle}
            borderColor={errors.numericTolerance ? "red.400" : fieldStyle.borderColor}
          />
          {errors.numericTolerance && <Text color="red.500" fontSize="xs" mt={1}>{errors.numericTolerance}</Text>}
          <Text fontSize="xs" color="gray.500" mt={1}>Optional — accepts any answer within this range.</Text>
        </Field.Root>
      </Stack>
    );
  }

  if (config.kind === QUESTION_KIND.TEXT_ANSWER) {
    if (config.manualGrading) {
      return (
        <Box bg="gray.50" border="1px solid" borderColor="gray.100" rounded="lg" p={3}>
          <Text fontSize="sm" color="gray.600">
            This question type has no automatic answer key — student responses are graded manually after submission.
          </Text>
        </Box>
      );
    }
    return (
      <Field.Root>
        <Field.Label>Correct Answer</Field.Label>
        <Text fontSize="xs" color="gray.500" mb={2}>
          Matching is case-insensitive and ignores extra spaces.
        </Text>
        <Input
          placeholder="The exact expected answer"
          value={fields.answerText}
          onChange={(e) => updateField("answerText", e.target.value)}
          {...fieldStyle}
          borderColor={errors.answerText ? "red.400" : fieldStyle.borderColor}
        />
        {errors.answerText && <Text color="red.500" fontSize="xs" mt={1}>{errors.answerText}</Text>}
      </Field.Root>
    );
  }

  return (
    <VStack align="stretch" gap={5}>
      {config.hasPassage && (
        <>
          <Field.Root>
            <Field.Label>Passage Title</Field.Label>
            <Input
              placeholder="e.g. Passage 1"
              value={fields.passageTitle || ""}
              onChange={(e) => updateField("passageTitle", e.target.value)}
              {...fieldStyle}
              borderColor={errors.passageTitle ? "red.400" : fieldStyle.borderColor}
            />
            {errors.passageTitle && <Text color="red.500" fontSize="xs" mt={1}>{errors.passageTitle}</Text>}
          </Field.Root>
          <Field.Root>
            <Field.Label>Passage Text</Field.Label>
            <Textarea
              placeholder="Paste the full reading passage here"
              rows={8}
              value={fields.passageText || ""}
              onChange={(e) => updateField("passageText", e.target.value)}
              {...fieldStyle}
              borderColor={errors.passageText ? "red.400" : fieldStyle.borderColor}
            />
            {errors.passageText && <Text color="red.500" fontSize="xs" mt={1}>{errors.passageText}</Text>}
          </Field.Root>
        </>
      )}

      {config.hasTable && (
        <Field.Root>
          <Field.Label>Table</Field.Label>
          <Text fontSize="xs" color="gray.500" mb={2}>
            Shown to students above the options.
          </Text>
          <Box overflowX="auto" border="1px solid" borderColor="gray.200" borderRadius="lg">
            <Table.Root size="sm">
              <Table.Header>
                <Table.Row bg="gray.50">
                  {fields.tableHeaders.map((header, colIndex) => (
                    <Table.ColumnHeader key={colIndex} minW="140px">
                      <HStack gap={1}>
                        <Input
                          placeholder={`Column ${colIndex + 1}`}
                          value={header}
                          onChange={(e) => {
                            const next = fields.tableHeaders.map((h, i) => (i === colIndex ? e.target.value : h));
                            updateField("tableHeaders", next);
                          }}
                          size="sm"
                          {...fieldStyle}
                          borderColor={errors.tableHeaders && !header.trim() ? "red.400" : fieldStyle.borderColor}
                        />
                        <IconButton
                          aria-label="Remove column"
                          size="xs"
                          variant="ghost"
                          colorPalette="red"
                          disabled={fields.tableHeaders.length === 1}
                          onClick={() => setFields((prev) => removeTableColumn(prev, colIndex))}
                        >
                          <X size={12} />
                        </IconButton>
                      </HStack>
                    </Table.ColumnHeader>
                  ))}
                  <Table.ColumnHeader w="1px" />
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {fields.tableRows.map((row, rowIndex) => (
                  <Table.Row key={rowIndex}>
                    {row.map((cell, colIndex) => (
                      <Table.Cell key={colIndex}>
                        <Input
                          placeholder="Value"
                          value={cell}
                          onChange={(e) => {
                            const nextRows = fields.tableRows.map((r, ri) => (
                              ri === rowIndex ? r.map((c, ci) => (ci === colIndex ? e.target.value : c)) : r
                            ));
                            updateField("tableRows", nextRows);
                          }}
                          size="sm"
                          {...fieldStyle}
                        />
                      </Table.Cell>
                    ))}
                    <Table.Cell>
                      <IconButton
                        aria-label="Remove row"
                        size="xs"
                        variant="ghost"
                        colorPalette="red"
                        disabled={fields.tableRows.length === 1}
                        onClick={() => setFields((prev) => removeTableRow(prev, rowIndex))}
                      >
                        <X size={12} />
                      </IconButton>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
          <HStack mt={2} gap={2} wrap="wrap">
            <Button size="sm" variant="outline" onClick={() => setFields((prev) => addTableRow(prev))}>
              <Plus size={13} style={{ marginRight: 6 }} />
              Add Row
            </Button>
            <Button size="sm" variant="outline" onClick={() => setFields((prev) => addTableColumn(prev))}>
              <Plus size={13} style={{ marginRight: 6 }} />
              Add Column
            </Button>
          </HStack>
          {errors.tableHeaders && <Text color="red.500" fontSize="xs" mt={2}>{errors.tableHeaders}</Text>}
          {errors.tableRows && <Text color="red.500" fontSize="xs" mt={2}>{errors.tableRows}</Text>}
        </Field.Root>
      )}

      {config.hasStatements && (
        <Field.Root>
          <Field.Label>Statements</Field.Label>
          <Text fontSize="xs" color="gray.500" mb={2}>
            Each entry is shown to students as a numbered statement (1, 2, 3, ...).
          </Text>
          <VStack align="stretch" gap={2}>
            {fields.statements.map((statement, index) => (
              <HStack key={index} gap={2}>
                <Text fontWeight={700} color="gray.400" minW="20px">{index + 1}.</Text>
                <Input
                  placeholder={`Statement ${index + 1}`}
                  value={statement}
                  onChange={(e) => {
                    const next = fields.statements.map((s, i) => (i === index ? e.target.value : s));
                    updateField("statements", next);
                  }}
                  {...fieldStyle}
                  borderColor={errors.statements && !statement.trim() ? "red.400" : fieldStyle.borderColor}
                />
                <IconButton
                  aria-label="Remove statement"
                  size="sm"
                  variant="ghost"
                  colorPalette="red"
                  disabled={fields.statements.length === 1}
                  onClick={() => setFields((prev) => removeStatement(prev, index))}
                >
                  <X size={14} />
                </IconButton>
              </HStack>
            ))}
          </VStack>
          <Button size="sm" variant="outline" mt={2} onClick={() => setFields((prev) => addStatement(prev))}>
            <Plus size={13} style={{ marginRight: 6 }} />
            Add another statement
          </Button>
          {errors.statements && <Text color="red.500" fontSize="xs" mt={2}>{errors.statements}</Text>}
        </Field.Root>
      )}

      {config.hasImage && (
        <Field.Root>
          <Field.Label>Question Image URL</Field.Label>
          <Input
            placeholder="https://..."
            value={fields.imageUrl || ""}
            onChange={(e) => updateField("imageUrl", e.target.value)}
            {...fieldStyle}
            borderColor={errors.imageUrl ? "red.400" : fieldStyle.borderColor}
          />
          {errors.imageUrl && <Text color="red.500" fontSize="xs" mt={1}>{errors.imageUrl}</Text>}
          {fields.imageUrl?.trim() && (
            <Image
              src={fields.imageUrl}
              alt="Question preview"
              mt={3}
              maxH="220px"
              objectFit="contain"
              borderRadius="lg"
              border="1px solid"
              borderColor="gray.100"
            />
          )}
        </Field.Root>
      )}

      {config.hasAssertionReason && (
        <Field.Root>
          <Field.Label>Reason</Field.Label>
          <Textarea
            placeholder="State the reason"
            rows={3}
            value={fields.reason || ""}
            onChange={(e) => updateField("reason", e.target.value)}
            {...fieldStyle}
            borderColor={errors.reason ? "red.400" : fieldStyle.borderColor}
          />
          {errors.reason && <Text color="red.500" fontSize="xs" mt={1}>{errors.reason}</Text>}
        </Field.Root>
      )}

      <Box>
        <Text fontWeight={600} color="#0C1222" mb={3}>
          {isMulti ? "Options — mark every correct answer" : "Options — mark the correct answer"}
        </Text>
        <VStack align="stretch" gap={3}>
          {fields.options.map((opt, index) => {
            const isCorrectOpt = (fields.correctOptionIndexes || []).includes(index);
            return (
              <Stack key={index} direction={{ base: "column", sm: "row" }} gap={3} align="stretch">
                <Input
                  placeholder={`Option ${index + 1}`}
                  value={opt}
                  readOnly={!canEditOptions}
                  onChange={(e) => {
                    const next = fields.options.map((o, i) => (i === index ? e.target.value : o));
                    updateField("options", next);
                  }}
                  {...fieldStyle}
                  bg={canEditOptions ? "white" : "gray.50"}
                  borderColor={errors.options && !opt.trim() ? "red.400" : fieldStyle.borderColor}
                />
                <Button
                  size="sm"
                  variant={isCorrectOpt ? "solid" : "outline"}
                  colorPalette="green"
                  flexShrink={0}
                  onClick={() => {
                    clearError("correct");
                    setFields((prev) => toggleCorrectOption(prev, index, config.kind));
                  }}
                >
                  {isCorrectOpt ? "Correct" : "Mark Correct"}
                </Button>
              </Stack>
            );
          })}
        </VStack>
        {errors.options && <Text color="red.500" fontSize="xs" mt={2}>{errors.options}</Text>}
        {errors.correct && <Text color="red.500" fontSize="xs" mt={2}>{errors.correct}</Text>}
      </Box>
    </VStack>
  );
}

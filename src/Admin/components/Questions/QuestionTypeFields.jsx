import {
  Box, Button, Field, HStack, Image, Input, Text, Textarea, VStack,
} from "@chakra-ui/react";
import {
  QUESTION_KIND, getTypeConfig, toggleCorrectOption,
} from "../../../pages/questionTypes";
import { fieldStyle } from "./fieldStyle";

// The dynamic body of the Add/Edit question form — everything below the
// Question/Explanation textareas that changes shape per question type.
// Reused by both QuestionsAdd.jsx and QuestionsEdit.jsx so a new question
// type only needs an entry in questionTypes.js plus (if it needs a 4th
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

  if (config.kind === QUESTION_KIND.TEXT_ANSWER) {
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
              <HStack key={index} gap={3}>
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
              </HStack>
            );
          })}
        </VStack>
        {errors.options && <Text color="red.500" fontSize="xs" mt={2}>{errors.options}</Text>}
        {errors.correct && <Text color="red.500" fontSize="xs" mt={2}>{errors.correct}</Text>}
      </Box>
    </VStack>
  );
}

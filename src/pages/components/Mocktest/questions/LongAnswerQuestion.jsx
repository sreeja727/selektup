import { Text, Textarea, VStack } from "@chakra-ui/react";
import { answerFieldStyle } from "./answerFieldStyle";

// Dedicated renderer for Long Answer — a multi-line textarea instead of a
// single-line input, since the expected response is a paragraph rather than
// a word or phrase. Auto-grading a long answer via exact-text match (the
// same isCorrect path every TEXT_ANSWER kind uses) is a known stopgap —
// this type is `comingSoon` in questionTypes.js until the backend has real
// support (likely manual grading rather than auto-scoring).
export default function LongAnswerQuestion({ value, onChange }) {
  return (
    <VStack align="stretch" gap={1} maxW="640px">
      <Textarea
        placeholder="Write your answer"
        rows={8}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        {...answerFieldStyle}
      />
      <Text fontSize="xs" color="gray.500">Long-answer questions may be reviewed manually rather than auto-scored.</Text>
    </VStack>
  );
}

import { Input, Text, VStack } from "@chakra-ui/react";
import { answerFieldStyle } from "./answerFieldStyle";

// Dedicated renderer for One Word Answer — visually identical to Fill in
// the Blank today, but kept as its own component (per questionTypes.js's
// per-type registry) so a one-word-specific rule (e.g. rejecting spaces)
// can be added here later without touching Fill in the Blank.
export default function OneWordQuestion({ value, onChange }) {
  return (
    <VStack align="start" gap={1}>
      <Input
        placeholder="Type your one-word answer"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        size="lg"
        maxW="360px"
        {...answerFieldStyle}
      />
      <Text fontSize="xs" color="gray.500">Enter a single word.</Text>
    </VStack>
  );
}

import { Input, Text, VStack } from "@chakra-ui/react";
import { answerFieldStyle } from "./answerFieldStyle";

// Dedicated renderer for Numerical questions — a number input (decimal-
// friendly) instead of free text, since the answer is compared numerically
// (see questionTypes.js's isCorrect, which does a Number() comparison for
// types with `isNumeric: true`).
export default function NumericalQuestion({ value, onChange }) {
  return (
    <VStack align="start" gap={1}>
      <Input
        type="number"
        inputMode="decimal"
        placeholder="Enter a numeric value"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        size="lg"
        maxW="280px"
        {...answerFieldStyle}
      />
      <Text fontSize="xs" color="gray.500">Numbers only — decimals are allowed.</Text>
    </VStack>
  );
}

import { Input, Text, VStack } from "@chakra-ui/react";
import { answerFieldStyle } from "./answerFieldStyle";

// Dedicated renderer for Numerical questions — a number input (decimal-
// friendly) instead of free text. The backend stores the expected answer as
// `correctNumericAnswer` with an optional `numericTolerance`, compared via
// questionTypes.js's isCorrect (a Math.abs(actual - expected) <= tolerance
// check, not exact-string matching).
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

import { Input } from "@chakra-ui/react";
import { answerFieldStyle } from "./answerFieldStyle";

// Dedicated renderer for Fill in the Blank — a free-text field for the
// word/phrase that completes the blank in the question stem.
export default function FillInTheBlankQuestion({ value, onChange }) {
  return (
    <Input
      placeholder="Type the missing word or phrase"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      size="lg"
      maxW="480px"
      {...answerFieldStyle}
    />
  );
}

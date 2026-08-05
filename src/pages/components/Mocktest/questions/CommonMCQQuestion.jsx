import {
  Box, Image, RadioGroup, Stack, Text,
} from "@chakra-ui/react";
import { getTypeConfig } from "../../../questionTypes";

// Single reusable renderer for every single-select, options-based question
// type: Single MCQ, Statement-based, Assertion & Reason, Paragraph-based,
// Image-based, and True/False. They all share the exact same shape (a
// stem + N options + one correct answer) — the only differences are purely
// presentational (an image up top, or an Assertion/Reason preamble), driven
// by `hasImage`/`hasAssertionReason` on the type's config. A new
// single-select type never needs a new component, just a config entry.
export default function CommonMCQQuestion({ question, value, onChange }) {
  const config = getTypeConfig(question.type);

  return (
    <Box>
      {config.hasImage && question.imageUrl && (
        <Image
          src={question.imageUrl}
          alt="Question"
          mb={6}
          maxH="320px"
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
                p={4}
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

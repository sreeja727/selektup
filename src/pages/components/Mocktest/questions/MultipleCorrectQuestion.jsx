import { Box, Checkbox, Stack, Text } from "@chakra-ui/react";

// Dedicated renderer for Multiple Correct MCQ — a checkbox group instead of
// CommonMCQQuestion's radio group, since more than one option can be
// selected. `value` is a string[] of selected option labels.
export default function MultipleCorrectQuestion({ question, value, onChange }) {
  const selected = Array.isArray(value) ? value : [];

  return (
    <Box>
      <Text fontSize="xs" color="gray.500" mb={3}>Select all that apply.</Text>
      <Checkbox.Group value={selected} onValueChange={onChange}>
        <Stack gap={3}>
          {(question.options || []).map((item, index) => {
            const active = selected.includes(item);
            return (
              <Checkbox.Root
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
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label color="#0C1222" fontWeight={500}>{item}</Checkbox.Label>
              </Checkbox.Root>
            );
          })}
        </Stack>
      </Checkbox.Group>
    </Box>
  );
}

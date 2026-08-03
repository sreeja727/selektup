import { Grid, Box, HStack, Text } from "@chakra-ui/react";

const LEGEND = [
  { label: "Answered", bg: "#2E7D32" },
  { label: "Marked for Review", bg: "#B8860B" },
  { label: "Not Answered", bg: "gray.300" },
];

export default function QuestionPalette({
  totalQuestions,
  currentQuestion,
  onSelect,
  answers = {},
  marked = {},
}) {
  return (
    <>
      <Grid templateColumns="repeat(5, 1fr)" gap={2.5} mb={4}>
        {Array.from({ length: totalQuestions }, (_, i) => {
          const active = currentQuestion === i;
          const isAnswered = Boolean(answers[i]);
          const isMarked = Boolean(marked[i]);

          let bg = "gray.100";
          let color = "gray.600";
          let borderColor = "gray.200";
          if (isMarked) {
            bg = "#B8860B";
            color = "white";
            borderColor = "#B8860B";
          } else if (isAnswered) {
            bg = "#2E7D32";
            color = "white";
            borderColor = "#2E7D32";
          }
          if (active) {
            bg = "#039BE5";
            color = "white";
            borderColor = "#039BE5";
          }

          return (
            <Box
              key={i}
              as="button"
              onClick={() => onSelect(i)}
              h="38px"
              borderRadius="md"
              fontSize="sm"
              fontWeight={700}
              bg={bg}
              color={color}
              border="1px solid"
              borderColor={borderColor}
              boxShadow={active ? "0 2px 8px rgba(3,155,229,0.35)" : "none"}
              transition="all 0.15s"
              _hover={{
                borderColor: "#039BE5",
                color: active ? "white" : "#039BE5",
              }}
            >
              {i + 1}
            </Box>
          );
        })}
      </Grid>

      <Grid gap={1.5}>
        {LEGEND.map((item) => (
          <HStack key={item.label} gap={2}>
            <Box w="10px" h="10px" borderRadius="sm" bg={item.bg} flexShrink={0} />
            <Text fontSize="xs" color="gray.500">{item.label}</Text>
          </HStack>
        ))}
      </Grid>
    </>
  );
}

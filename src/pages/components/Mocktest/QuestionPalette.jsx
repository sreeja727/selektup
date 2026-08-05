import { Grid, Box, HStack, Text } from "@chakra-ui/react";

const STATUS_COLOR = {
  answeredMarked: "#7C3AED",
  marked: "#B8860B",
  answered: "#2E7D32",
  skipped: "#D32F2F",
  notVisited: "gray.300",
};

const LEGEND = [
  { label: "Answered", bg: STATUS_COLOR.answered },
  { label: "Marked for Review", bg: STATUS_COLOR.marked },
  { label: "Answered & Marked", bg: STATUS_COLOR.answeredMarked },
  { label: "Skipped", bg: STATUS_COLOR.skipped },
  { label: "Not Visited", bg: STATUS_COLOR.notVisited },
];

// Four-state status per question — the standard competitive-exam palette
// convention: Not Visited (never navigated to), Skipped (visited but left
// unanswered), Answered, and Marked for Review (with or without an answer).
function getStatus(isAnswered, isMarked, isVisited) {
  if (isMarked && isAnswered) return "answeredMarked";
  if (isMarked) return "marked";
  if (isAnswered) return "answered";
  if (isVisited) return "skipped";
  return "notVisited";
}

export default function QuestionPalette({
  totalQuestions,
  currentQuestion,
  onSelect,
  answers = {},
  marked = {},
  visited = {},
}) {
  return (
    <>
      <Grid
        templateColumns={{ base: "repeat(5, 1fr)", sm: "repeat(6, 1fr)", md: "repeat(8, 1fr)", lg: "repeat(5, 1fr)" }}
        gap={{ base: 2, md: 2.5 }}
        mb={4}
      >
        {Array.from({ length: totalQuestions }, (_, i) => {
          const active = currentQuestion === i;
          const status = getStatus(Boolean(answers[i]), Boolean(marked[i]), Boolean(visited[i]));

          let bg = STATUS_COLOR[status];
          let color = status === "notVisited" ? "gray.700" : "white";
          let borderColor = STATUS_COLOR[status];
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
              h={{ base: "34px", md: "38px" }}
              borderRadius="md"
              fontSize={{ base: "xs", md: "sm" }}
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

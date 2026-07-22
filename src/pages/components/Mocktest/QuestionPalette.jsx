import { Grid, Button } from "@chakra-ui/react";

export default function QuestionPalette({
  totalQuestions,
  currentQuestion,
  onSelect,
}) {
  return (
    <Grid templateColumns="repeat(5,1fr)" gap={2}>
      {Array.from({ length: totalQuestions }, (_, i) => (
        <Button
          key={i}
          size="sm"
          colorScheme={currentQuestion === i ? "blue" : "gray"}
          onClick={() => onSelect(i)}
        >
          {i + 1}
        </Button>
      ))}
    </Grid>
  );
}
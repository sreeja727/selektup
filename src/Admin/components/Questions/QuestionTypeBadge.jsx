import { Badge } from "@chakra-ui/react";
import { getTypeConfig } from "../../../pages/questionTypes";

const COLOR_BY_TYPE = {
  SINGLE_CORRECT_MCQ: "blue",
  MULTIPLE_CORRECT_MCQ: "purple",
  TRUE_FALSE: "teal",
  FILL_IN_THE_BLANK: "orange",
  ONE_WORD_ANSWER: "cyan",
  IMAGE_BASED: "pink",
  ASSERTION_AND_REASON: "green",
  STATEMENT_BASED: "yellow",
  PARAGRAPH_BASED: "cyan",
  LONG_ANSWER: "orange",
};

export default function QuestionTypeBadge({ type }) {
  const config = getTypeConfig(type);
  return (
    <Badge
      colorPalette={COLOR_BY_TYPE[type] || "gray"}
      variant={config.comingSoon ? "outline" : "solid"}
      borderRadius="full"
      px={2.5}
      py={0.5}
      fontSize="xs"
      fontWeight={700}
      whiteSpace="nowrap"
    >
      {config.label}{config.comingSoon ? " (Coming Soon)" : ""}
    </Badge>
  );
}

import CommonMCQQuestion from "./questions/CommonMCQQuestion";
import MultipleCorrectQuestion from "./questions/MultipleCorrectQuestion";
import FillInTheBlankQuestion from "./questions/FillInTheBlankQuestion";
import OneWordQuestion from "./questions/OneWordQuestion";
import NumericalQuestion from "./questions/NumericalQuestion";
import LongAnswerQuestion from "./questions/LongAnswerQuestion";

// The type -> component registry that makes the exam screen scalable: a new
// question type is one line here pointing at either an existing component
// (if it's structurally identical to one already handled — e.g. every
// single-select type reuses CommonMCQQuestion) or a new dedicated one.
// Nothing in TestScreen.jsx ever needs to change to support a new type.
const QUESTION_RENDERERS = {
  SINGLE_CORRECT_MCQ: CommonMCQQuestion,
  STATEMENT_BASED: CommonMCQQuestion,
  ASSERTION_AND_REASON: CommonMCQQuestion,
  PARAGRAPH_BASED: CommonMCQQuestion,
  TABLE_BASED: CommonMCQQuestion,
  IMAGE_BASED: CommonMCQQuestion,
  TRUE_FALSE: CommonMCQQuestion,
  MULTIPLE_CORRECT_MCQ: MultipleCorrectQuestion,
  FILL_IN_THE_BLANK: FillInTheBlankQuestion,
  ONE_WORD_ANSWER: OneWordQuestion,
  NUMERICAL: NumericalQuestion,
  LONG_ANSWER: LongAnswerQuestion,
};

// Renders the right answer-capture control for a question's type — reused
// by TestScreen.jsx. `value`/`onChange` follow questionTypes.js's
// convention: a string for single-select/text-answer kinds, a string[] of
// option labels for multi-select.
export default function QuestionAnswerInput({ question, value, onChange }) {
  const Renderer = QUESTION_RENDERERS[question.type] || CommonMCQQuestion;
  return <Renderer question={question} value={value} onChange={onChange} />;
}

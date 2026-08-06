import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  HStack,
  Stack,
  Table,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate, useParams, useLocation } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaTimesCircle,
  FaLightbulb,
  FaClipboardCheck,
  FaListAlt,
} from "react-icons/fa";
import { getTestAttempt, getSubmissionReview, getSubmission } from "../../selectors";
import { fetchSubmissionReview, fetchSubmission } from "../../actions";
import Loader from "../../../components/Loader";
import {
  QUESTION_KIND, getTypeConfig, isAnswered, isCorrect, getCorrectAnswerLabel, getSelectedAnswerLabel,
} from "../../questionTypes";

const LEGEND = [
  { label: "Correct", bg: "#2E7D32" },
  { label: "Incorrect", bg: "#D32F2F" },
  { label: "Needs Manual Grading", bg: "#7C3AED" },
  { label: "Not Answered", bg: "gray.300" },
];

export default function Review() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { submissionId } = useParams();
  const categorySlug = location.state?.categorySlug;
  const attempt = useSelector(getTestAttempt);
  const submissionReview = useSelector(getSubmissionReview);
  const submission = useSelector(getSubmission);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (submissionId) {
      dispatch(fetchSubmissionReview(submissionId));
      dispatch(fetchSubmission(submissionId));
    }
  }, [dispatch, submissionId]);

  if (submissionId) {
    if (!submissionReview || !submission) return <Loader fullScreen />;
  } else if (!attempt) {
    return <Navigate to="/test-series" replace />;
  }

  const questions = submissionId ? submissionReview : attempt.questions;
  if (!questions || questions.length === 0) {
    return <Navigate to={submissionId ? `/result/${submissionId}` : "/result"} replace />;
  }

  const scoreSource = submissionId ? submission : attempt;
  const stats = {
    correct: scoreSource.correct ?? 0,
    wrong: scoreSource.wrong ?? 0,
    skipped: scoreSource.unanswered ?? 0,
    score: scoreSource.score ?? 0,
    totalMarks: scoreSource.totalMarks,
    cutOffMarks: scoreSource.cutOffMarks,
  };
  const passed = stats.score >= stats.cutOffMarks;

  const q = questions[current];
  const config = getTypeConfig(q.type);
  const answered = isAnswered(q, q.selected);
  const correct = isCorrect(q, q.selected);
  const pendingManualGrading = config.manualGrading && answered;
  const selectedValues = config.kind === QUESTION_KIND.MULTI_SELECT && Array.isArray(q.selected) ? q.selected : [];
  const isFreeAnswerKind = config.kind === QUESTION_KIND.TEXT_ANSWER || config.kind === QUESTION_KIND.NUMERIC_ANSWER;
  const progressPercent = ((current + 1) / questions.length) * 100;

  const goPrevious = () => setCurrent((c) => Math.max(0, c - 1));
  const goNext = () => setCurrent((c) => Math.min(questions.length - 1, c + 1));

  return (
    <Box bg="#F8F9FA" minH="100vh" p={{ base: 4, md: 6 }}>
      {/* Header */}
      <Flex
        bg="white"
        p={{ base: 4, md: 5 }}
        borderRadius="xl"
        border="1px solid"
        borderColor="gray.100"
        justify="space-between"
        align="center"
        boxShadow="0 2px 10px rgba(0,0,0,0.05)"
        mb={5}
        wrap="wrap"
        gap={3}
      >
        <Heading size="md" color="#0C1222" fontWeight={800}>
          Review Answers
        </Heading>

        <HStack gap={3}>
          <Button
            variant="outline"
            borderRadius="lg"
            size="sm"
            onClick={() => navigate(submissionId ? `/result/${submissionId}` : "/result")}
          >
            <FaClipboardCheck size={12} />
            Back to Result
          </Button>

          <Button
            variant="outline"
            borderRadius="lg"
            size="sm"
            onClick={() => navigate(categorySlug ? `/test-series/${categorySlug}` : "/test-series")}
          >
            <FaListAlt size={12} />
            Test Series
          </Button>
        </HStack>
      </Flex>

      <Flex
        bg="white"
        p={{ base: 4, md: 5 }}
        borderRadius="xl"
        border="1px solid"
        borderColor="gray.100"
        boxShadow="0 2px 10px rgba(0,0,0,0.05)"
        mb={5}
        justify="space-between"
        align="center"
        wrap="wrap"
        gap={4}
      >
        <Stack gap={0}>
          <Text fontSize="xs" color="gray.500" fontWeight={700} textTransform="uppercase" letterSpacing="0.06em">
            Score
          </Text>
          <Heading size="lg" color={passed ? "green.500" : "red.500"} fontWeight={900}>
            {stats.score}
            <Text as="span" fontSize="sm" color="gray.400" fontWeight={600}> / {stats.totalMarks}</Text>
          </Heading>
        </Stack>
        <HStack gap={6} fontSize="sm" wrap="wrap">
          <Stack gap={0} align="center">
            <Text fontWeight={800} color="green.500">{stats.correct}</Text>
            <Text fontSize="2xs" color="gray.500" fontWeight={600} textTransform="uppercase">Correct</Text>
          </Stack>
          <Stack gap={0} align="center">
            <Text fontWeight={800} color="red.500">{stats.wrong}</Text>
            <Text fontSize="2xs" color="gray.500" fontWeight={600} textTransform="uppercase">Wrong</Text>
          </Stack>
          <Stack gap={0} align="center">
            <Text fontWeight={800} color="gray.500">{stats.skipped}</Text>
            <Text fontSize="2xs" color="gray.500" fontWeight={600} textTransform="uppercase">Skipped</Text>
          </Stack>
        </HStack>
      </Flex>

      <Grid templateColumns={{ base: "1fr", lg: "3fr 1fr" }} gap={5}>
        {/* Question Section */}
        <Box
          bg="white"
          p={{ base: 5, md: 7 }}
          borderRadius="xl"
          border="1px solid"
          borderColor="gray.100"
          boxShadow="0 2px 10px rgba(0,0,0,0.05)"
        >
          <Flex justify="space-between" align="center" mb={2} wrap="wrap" gap={2}>
            <Text color="#039BE5" fontWeight={700} fontSize="sm" letterSpacing="0.02em">
              QUESTION {current + 1} OF {questions.length}
            </Text>
            <Text
              fontSize="xs"
              fontWeight={700}
              px={2.5}
              py={0.5}
              borderRadius="full"
              bg={!answered ? "gray.100" : pendingManualGrading ? "purple.50" : correct ? "green.50" : "red.50"}
              color={!answered ? "gray.500" : pendingManualGrading ? "purple.600" : correct ? "green.600" : "red.600"}
            >
              {!answered ? "Not Answered" : pendingManualGrading ? "Needs Manual Grading" : correct ? "Correct" : "Incorrect"}
            </Text>
          </Flex>

          <Box bg="gray.100" borderRadius="full" h="6px" overflow="hidden" mb={6}>
            <Box
              h="100%"
              borderRadius="full"
              bg="#039BE5"
              w={`${progressPercent}%`}
              transition="width 0.3s ease"
            />
          </Box>

          <Heading size="md" color="#0C1222" fontWeight={700} mb={6} lineHeight="1.5">
            {q.question}
          </Heading>

          {config.hasPassage && (q.passageTitle || q.passageText) && (
            <Box mb={5} bg="gray.50" borderRadius="lg" p={4}>
              {q.passageTitle && <Text fontWeight={700} color="#0C1222" mb={2}>{q.passageTitle}</Text>}
              {q.passageText && <Text color="#0C1222" whiteSpace="pre-wrap">{q.passageText}</Text>}
            </Box>
          )}

          {config.hasTable && q.tableHeaders?.length > 0 && (
            <Box mb={5} overflowX="auto" border="1px solid" borderColor="gray.100" borderRadius="lg">
              <Table.Root size="sm">
                <Table.Header>
                  <Table.Row bg="gray.50">
                    {q.tableHeaders.map((header, i) => (
                      <Table.ColumnHeader key={i}>{header}</Table.ColumnHeader>
                    ))}
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {(q.tableRows || []).map((row, rowIndex) => (
                    <Table.Row key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <Table.Cell key={cellIndex}>{cell}</Table.Cell>
                      ))}
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
          )}

          {config.hasStatements && q.statements?.length > 0 && (
            <Stack gap={1} mb={5}>
              {q.statements.map((statement, index) => (
                <Text key={index} color="#0C1222">{index + 1}. {statement}</Text>
              ))}
            </Stack>
          )}

          {config.hasAssertionReason && (
            <Stack gap={1} mb={5} bg="gray.50" borderRadius="lg" p={4}>
              <Text color="#0C1222"><Text as="span" fontWeight={700}>Reason (R): </Text>{q.reason}</Text>
            </Stack>
          )}

          {isFreeAnswerKind ? (
            <Stack align="stretch" gap={3}>
              <Flex
                justify="space-between"
                align="center"
                gap={3}
                p={4}
                border="2px solid"
                borderColor={!answered ? "gray.200" : pendingManualGrading ? "purple.300" : correct ? "green.400" : "red.400"}
                borderRadius="lg"
                bg={!answered ? "white" : pendingManualGrading ? "purple.50" : correct ? "green.50" : "red.50"}
              >
                <Text color="#0C1222" fontWeight={500}>{q.selected ?? "Not Answered"}</Text>
                {answered && !pendingManualGrading && (correct
                  ? <FaCheckCircle color="#22C55E" size={16} style={{ flexShrink: 0 }} />
                  : <FaTimesCircle color="#EF5350" size={16} style={{ flexShrink: 0 }} />)}
              </Flex>
            </Stack>
          ) : (
            <Stack align="stretch" gap={3}>
              {(q.options || []).map((option, index) => {
                const isCorrectOption = (q.correctOptionIndexes || []).includes(index);
                const isSelectedOption = config.kind === QUESTION_KIND.MULTI_SELECT
                  ? selectedValues.includes(option)
                  : q.selected === option;
                return (
                  <Flex
                    key={option}
                    justify="space-between"
                    align="center"
                    gap={3}
                    p={4}
                    border="2px solid"
                    borderColor={
                      isCorrectOption
                        ? "green.400"
                        : isSelectedOption
                        ? "red.400"
                        : "gray.200"
                    }
                    borderRadius="lg"
                    bg={
                      isCorrectOption
                        ? "green.50"
                        : isSelectedOption
                        ? "red.50"
                        : "white"
                    }
                  >
                    <Text color="#0C1222" fontWeight={500}>{option}</Text>
                    {isCorrectOption && <FaCheckCircle color="#22C55E" size={16} style={{ flexShrink: 0 }} />}
                    {!isCorrectOption && isSelectedOption && <FaTimesCircle color="#EF5350" size={16} style={{ flexShrink: 0 }} />}
                  </Flex>
                );
              })}
            </Stack>
          )}

          <Stack gap={3} mt={6}>
            <Flex fontSize="sm" wrap="wrap" gap={2}>
              <Text fontWeight={700} color="#0C1222">Your Answer:</Text>
              <Text fontWeight={600} color={!answered ? "gray.500" : pendingManualGrading ? "purple.600" : correct ? "green.500" : "red.500"}>
                {getSelectedAnswerLabel(q, q.selected) || "Not Answered"}
              </Text>
            </Flex>

            <Flex fontSize="sm" wrap="wrap" gap={2}>
              <Text fontWeight={700} color="#0C1222">Correct Answer:</Text>
              <Text fontWeight={600} color="green.500">{getCorrectAnswerLabel(q)}</Text>
            </Flex>

            <Flex align="flex-start" gap={3} bg="blue.50" p={4} borderRadius="lg">
              <Box color="#039BE5" mt={0.5} flexShrink={0}>
                <FaLightbulb size={16} />
              </Box>
              <Box>
                <Text fontWeight={700} color="#0C1222" fontSize="sm" mb={1}>Solution / Explanation</Text>
                <Text fontSize="sm" color="gray.600">
                  {q.explanation || "No explanation provided for this question."}
                </Text>
              </Box>
            </Flex>
          </Stack>

          <Flex mt={8} justify="space-between" wrap="wrap" gap={3}>
            <Button
              border="2px solid"
              borderColor="gray.300"
              color="#0C1222"
              bg="white"
              fontWeight={700}
              borderRadius="lg"
              _hover={{ borderColor: "#039BE5", color: "#039BE5" }}
              disabled={current === 0}
              onClick={goPrevious}
              flex={{ base: "1 1 100%", sm: "0 1 auto" }}
            >
              <FaArrowLeft size={12} />
              Previous
            </Button>

            <Button
              bg="#039BE5"
              color="white"
              fontWeight={700}
              borderRadius="lg"
              _hover={{ bg: "#0277BD" }}
              disabled={current === questions.length - 1}
              onClick={goNext}
              flex={{ base: "1 1 100%", sm: "0 1 auto" }}
            >
              Next
              <FaArrowRight size={12} />
            </Button>
          </Flex>
        </Box>

        {/* Question Palette */}
        <Box
          bg="white"
          p={{ base: 4, md: 5 }}
          borderRadius="xl"
          border="1px solid"
          borderColor="gray.100"
          boxShadow="0 2px 10px rgba(0,0,0,0.05)"
          alignSelf="start"
          position={{ lg: "sticky" }}
          top={{ lg: "24px" }}
        >
          <Heading size="sm" color="#0C1222" fontWeight={700} mb={4}>
            Question Palette
          </Heading>

          <Grid
            templateColumns={{ base: "repeat(5, 1fr)", sm: "repeat(6, 1fr)", md: "repeat(8, 1fr)", lg: "repeat(5, 1fr)" }}
            gap={{ base: 2, md: 2.5 }}
            mb={4}
            maxH={{ base: "220px", lg: "440px" }}
            overflowY="auto"
            pr={1}
          >
            {questions.map((item, index) => {
              const active = current === index;
              const itemConfig = getTypeConfig(item.type);
              const itemAnswered = isAnswered(item, item.selected);
              const itemCorrect = isCorrect(item, item.selected);
              const itemPendingManualGrading = itemConfig.manualGrading && itemAnswered;

              let bg = "gray.300";
              let color = "gray.700";
              let borderColor = "gray.300";
              if (itemAnswered) {
                bg = itemPendingManualGrading ? "#7C3AED" : itemCorrect ? "#2E7D32" : "#D32F2F";
                color = "white";
                borderColor = bg;
              }
              if (active) {
                bg = "#039BE5";
                color = "white";
                borderColor = "#039BE5";
              }

              return (
                <Box
                  key={item.id ?? index}
                  as="button"
                  onClick={() => setCurrent(index)}
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
                  {index + 1}
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
        </Box>
      </Grid>
    </Box>
  );
}

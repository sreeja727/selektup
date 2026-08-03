import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  HStack,
  RadioGroup,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FaArrowLeft, FaArrowRight, FaBookmark, FaPaperPlane } from "react-icons/fa";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import Timer from "./Timer";
import QuestionPalette from "./QuestionPalette";
import SubmitModal from "./SubmitModal";
import { buildQuestionSet } from "./questionBank";
import { getTest } from "../../../data/testSeries";
import { isLoggedIn } from "../../../utils/auth";
import { fetchAccessStatus, fetchTestCategories, fetchTestCategoryDetail, fetchTestDetail } from "../../actions";
import { actions } from "../../slice";
import {
  getRawStatusForCategory, getStatusLoading,
  getTestCategories, getTestCategoryDetail,
  getTestDetail,
} from "../../selectors";
import { ACCESS_STATUS } from "../../constants";
import Loader from "../../../components/Loader";

export default function TestScreen() {
  const { categorySlug, testSlug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Mock-slug lookup kept for any old links; real categories/tests are
  // looked up by numeric id from the backend instead.
  const mockResult = getTest(categorySlug, testSlug);

  const realCategories = useSelector(getTestCategories);
  const realDetail = useSelector(getTestCategoryDetail);
  const realTestDetail = useSelector(getTestDetail);
  const realCategory = useMemo(
    () => realCategories.find((c) => String(c.id) === categorySlug),
    [realCategories, categorySlug]
  );
  const isReal = !mockResult && !!realCategory;
  const realDetailMatches = realDetail && String(realDetail.id) === categorySlug;
  const realTestDetailMatches = realTestDetail && String(realTestDetail.id) === testSlug;
  const realTest = realDetailMatches ? realDetail.tests?.find((t) => String(t.id) === testSlug) : null;
  const result = mockResult || (isReal && realTest ? { category: realCategory, test: realTest } : null);
  const testTitle = result ? `${result.category.title} — ${result.test.title}` : "Mock Test";

  const loggedIn = isLoggedIn();
  // eslint-disable-next-line no-unused-vars -- TEMP: unused while the gate below is disabled
  const status = useSelector(getRawStatusForCategory(categorySlug));
  // eslint-disable-next-line no-unused-vars -- TEMP: unused while the gate below is disabled
  const statusLoading = useSelector(getStatusLoading);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [marked, setMarked] = useState({});
  const { open, onOpen, onClose } = useDisclosure();
  const submittedRef = useRef(false);

  useEffect(() => {
    dispatch(fetchTestCategories());
  }, [dispatch]);

  useEffect(() => {
    if (!loggedIn || !categorySlug) return;
    if (isReal) {
      dispatch(fetchTestCategoryDetail(categorySlug));
      dispatch(fetchTestDetail({ categoryId: categorySlug, testId: testSlug }));
    } else {
      dispatch(fetchAccessStatus(categorySlug));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorySlug, testSlug, loggedIn, isReal]);

  // Real per-test duration/marks/cutoff/negative-marking need the authed
  // detail call; the question count has to be known up front to build a
  // stable question set, so wait for it rather than guessing then resizing.
  const isPendingRealDetail = isReal && !realTestDetailMatches;

  const totalQuestions = isReal
    ? (realTestDetailMatches ? realTestDetail.totalQuestions : null)
    : (mockResult?.test.questions ?? 10);
  const totalMarks = isReal && realTestDetailMatches
    ? realTestDetail.totalMarks
    : (mockResult?.test.marks ?? totalQuestions ?? 100);
  const durationMinutes = isReal && realTestDetailMatches ? realTestDetail.durationMinutes : (mockResult?.test.duration ?? 120);
  const cutOffMarks = isReal && realTestDetailMatches ? realTestDetail.cutOffMarks : 35;
  const negativeWrongCount = isReal && realTestDetailMatches ? realTestDetail.negativeMarkingWrongCount : 3;
  const negativeDeduction = isReal && realTestDetailMatches ? realTestDetail.negativeMarkingDeduction : 2;

  const questions = useMemo(
    () => (isPendingRealDetail ? [] : buildQuestionSet(totalQuestions || 10)),
    [isPendingRealDetail, totalQuestions]
  );

  function finalizeAndSubmit() {
    if (submittedRef.current || questions.length === 0) return;
    submittedRef.current = true;

    const marksPerQuestion = totalMarks / questions.length;
    let correct = 0;
    let wrong = 0;
    const questionResults = questions.map((q, i) => {
      const selectedOption = answers[i] || null;
      if (selectedOption && selectedOption === q.correctAnswer) correct += 1;
      else if (selectedOption) wrong += 1;
      return { ...q, selected: selectedOption };
    });
    const unanswered = questions.length - correct - wrong;
    const penalty = negativeWrongCount > 0 ? Math.floor(wrong / negativeWrongCount) * negativeDeduction : 0;
    const score = Math.max(0, Math.round((correct * marksPerQuestion - penalty) * 100) / 100);

    dispatch(actions.setTestAttempt({
      testTitle,
      totalQuestions: questions.length,
      totalMarks,
      cutOffMarks,
      correct,
      wrong,
      unanswered,
      penalty,
      score,
      questions: questionResults,
      submittedAt: new Date().toISOString(),
    }));

    navigate("/result", { replace: true });
  }

  // Trap the very next "Back" press: push a duplicate history entry once, on
  // mount, so pressing Back lands on this same URL (no route change) instead
  // of immediately unmounting this screen — react-router's own popstate
  // listener runs before ours and would otherwise navigate away first.
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
  }, []);

  // Any attempt to leave the exam mid-test — browser back/forward, or
  // switching/hiding the tab — auto-submits with whatever was answered so far.
  useEffect(() => {
    function handlePopState() {
      finalizeAndSubmit();
    }
    function handleVisibilityChange() {
      if (document.hidden) finalizeAndSubmit();
    }
    window.addEventListener("popstate", handlePopState);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, questions, totalMarks, cutOffMarks, negativeWrongCount, negativeDeduction, testTitle]);

  if (!result) return <Navigate to="/test-series" replace />;

  // TEMP: auth/access gate disabled to preview the screen without logging in.
  // Restore before shipping:
  // if (!loggedIn) {
  //   return <Navigate to={`/login?redirect=/test-series/${categorySlug}/${testSlug}`} replace />;
  // }
  //
  // if (status === undefined || statusLoading) {
  //   return <Loader fullScreen />;
  // }
  //
  // if (status !== ACCESS_STATUS.APPROVED) {
  //   return <Navigate to={`/test-series/${categorySlug}`} replace />;
  // }

  if (isPendingRealDetail || questions.length === 0) {
    return <Loader fullScreen />;
  }

  const question = questions[currentQuestion];
  const selected = answers[currentQuestion] || "";
  const isFirst = currentQuestion === 0;
  const isLast = currentQuestion === questions.length - 1;
  const isMarked = Boolean(marked[currentQuestion]);

  const goPrevious = () => setCurrentQuestion((c) => Math.max(0, c - 1));
  const goNext = () => setCurrentQuestion((c) => Math.min(questions.length - 1, c + 1));
  const toggleMarkForReview = () => {
    setMarked((prev) => ({ ...prev, [currentQuestion]: !prev[currentQuestion] }));
  };

  const answeredCount = Object.keys(answers).length;
  const reviewCount = Object.values(marked).filter(Boolean).length;

  return (
    <Box bg="#F8F9FA" minH="100vh" p={{ base: 4, md: 6 }}>
      {/* Header */}
      <Flex
        bg="white"
        p={5}
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
          {testTitle}
        </Heading>

        <Timer
          duration={durationMinutes * 60}
          onTimeUp={finalizeAndSubmit}
        />
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
          <Text color="#039BE5" fontWeight={700} fontSize="sm" letterSpacing="0.02em" mb={3}>
            QUESTION {currentQuestion + 1} OF {questions.length}
          </Text>

          <Heading size="md" color="#0C1222" fontWeight={700} mb={6} lineHeight="1.5">
            {question.question}
          </Heading>

          <RadioGroup.Root
            value={selected}
            onValueChange={(e) =>
              setAnswers((prev) => ({ ...prev, [currentQuestion]: e.value }))
            }
          >
            <Stack gap={3}>
              {question.options.map((item, index) => {
                const active = selected === item;
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

          <Flex mt={10} justify="space-between" wrap="wrap" gap={3}>
            <Button variant="outline" borderRadius="lg" disabled={isFirst} onClick={goPrevious}>
              <FaArrowLeft size={12} />
              Previous
            </Button>

            <HStack gap={3} wrap="wrap">
              <Button
                variant="outline"
                borderColor="#E6A700"
                color="#B8860B"
                bg={isMarked ? "rgba(230,167,0,0.12)" : "transparent"}
                borderRadius="lg"
                _hover={{ bg: "rgba(230,167,0,0.08)" }}
                onClick={toggleMarkForReview}
              >
                <FaBookmark size={12} />
                {isMarked ? "Marked" : "Mark for Review"}
              </Button>

              <Button
                bg="#039BE5"
                color="white"
                borderRadius="lg"
                fontWeight={700}
                _hover={{ bg: "#0277BD" }}
                disabled={isLast}
                onClick={goNext}
              >
                Save &amp; Next
                <FaArrowRight size={12} />
              </Button>

              <Button
                bg="#D32F2F"
                color="white"
                borderRadius="lg"
                fontWeight={700}
                _hover={{ bg: "#B71C1C" }}
                onClick={onOpen}
              >
                <FaPaperPlane size={12} />
                Submit
              </Button>
            </HStack>
          </Flex>
        </Box>

        {/* Question Palette */}
        <Box
          bg="white"
          p={5}
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
          <QuestionPalette
            totalQuestions={questions.length}
            currentQuestion={currentQuestion}
            onSelect={setCurrentQuestion}
            answers={answers}
            marked={marked}
          />
        </Box>
      </Grid>

      <SubmitModal
        isOpen={open}
        onClose={onClose}
        answered={answeredCount}
        notAnswered={questions.length - answeredCount}
        review={reviewCount}
        onSubmit={() => {
          onClose();
          finalizeAndSubmit();
        }}
      />
    </Box>
  );
}

import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  HStack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FaArrowLeft, FaArrowRight, FaBookmark, FaPaperPlane } from "react-icons/fa";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import Timer from "./Timer";
import QuestionPalette from "./QuestionPalette";
import QuestionAnswerInput from "./QuestionAnswerInput";
import SubmitModal from "./SubmitModal";
import { buildQuestionSet } from "./questionBank";
import { getTest } from "../../../data/testSeries";
import { isLoggedIn } from "../../../utils/auth";
import {
  fetchAccessStatus, fetchTestCategories, fetchTestCategoryDetail, fetchTestDetail,
  fetchTestQuestions, submitTest, startTest,
} from "../../actions";
import { actions } from "../../slice";
import {
  getRawStatusForCategory, getStatusLoading,
  getTestCategories, getTestCategoryDetail,
  getTestDetail, getTestQuestions, getTestQuestionsLoading,
  getSubmitTestLoading, getSubmitTestResult,
} from "../../selectors";
import { ACCESS_STATUS } from "../../constants";
import { isAnswered, buildSubmitAnswer } from "../../questionTypes";
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
  const rawTestQuestions = useSelector(getTestQuestions);
  const testQuestionsLoading = useSelector(getTestQuestionsLoading);
  const submitTestLoading = useSelector(getSubmitTestLoading);
  const submitTestResult = useSelector(getSubmitTestResult);
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

  // No backend endpoint exists to save progress mid-test (only the final
  // POST /tests/{testId}/submit), so "auto-save" is local-only: read any
  // saved attempt for this exact test once at mount (a lazy initializer,
  // not an effect, since this is a one-time read of an external source —
  // avoids a setState-in-effect cascade), and persist on every change via
  // the debounced effect further below. Cleared once actually submitted
  // (see finalizeAndSubmit and the submit-result effect below).
  const attemptStorageKey = `mocktest-attempt:${categorySlug}:${testSlug}`;
  const [savedAttempt] = useState(() => {
    try {
      const raw = localStorage.getItem(attemptStorageKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [currentQuestion, setCurrentQuestion] = useState(() => savedAttempt?.currentQuestion ?? 0);
  const [answers, setAnswers] = useState(() => savedAttempt?.answers ?? {});
  const [marked, setMarked] = useState(() => savedAttempt?.marked ?? {});
  // Tracks every question index the student has actually navigated to, so
  // the palette can distinguish "Skipped" (visited, left unanswered) from
  // "Not Visited" (never opened) — the standard competitive-exam status set.
  const [visited, setVisited] = useState(() => savedAttempt?.visited ?? { 0: true });
  const { open, onOpen, onClose } = useDisclosure();
  const submittedRef = useRef(false);
  // Guards the submit-result effect below so a stale submitTestResult left
  // over in redux from a previous attempt can't trigger an unwanted
  // navigation to /result before this mount has actually submitted.
  const awaitingSubmitRef = useRef(false);
  // Guards the leave-mid-test traps below (popstate/visibilitychange) so they
  // can't fire before the exam UI has actually been shown — e.g. a spurious
  // "hidden" visibility event while data is still loading would otherwise
  // auto-submit with zero answers before the student ever sees a question.
  const examStartedRef = useRef(false);
  // Some embedded/preview contexts (e.g. a webview that never gets real OS
  // focus) report document.hidden === true from the very first check, not
  // just briefly during load. Only trust a "tab went hidden" auto-submit once
  // the page has been observed genuinely visible at least once — otherwise an
  // environment that's hidden by default would auto-submit the instant the
  // exam becomes ready, without ever needing an actual tab-switch.
  const hasBeenVisibleRef = useRef(!document.hidden);

  useEffect(() => {
    dispatch(fetchTestCategories());
  }, [dispatch]);

  useEffect(() => {
    if (!loggedIn || !categorySlug) return;
    if (isReal) {
      dispatch(fetchTestCategoryDetail(categorySlug));
      dispatch(fetchTestDetail({ categoryId: categorySlug, testId: testSlug }));
      dispatch(fetchTestQuestions(testSlug));
      dispatch(startTest(testSlug));
    } else {
      dispatch(fetchAccessStatus(categorySlug));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorySlug, testSlug, loggedIn, isReal]);

  // Real per-test duration/marks/cutoff/negative-marking need the authed
  // detail call; the question count has to be known up front to build a
  // stable question set, so wait for it rather than guessing then resizing.
  const isPendingRealDetail = isReal && !realTestDetailMatches;

  // rawTestQuestions is already in the canonical shape (see
  // questionTypes.js/slice.js's normalizeQuestion) — just rename `text` to
  // `question`, the key this screen and Review.jsx render from.
  const realQuestions = useMemo(() => {
    if (!isReal) return [];
    return rawTestQuestions.map((q, i) => ({
      ...q,
      id: q.id ?? i,
      question: q.text,
    }));
  }, [isReal, rawTestQuestions]);

  const totalQuestions = isReal
    ? (realTestDetailMatches ? realTestDetail.totalQuestions : null)
    : (mockResult?.test.questions ?? 10);
  const totalMarks = isReal && realTestDetailMatches
    ? (realTestDetail.totalMarks ?? totalQuestions ?? 100)
    : (mockResult?.test.marks ?? totalQuestions ?? 100);
  // Falls back to 75 when the backend hasn't set a duration yet (0/null/undefined)
  // — Timer starts counting down from `duration * 60` and fires onTimeUp the
  // instant it mounts if that's <= 0, which would auto-submit before the
  // student ever sees a question. Matches the placeholder shown on the
  // Instructions screen so the promised duration and the actual timer agree.
  const durationMinutes = isReal && realTestDetailMatches ? (realTestDetail.durationMinutes || 75) : (mockResult?.test.duration ?? 120);
  const cutOffMarks = isReal && realTestDetailMatches ? (realTestDetail.cutOffMarks ?? 35) : 35;
  // Fixed marking scheme: +1 mark per correct answer, -1/3 mark per wrong
  // answer, no deduction for unattempted questions (matches the Instructions
  // screen). Expressed as a fraction of marksPerQuestion so it still scales
  // correctly if a test isn't weighted exactly 1 mark per question.
  const NEGATIVE_MARK_FRACTION = 1 / 3;

  const questions = useMemo(() => {
    if (isReal) return realQuestions;
    return isPendingRealDetail ? [] : buildQuestionSet(totalQuestions || 10);
  }, [isReal, realQuestions, isPendingRealDetail, totalQuestions]);

  // True once every loading gate below has cleared and the question UI is
  // about to actually render.
  const examReady = !isPendingRealDetail && questions.length > 0 && !(isReal && testQuestionsLoading) && !(isReal && submitTestLoading);
  useEffect(() => {
    if (examReady) examStartedRef.current = true;
  }, [examReady]);

  // Persists the in-progress attempt to localStorage on every change
  // (debounced) — see the lazy `savedAttempt` initializer above for the
  // restore side of this.
  useEffect(() => {
    if (!examReady) return;
    const handle = setTimeout(() => {
      try {
        localStorage.setItem(attemptStorageKey, JSON.stringify({
          answers, marked, visited, currentQuestion,
        }));
      } catch {
        // Storage full/unavailable — auto-save is best-effort, not required.
      }
    }, 300);
    return () => clearTimeout(handle);
  }, [examReady, attemptStorageKey, answers, marked, visited, currentQuestion]);

  function finalizeAndSubmit() {
    if (submittedRef.current || questions.length === 0) return;
    submittedRef.current = true;
    // The attempt is being finalized either way (mock path scores locally
    // below, real path dispatches submitTest) — clear the auto-saved draft
    // now so a later visit to this same test starts fresh instead of
    // resuming a completed attempt.
    try {
      localStorage.removeItem(attemptStorageKey);
    } catch {
      // Storage unavailable — nothing to clean up.
    }

    if (isReal) {
      // Confirmed via OpenAPI: AnswerEntry is { questionId, selectedOption } —
      // a single string for every type. buildSubmitAnswer encodes
      // multi-select as comma-separated letters and text-answer as the
      // literal answer text into that same field — see questionTypes.js.
      const submitAnswers = questions.map((q, i) => buildSubmitAnswer(q, answers[i]));
      awaitingSubmitRef.current = true;
      dispatch(submitTest({ testId: testSlug, answers: submitAnswers }));
      return;
    }

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
    const penalty = wrong * marksPerQuestion * NEGATIVE_MARK_FRACTION;
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

  // Once the real submit endpoint resolves, build the same testAttempt shape
  // the mock path produces (Review/Result screens are shared by both), using
  // the backend's computed score fields where present and falling back to
  // locally-known values (marks/cutoff/per-question correctAnswer) otherwise.
  useEffect(() => {
    if (!awaitingSubmitRef.current || !submitTestResult) return;
    awaitingSubmitRef.current = false;

    const r = submitTestResult;
    if (r.submissionId) {
      navigate(`/result/${r.submissionId}`, { replace: true });
      return;
    }

    // Fallback for a backend that doesn't return a submissionId yet: build
    // the same testAttempt shape locally so Result/Review (mock-test path)
    // still work off Redux state.
    dispatch(actions.setTestAttempt({
      testTitle,
      totalQuestions: questions.length,
      totalMarks: r.totalMarks ?? totalMarks,
      cutOffMarks: r.cutOffMarks ?? cutOffMarks,
      correct: r.correct ?? 0,
      wrong: r.wrong ?? 0,
      unanswered: r.unanswered ?? (questions.length - questions.filter((q, i) => isAnswered(q, answers[i])).length),
      penalty: r.penalty ?? 0,
      score: r.score ?? 0,
      questions: questions.map((q, i) => ({ ...q, selected: answers[i] || null })),
      submittedAt: new Date().toISOString(),
    }));

    navigate("/result", { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitTestResult]);

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
      if (examStartedRef.current) finalizeAndSubmit();
    }
    function handleVisibilityChange() {
      if (!document.hidden) {
        hasBeenVisibleRef.current = true;
        return;
      }
      if (examStartedRef.current && hasBeenVisibleRef.current) finalizeAndSubmit();
    }
    window.addEventListener("popstate", handlePopState);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, questions, totalMarks, cutOffMarks, testTitle]);

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

  if (isPendingRealDetail || questions.length === 0 || (isReal && testQuestionsLoading)) {
    return <Loader fullScreen />;
  }

  // Submitting a real test is a round trip to the backend (it computes the
  // score) rather than an instant local calculation, so block the UI until
  // the submit-result effect above navigates away.
  if (isReal && submitTestLoading) {
    return <Loader fullScreen />;
  }

  // A restored attempt's currentQuestion could be out of range if the
  // question set legitimately changed size since it was saved — clamp
  // rather than crash on questions[currentQuestion] below.
  if (currentQuestion >= questions.length) {
    setCurrentQuestion(0);
  }

  // Marks the question about to be shown visited — a render-time state
  // adjustment (same pattern used elsewhere in this codebase, e.g.
  // QuestionsAdd.jsx's category/test defaults) rather than an effect, since
  // this is purely derived from `currentQuestion` and doesn't touch any
  // external system.
  if (!visited[currentQuestion]) {
    setVisited((prev) => ({ ...prev, [currentQuestion]: true }));
  }

  const question = questions[currentQuestion];
  const selected = answers[currentQuestion];
  const isFirst = currentQuestion === 0;
  const isLast = currentQuestion === questions.length - 1;
  const isMarked = Boolean(marked[currentQuestion]);

  const goPrevious = () => setCurrentQuestion((c) => Math.max(0, c - 1));
  const goNext = () => setCurrentQuestion((c) => Math.min(questions.length - 1, c + 1));
  const toggleMarkForReview = () => {
    setMarked((prev) => ({ ...prev, [currentQuestion]: !prev[currentQuestion] }));
  };

  // A plain { [index]: boolean } "is this one answered" map — the palette
  // only needs truthiness, and this keeps it agnostic to whether a given
  // question's answer is a string (single-select/text-answer) or an array
  // (multi-select). Cheap enough (one pass over the question set) to
  // recompute on every render rather than memoizing.
  const answeredMap = Object.fromEntries(questions.map((q, i) => [i, isAnswered(q, answers[i])]));
  const answeredCount = Object.values(answeredMap).filter(Boolean).length;
  const reviewCount = Object.values(marked).filter(Boolean).length;

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

          <QuestionAnswerInput
            question={question}
            value={selected}
            onChange={(value) => setAnswers((prev) => ({ ...prev, [currentQuestion]: value }))}
          />

          <Flex mt={{ base: 6, md: 10 }} justify="space-between" wrap="wrap" gap={3}>
            <Button
              border="2px solid"
              borderColor="gray.300"
              color="#0C1222"
              bg="white"
              fontWeight={700}
              borderRadius="lg"
              _hover={{ borderColor: "#039BE5", color: "#039BE5" }}
              disabled={isFirst}
              onClick={goPrevious}
              flex={{ base: "1 1 100%", sm: "0 1 auto" }}
            >
              <FaArrowLeft size={12} />
              Previous
            </Button>

            <HStack gap={3} wrap="wrap" w={{ base: "100%", sm: "auto" }}>
              <Button
                variant="outline"
                borderColor="#E6A700"
                color="#B8860B"
                bg={isMarked ? "rgba(230,167,0,0.12)" : "transparent"}
                borderRadius="lg"
                _hover={{ bg: "rgba(230,167,0,0.08)" }}
                onClick={toggleMarkForReview}
                flex={{ base: "1 1 100%", sm: "0 1 auto" }}
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
                flex={{ base: "1 1 100%", sm: "0 1 auto" }}
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
                flex={{ base: "1 1 100%", sm: "0 1 auto" }}
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
          <QuestionPalette
            totalQuestions={questions.length}
            currentQuestion={currentQuestion}
            onSelect={setCurrentQuestion}
            answers={answeredMap}
            marked={marked}
            visited={visited}
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

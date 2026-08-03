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
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Navigate } from "react-router-dom";
import Timer from "./Timer";
import QuestionPalette from "./QuestionPalette";
import SubmitModal from "./SubmitModal";
import { getTest } from "../../../data/testSeries";
import { isLoggedIn } from "../../../utils/auth";
import { fetchAccessStatus, fetchTestCategories, fetchTestCategoryDetail } from "../../actions";
import {
  getRawStatusForCategory, getStatusLoading,
  getTestCategories, getTestCategoryDetail,
} from "../../selectors";
import { ACCESS_STATUS } from "../../constants";
import Loader from "../../../components/Loader";

const MOCK_QUESTIONS = [
  {
    question: "Which of the following statements about the Indian Constitution is correct?",
    options: [
      "It was adopted on 26 January 1950.",
      "It was drafted by the British Parliament.",
      "It is the shortest constitution in the world.",
      "It came into force in 1947.",
    ],
  },
  {
    question: "Who was the first President of India?",
    options: [
      "Dr. Rajendra Prasad",
      "Jawaharlal Nehru",
      "Dr. S. Radhakrishnan",
      "Zakir Hussain",
    ],
  },
  {
    question: "Which Schedule of the Constitution deals with the anti-defection law?",
    options: ["9th Schedule", "10th Schedule", "11th Schedule", "12th Schedule"],
  },
  {
    question: "The concept of 'Directive Principles of State Policy' was borrowed from which country's constitution?",
    options: ["USA", "UK", "Ireland", "Canada"],
  },
  {
    question: "Who is known as the chief architect of the Indian Constitution?",
    options: ["Mahatma Gandhi", "Dr. B.R. Ambedkar", "Jawaharlal Nehru", "Sardar Patel"],
  },
  {
    question: "How many Fundamental Duties are listed in the Constitution?",
    options: ["9", "10", "11", "12"],
  },
  {
    question: "Which Part of the Constitution deals with Fundamental Rights?",
    options: ["Part II", "Part III", "Part IV", "Part V"],
  },
  {
    question: "The minimum age to become a member of the Lok Sabha is?",
    options: ["21 years", "25 years", "30 years", "35 years"],
  },
  {
    question: "Which Article of the Constitution abolishes untouchability?",
    options: ["Article 15", "Article 16", "Article 17", "Article 18"],
  },
  {
    question: "The Preamble of the Constitution was amended by which Amendment Act?",
    options: ["42nd Amendment", "44th Amendment", "52nd Amendment", "61st Amendment"],
  },
];

export default function TestScreen() {
  const { categorySlug, testSlug } = useParams();
  const dispatch = useDispatch();

  // Mock-slug lookup kept for any old links; real categories/tests are
  // looked up by numeric id from the backend instead.
  const mockResult = getTest(categorySlug, testSlug);

  const realCategories = useSelector(getTestCategories);
  const realDetail = useSelector(getTestCategoryDetail);
  const realCategory = useMemo(
    () => realCategories.find((c) => String(c.id) === categorySlug),
    [realCategories, categorySlug]
  );
  const isReal = !mockResult && !!realCategory;
  const realDetailMatches = realDetail && String(realDetail.id) === categorySlug;
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

  useEffect(() => {
    dispatch(fetchTestCategories());
  }, [dispatch]);

  useEffect(() => {
    if (!loggedIn || !categorySlug) return;
    if (isReal) {
      dispatch(fetchTestCategoryDetail(categorySlug));
    } else {
      dispatch(fetchAccessStatus(categorySlug));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorySlug, loggedIn, isReal]);

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

  const question = MOCK_QUESTIONS[currentQuestion];
  const selected = answers[currentQuestion] || "";
  const isFirst = currentQuestion === 0;
  const isLast = currentQuestion === MOCK_QUESTIONS.length - 1;
  const isMarked = Boolean(marked[currentQuestion]);

  const goPrevious = () => setCurrentQuestion((c) => Math.max(0, c - 1));
  const goNext = () => setCurrentQuestion((c) => Math.min(MOCK_QUESTIONS.length - 1, c + 1));
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
          duration={7200}
          onTimeUp={() => alert("Time Up! Test Submitted")}
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
            QUESTION {currentQuestion + 1} OF {MOCK_QUESTIONS.length}
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
            totalQuestions={MOCK_QUESTIONS.length}
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
        notAnswered={MOCK_QUESTIONS.length - answeredCount}
        review={reviewCount}
        onSubmit={() => {
          alert("Test Submitted Successfully");
          onClose();
        }}
      />
    </Box>
  );
}

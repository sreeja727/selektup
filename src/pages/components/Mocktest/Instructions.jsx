import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  HStack,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  FaArrowLeft,
  FaPlayCircle,
  FaClipboardList,
  FaClock,
  FaStar,
  FaBullseye,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa";
import { getTest } from "../../../data/testSeries";
import { isLoggedIn } from "../../../utils/auth";
import { getAttemptRecord, hasAttemptedTest } from "../../../utils/mockTestAttempts";
import { fetchAccessStatus, fetchTestCategories, fetchTestCategoryDetail, fetchTestDetail } from "../../actions";
import {
  getRawStatusForCategory, getStatusLoading,
  getTestCategories, getTestCategoryDetail, getTestCategoryDetailLoading,
  getTestDetail, getTestDetailLoading,
} from "../../selectors";
import { ACCESS_STATUS } from "../../constants";
import { actions } from "../../slice";
import Loader from "../../../components/Loader";
import AlreadyAttempted from "./AlreadyAttempted";

const CATEGORY_COLOR = "#E91E8C";

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

function InfoTile({ tile }) {
  return (
    <Stack gap={2} align="center" textAlign="center" bg="gray.50" borderRadius="xl" p={5}>
      <Box color={tile.color}>
        <tile.Icon size={18} />
      </Box>
      <Text fontSize="lg" fontWeight={800} color="#0C1222">{tile.value}</Text>
      <Text fontSize="xs" color="gray.500" fontWeight={600} textTransform="uppercase" letterSpacing="0.06em">
        {tile.label}
      </Text>
    </Stack>
  );
}

export default function Instructions() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { categorySlug, testSlug } = useParams();
  const loggedIn = isLoggedIn();

  // Mock-slug lookup (e.g. "degree-mains"/"test-1") kept for any old links;
  // real categories/tests are looked up by numeric id from the backend instead.
  const mockResult = getTest(categorySlug, testSlug);

  const realCategories = useSelector(getTestCategories);
  const realDetail = useSelector(getTestCategoryDetail);
  const realDetailLoading = useSelector(getTestCategoryDetailLoading);
  const realTestDetail = useSelector(getTestDetail);
  const realTestDetailLoading = useSelector(getTestDetailLoading);
  const mockStatus = useSelector(getRawStatusForCategory(categorySlug));
  const mockStatusLoading = useSelector(getStatusLoading);

  const realCategory = useMemo(
    () => realCategories.find((c) => String(c.id) === categorySlug),
    [realCategories, categorySlug]
  );
  const isReal = !mockResult && !!realCategory;

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

  const realDetailMatches = realDetail && String(realDetail.id) === categorySlug;
  const realTest = realDetailMatches ? realDetail.tests?.find((t) => String(t.id) === testSlug) : null;
  const result = mockResult || (isReal && realTest ? { category: realCategory, test: realTest } : null);

  const realTestDetailMatches = realTestDetail && String(realTestDetail.id) === testSlug;

  // undefined = haven't checked this category yet; distinct from a resolved
  // NOT_REQUESTED, so we don't flash-redirect before the fetch completes.
  const status = isReal ? (realDetailMatches ? realDetail.accessStatus : undefined) : mockStatus;
  const statusLoading = isReal
    ? (realDetailLoading && !realDetailMatches) || (realTestDetailLoading && !realTestDetailMatches)
    : mockStatusLoading;

  if (!result) return <Navigate to="/test-series" replace />;

  if (!loggedIn) {
    return <Navigate to={`/login?redirect=/test-series/${categorySlug}/${testSlug}`} replace />;
  }

  if (status === undefined || statusLoading) {
    return <Loader fullScreen />;
  }

  if (status !== ACCESS_STATUS.APPROVED) {
    return <Navigate to={`/test-series/${categorySlug}`} replace />;
  }

  const { category, test } = result;
  const color = category.color || CATEGORY_COLOR;

  // `test.attempted` (MockTestSummaryDto, confirmed via OpenAPI) is the
  // backend's own authoritative record — known the moment the category
  // detail loads, and correct even on a device/browser that never made the
  // attempt itself. hasAttemptedTest() is a same-browser fallback for the
  // legacy mock-test path, which has no such backend field.
  if (test.attempted || hasAttemptedTest(categorySlug, testSlug)) {
    return (
      <AlreadyAttempted
        categoryTitle={category.title}
        testTitle={test.title}
        color={color}
        onBack={() => navigate(`/test-series/${categorySlug}`)}
        onReview={() => {
          const record = getAttemptRecord(categorySlug, testSlug);
          if (record?.submissionId) {
            navigate(`/review/${record.submissionId}`);
          } else if (record?.snapshot) {
            dispatch(actions.setTestAttempt(record.snapshot));
            navigate("/review");
          } else {
            navigate("/test-series");
          }
        }}
      />
    );
  }

  // Falls back to placeholder values whenever the backend test-detail
  // response leaves a field null (seen on tests where duration/marks/cutoff
  // haven't been configured yet) so the screen never shows a literal "null".
  const questionCount = isReal
    ? (realTestDetailMatches ? (realTestDetail.totalQuestions ?? test.questionCount ?? 100) : (test.questionCount ?? 0))
    : (test.questions ?? 0);
  const duration = isReal && realTestDetailMatches ? (realTestDetail.durationMinutes ?? 75) : (test.duration ?? 120);
  const marks = isReal && realTestDetailMatches ? (realTestDetail.totalMarks ?? questionCount) : (test.marks ?? questionCount);
  const cutOffMarks = isReal && realTestDetailMatches ? (realTestDetail.cutOffMarks ?? 35) : 35;

  const instructions = [
    "Read every question carefully before answering.",
    `The test contains ${questionCount} multiple-choice questions.`,
    `Duration of the test is ${formatDuration(duration)}.`,
    "Each question has only one correct answer.",
    "Each correct answer awards 1 mark.",
    "Each incorrect answer results in a penalty deduction of 0.33 marks (1/3rd mark).",
    "No marks are deducted for unattempted questions.",
    "Do not refresh or close the browser during the exam.",
    "The test will be submitted automatically when the timer ends.",
    "You can navigate between questions anytime.",
    "Click 'Submit Test' once you have completed the exam.",
  ];

  return (
    <Box bg="#F8F9FA" minH="100vh" py={{ base: 10, md: 14 }}>
      <Container maxW="4xl">
        <Stack gap={6}>
          <HStack
            as="button"
            onClick={() => navigate(`/test-series/${categorySlug}`)}
            gap={2}
            color="gray.500"
            fontSize="sm"
            fontWeight={600}
            _hover={{ color }}
            w="fit-content"
          >
            <FaArrowLeft size={12} />
            <Text>{category.title}</Text>
          </HStack>

          <Box
            bg="white"
            borderRadius="2xl"
            border="1px solid"
            borderColor="gray.100"
            boxShadow="0 2px 14px rgba(0,0,0,0.06)"
            p={{ base: 6, md: 10 }}
          >
            <Text fontSize="xs" fontWeight={700} color={color} textTransform="uppercase" letterSpacing="0.08em" mb={2}>
              {category.title}
            </Text>
            <Heading fontSize={{ base: 'xl', md: '2xl' }} fontWeight={900} color="#0C1222" mb={2}>
              {test.title}
            </Heading>
            <Text color="gray.500" mb={8}>
              Please read the instructions carefully before starting the exam.
            </Text>

            <SimpleGrid columns={{ base: 2, md: 4 }} gap={4} mb={8}>
              <InfoTile tile={{ Icon: FaClipboardList, label: "Questions", value: questionCount, color }} />
              <InfoTile tile={{ Icon: FaClock, label: "Duration", value: formatDuration(duration), color }} />
              <InfoTile tile={{ Icon: FaStar, label: "Total Marks", value: marks, color }} />
              <InfoTile tile={{ Icon: FaBullseye, label: "Cut Off", value: `${cutOffMarks} Marks`, color }} />
            </SimpleGrid>

            <HStack
              bg="rgba(211,47,47,0.06)"
              border="1px solid"
              borderColor="rgba(211,47,47,0.25)"
              borderRadius="lg"
              p={4}
              gap={3}
              align="flex-start"
              mb={8}
            >
              <Box color="#D32F2F" mt={0.5}>
                <FaExclamationTriangle size={16} />
              </Box>
              <Stack gap={1}>
                <Text fontWeight={700} color="#B71C1C" fontSize="sm">
                  Negative Marking
                </Text>
                <Text fontSize="sm" color="#7A2020">
                  Each correct answer awards <b>1 mark</b>, while each incorrect response results in a penalty
                  deduction of <b>0.33 marks (1/3rd mark)</b>. No marks are deducted for unattempted questions.
                </Text>
              </Stack>
            </HStack>

            <Heading size="md" color="#0C1222" mb={4}>
              Instructions
            </Heading>

            <Stack align="stretch" gap={3} mb={2}>
              {instructions.map((item, index) => (
                <HStack key={index} align="flex-start" gap={3}>
                  <Box color={color} mt={0.5} flexShrink={0}>
                    <FaCheckCircle size={14} />
                  </Box>
                  <Text color="gray.700" fontSize="sm">{item}</Text>
                </HStack>
              ))}
            </Stack>

            <Stack
              direction={{ base: "column-reverse", sm: "row" }}
              justify="space-between"
              mt={{ base: 8, md: 10 }}
              gap={4}
            >
              <Button
                variant="outline"
                borderRadius="lg"
                onClick={() => navigate(`/test-series/${categorySlug}`)}
                w={{ base: "100%", sm: "auto" }}
              >
                <FaArrowLeft size={12} />
                Back
              </Button>

              <Button
                size="lg"
                bg={color}
                color="white"
                fontWeight={700}
                borderRadius="lg"
                _hover={{ opacity: 0.9, transform: 'translateY(-2px)' }}
                transition="all 0.2s"
                onClick={() => navigate(`/mock-test/${categorySlug}/${testSlug}`)}
                w={{ base: "100%", sm: "auto" }}
              >
                <FaPlayCircle />
                Start Exam
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

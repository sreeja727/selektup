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
import { fetchAccessStatus, fetchTestCategories, fetchTestCategoryDetail } from "../../actions";
import {
  getRawStatusForCategory, getStatusLoading,
  getTestCategories, getTestCategoryDetail, getTestCategoryDetailLoading,
} from "../../selectors";
import { ACCESS_STATUS } from "../../constants";
import Loader from "../../../components/Loader";

const CATEGORY_COLOR = "#E91E8C";

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
    } else {
      dispatch(fetchAccessStatus(categorySlug));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorySlug, loggedIn, isReal]);

  const realDetailMatches = realDetail && String(realDetail.id) === categorySlug;
  const realTest = realDetailMatches ? realDetail.tests?.find((t) => String(t.id) === testSlug) : null;
  const result = mockResult || (isReal && realTest ? { category: realCategory, test: realTest } : null);

  // undefined = haven't checked this category yet; distinct from a resolved
  // NOT_REQUESTED, so we don't flash-redirect before the fetch completes.
  const status = isReal ? (realDetailMatches ? realDetail.accessStatus : undefined) : mockStatus;
  const statusLoading = isReal ? (realDetailLoading && !realDetailMatches) : mockStatusLoading;

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
  const questionCount = test.questions ?? test.questionCount ?? 0;
  const duration = test.duration ?? 120;
  const marks = test.marks ?? questionCount;

  const instructions = [
    "Read every question carefully before answering.",
    `The test contains ${questionCount} multiple-choice questions.`,
    `Duration of the test is ${duration} minutes.`,
    "Each question has only one correct answer.",
    "Every 3 wrong answers will reduce 2 marks.",
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
              <InfoTile tile={{ Icon: FaClock, label: "Duration", value: `${duration} min`, color }} />
              <InfoTile tile={{ Icon: FaStar, label: "Total Marks", value: marks, color }} />
              <InfoTile tile={{ Icon: FaBullseye, label: "Cut Off", value: "35 Marks", color }} />
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
                  Every <b>3 wrong answers</b> will reduce <b>2 marks</b>.
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

            <HStack justify="space-between" mt={10} gap={4}>
              <Button
                variant="outline"
                borderRadius="lg"
                onClick={() => navigate(`/test-series/${categorySlug}`)}
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
              >
                <FaPlayCircle />
                Start Exam
              </Button>
            </HStack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

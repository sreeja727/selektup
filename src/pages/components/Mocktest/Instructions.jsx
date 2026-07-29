import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { getTest } from "../../../data/testSeries";
import { isLoggedIn } from "../../../utils/auth";
import { fetchAccessStatus } from "../../actions";
import { getRawStatusForCategory, getStatusLoading } from "../../selectors";
import { ACCESS_STATUS } from "../../constants";
import Loader from "../../../components/Loader";

export default function Instructions() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { categorySlug, testSlug } = useParams();
  const result = getTest(categorySlug, testSlug);

  const loggedIn = isLoggedIn();
  // undefined = haven't checked this category yet; distinct from a resolved
  // NOT_REQUESTED, so we don't flash-redirect before the fetch completes.
  const status = useSelector(getRawStatusForCategory(categorySlug));
  const statusLoading = useSelector(getStatusLoading);

  useEffect(() => {
    if (loggedIn && categorySlug) {
      dispatch(fetchAccessStatus(categorySlug));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorySlug, loggedIn]);

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

  const instructions = [
    "Read every question carefully before answering.",
    `The test contains ${test.questions} multiple-choice questions.`,
    `Duration of the test is ${test.duration} minutes.`,
    "Each question has only one correct answer.",
    "Every 3 wrong answers will reduce 2 marks.",
    "Do not refresh or close the browser during the exam.",
    "The test will be submitted automatically when the timer ends.",
    "You can navigate between questions anytime.",
    "Click 'Submit Test' once you have completed the exam.",
  ];

  return (
    <Box bg="gray.100" minH="100vh" py={10}>
      <Box
        maxW="900px"
        mx="auto"
        bg="white"
        borderRadius="lg"
        boxShadow="lg"
        p={8}
      >
        <Text fontSize="xs" fontWeight={700} color={category.color} textTransform="uppercase" letterSpacing="0.08em" mb={1}>
          {category.title}
        </Text>
        <Heading color="blue.600" mb={2}>
          {test.title}
        </Heading>

        <Text color="gray.600" mb={8}>
          Please read the instructions carefully before starting the exam.
        </Text>

        <Flex
          wrap="wrap"
          justify="space-between"
          bg="gray.50"
          p={5}
          borderRadius="md"
          mb={8}
        >
          <Box mb={3}>
            <Text fontWeight="bold">Total Questions</Text>
            <Text>{test.questions}</Text>
          </Box>

          <Box mb={3}>
            <Text fontWeight="bold">Duration</Text>
            <Text>{test.duration} Minutes</Text>
          </Box>

          <Box mb={3}>
            <Text fontWeight="bold">Total Marks</Text>
            <Text>{test.marks}</Text>
          </Box>

          <Box mb={3}>
            <Text fontWeight="bold">Cut Off</Text>
            <Text>35 Marks</Text>
          </Box>
        </Flex>

        <Box
          bg="red.50"
          borderLeft="5px solid"
          borderColor="red.500"
          p={4}
          mb={8}
        >
          <Heading size="sm" color="red.600">
            Negative Marking
          </Heading>

          <Text mt={2}>
            Every <b>3 wrong answers</b> will reduce <b>2 marks</b>.
          </Text>
        </Box>

        <Heading size="md" mb={4}>
          Instructions
        </Heading>

        <Stack align="stretch" gap={3}>
          {instructions.map((item, index) => (
            <Text key={index}>
              {index + 1}. {item}
            </Text>
          ))}
        </Stack>

        <Flex justify="space-between" mt={10}>
          <Button
            variant="outline"
            onClick={() => navigate(`/test-series/${categorySlug}`)}
          >
            Back
          </Button>

          <Button
            colorScheme="blue"
            onClick={() => navigate(`/mock-test/${categorySlug}/${testSlug}`)}
          >
            Start Exam
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}

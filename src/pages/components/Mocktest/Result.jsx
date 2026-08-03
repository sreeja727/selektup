import {
  Box,
  Button,
  Container,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import {
  FaTrophy,
  FaSadTear,
  FaClipboardList,
  FaCheckCircle,
  FaCheck,
  FaTimes,
  FaMinusCircle,
  FaExclamationTriangle,
  FaClipboardCheck,
} from "react-icons/fa";
import { getTestAttempt } from "../../selectors";

function StatTile({ tile }) {
  return (
    <Stack gap={2} align="center" textAlign="center" bg={tile.bg} borderRadius="xl" p={5}>
      <Box color={tile.color}>
        <tile.Icon size={18} />
      </Box>
      <Heading size="lg" color="#0C1222" fontWeight={800}>{tile.value}</Heading>
      <Text fontSize="xs" color="gray.500" fontWeight={600} textTransform="uppercase" letterSpacing="0.06em">
        {tile.label}
      </Text>
    </Stack>
  );
}

export default function Result() {
  const navigate = useNavigate();
  const attempt = useSelector(getTestAttempt);

  if (!attempt) return <Navigate to="/test-series" replace />;

  const result = {
    totalQuestions: attempt.totalQuestions,
    attempted: attempt.correct + attempt.wrong,
    correct: attempt.correct,
    wrong: attempt.wrong,
    skipped: attempt.unanswered,
    negativeMarks: attempt.penalty,
    finalScore: attempt.score,
    totalMarks: attempt.totalMarks,
    cutoff: attempt.cutOffMarks,
  };

  const pass = result.finalScore >= result.cutoff;
  const scorePercent = result.totalMarks > 0 ? Math.round((result.finalScore / result.totalMarks) * 100) : 0;

  return (
    <Box bg="#F8F9FA" minH="100vh" py={{ base: 10, md: 14 }}>
      <Container maxW="4xl">
        <Box
          bg="white"
          borderRadius="2xl"
          border="1px solid"
          borderColor="gray.100"
          boxShadow="0 2px 14px rgba(0,0,0,0.06)"
          p={{ base: 6, md: 10 }}
        >
          <Stack gap={8} align="center">
            <Stack align="center" gap={3}>
              <Box
                w={16}
                h={16}
                borderRadius="full"
                bg={pass ? "green.50" : "red.50"}
                color={pass ? "green.500" : "red.500"}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {pass ? <FaTrophy size={26} /> : <FaSadTear size={26} />}
              </Box>

              <Heading color={pass ? "green.500" : "red.500"} fontWeight={900} textAlign="center">
                {pass ? "Congratulations!" : "Better Luck Next Time"}
              </Heading>

              <Text fontSize="md" color="gray.500" textAlign="center">
                Your Mock Test has been completed successfully.
              </Text>
            </Stack>

            <Box w="100%" bg="#0C1222" borderRadius="xl" p={6} textAlign="center">
              <Text fontSize="xs" color="gray.400" fontWeight={700} textTransform="uppercase" letterSpacing="0.08em" mb={2}>
                Final Score
              </Text>
              <Heading color="white" fontWeight={900} fontSize="4xl">
                {result.finalScore}
                <Text as="span" fontSize="xl" color="gray.400" fontWeight={600}> / {result.totalMarks}</Text>
              </Heading>
              <Box mt={4} bg="whiteAlpha.200" borderRadius="full" h="8px" overflow="hidden">
                <Box
                  h="100%"
                  borderRadius="full"
                  bg={pass ? "#22C55E" : "#EF5350"}
                  w={`${scorePercent}%`}
                  transition="width 0.4s ease"
                />
              </Box>
              <Text mt={2} fontSize="xs" color="gray.400">
                Cut off: {result.cutoff} marks
              </Text>
            </Box>

            <SimpleGrid columns={{ base: 2, md: 3 }} gap={4} w="100%">
              <StatTile tile={{ Icon: FaClipboardList, label: "Total Questions", value: result.totalQuestions, color: "gray.500", bg: "gray.50" }} />
              <StatTile tile={{ Icon: FaClipboardCheck, label: "Attempted", value: result.attempted, color: "#039BE5", bg: "blue.50" }} />
              <StatTile tile={{ Icon: FaCheckCircle, label: "Correct", value: result.correct, color: "green.500", bg: "green.50" }} />
              <StatTile tile={{ Icon: FaTimes, label: "Wrong", value: result.wrong, color: "red.500", bg: "red.50" }} />
              <StatTile tile={{ Icon: FaMinusCircle, label: "Skipped", value: result.skipped, color: "#B8860B", bg: "yellow.50" }} />
              <StatTile tile={{ Icon: FaExclamationTriangle, label: "Negative Marks", value: `-${result.negativeMarks}`, color: "orange.500", bg: "orange.50" }} />
            </SimpleGrid>

            <Button
              size="lg"
              bg="#039BE5"
              color="white"
              fontWeight={700}
              borderRadius="lg"
              _hover={{ bg: "#0277BD", transform: "translateY(-2px)" }}
              transition="all 0.2s"
              onClick={() => navigate("/review")}
            >
              <FaCheck size={14} />
              Review Answers
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

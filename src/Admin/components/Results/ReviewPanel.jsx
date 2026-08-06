import {
  Box, Heading, SimpleGrid, Stack, Text,
} from "@chakra-ui/react";
import { FaCheckCircle, FaTimesCircle, FaMinusCircle, FaStar, FaBullseye, FaClock } from "react-icons/fa";

function formatTimeTaken(seconds) {
  if (seconds == null) return "—";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

function StatTile({ tile }) {
  return (
    <Stack gap={2} align="center" textAlign="center" bg="gray.50" borderRadius="xl" p={5}>
      <Box color={tile.color}><tile.Icon size={18} /></Box>
      <Text fontSize="lg" fontWeight={800} color="#0C1222">{tile.value}</Text>
      <Text fontSize="xs" color="gray.500" fontWeight={600} textTransform="uppercase" letterSpacing="0.06em">
        {tile.label}
      </Text>
    </Stack>
  );
}


export default function ReviewPanel({ review }) {
  return (
    <Box bg="white" p={{ base: 4, md: 6, lg: 8 }} borderRadius="xl" boxShadow="md" borderTop="4px solid" borderColor="#E91E8C" mb={6}>
      <Box mb={6}>
        <Heading size="lg" color="#0C1222" mb={1}>{review.studentName}</Heading>
        <Text color="gray.500" fontSize="sm">{review.categoryTitle} • {review.testTitle}</Text>
        <Text color="gray.400" fontSize="xs" mt={1}>
          Submitted {review.submittedAt ? new Date(review.submittedAt).toLocaleString() : "—"}
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 2, md: 4 }} gap={4} mb={4}>
        <StatTile tile={{ Icon: FaStar, label: "Score", value: `${review.score} / ${review.totalMarks}`, color: "#E91E8C" }} />
        <StatTile tile={{ Icon: FaBullseye, label: "Accuracy", value: `${review.accuracyPercent}%`, color: "#039BE5" }} />
        <StatTile tile={{ Icon: FaClock, label: "Time Taken", value: formatTimeTaken(review.timeTakenSeconds), color: "#7C3AED" }} />
        <StatTile tile={{ Icon: FaCheckCircle, label: "Correct", value: review.correct, color: "#22C55E" }} />
      </SimpleGrid>
      <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
        <StatTile tile={{ Icon: FaTimesCircle, label: "Wrong", value: review.wrong, color: "#DC2626" }} />
        <StatTile tile={{ Icon: FaMinusCircle, label: "Unanswered", value: review.unanswered, color: "gray.400" }} />
      </SimpleGrid>
    </Box>
  );
}

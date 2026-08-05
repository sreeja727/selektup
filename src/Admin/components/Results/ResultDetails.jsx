import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Badge, Box, Flex, Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { FaCheckCircle, FaTimesCircle, FaMinusCircle, FaStar } from "react-icons/fa";
import { fetchAdminResultDetail } from "../../../pages/actions";
import { getAdminResultDetail, getAdminResultDetailLoading } from "../../../pages/selectors";
import Breadcrumb from "../common/Breadcrumb";
import BackButton from "../common/BackButton";
import Loader from "../../../components/Loader";

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

export default function ResultDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const result = useSelector(getAdminResultDetail);
  const loading = useSelector(getAdminResultDetailLoading);

  useEffect(() => {
    if (id) dispatch(fetchAdminResultDetail(id));
  }, [dispatch, id]);

  if (loading || !result) {
    if (loading) return <Loader fullScreen />;
    return (
      <Box bg="white" p={{ base: 4, md: 6, lg: 8 }} borderRadius="xl" boxShadow="md">
        <Text color="gray.500">Result not found.</Text>
        <BackButton to="/admin/results" label="Back to Results" />
      </Box>
    );
  }

  return (
    <Box>
      <Breadcrumb
        items={[
          { label: "Dashboard", to: "/admin/dashboard" },
          { label: "Results", to: "/admin/results" },
          { label: result.studentName },
        ]}
      />
      <BackButton to="/admin/results" label="Back to Results" />

      <Box bg="white" p={{ base: 4, md: 6, lg: 8 }} borderRadius="xl" boxShadow="md" maxW="900px" borderTop="4px solid" borderColor="#E91E8C">
        <Flex justify="space-between" align="flex-start" wrap="wrap" gap={4} mb={6}>
          <Box>
            <Heading size="lg" color="#0C1222" mb={1}>{result.studentName}</Heading>
            <Text color="gray.500" fontSize="sm">{result.studentEmail}</Text>
          </Box>
          {result.hasPendingManualGrading && (
            <Badge colorPalette="purple" rounded="md" px={3} py={1}>
              {result.manualGradingCount} Needs Manual Grading
            </Badge>
          )}
        </Flex>

        <Flex gap={{ base: 4, md: 8 }} wrap="wrap" mb={8}>
          <Box>
            <Text fontSize="xs" color="gray.400">Category</Text>
            <Text fontWeight={600} color="#0C1222">{result.categoryTitle}</Text>
          </Box>
          <Box>
            <Text fontSize="xs" color="gray.400">Test</Text>
            <Text fontWeight={600} color="#0C1222">{result.testTitle}</Text>
          </Box>
          <Box>
            <Text fontSize="xs" color="gray.400">Submitted</Text>
            <Text fontWeight={600} color="#0C1222">
              {result.submittedAt ? new Date(result.submittedAt).toLocaleString() : "—"}
            </Text>
          </Box>
        </Flex>

        <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
          <StatTile tile={{ Icon: FaStar, label: "Score", value: `${result.score} / ${result.totalMarks}`, color: "#E91E8C" }} />
          <StatTile tile={{ Icon: FaCheckCircle, label: "Correct", value: result.correct, color: "#22C55E" }} />
          <StatTile tile={{ Icon: FaTimesCircle, label: "Wrong", value: result.wrong, color: "#DC2626" }} />
          <StatTile tile={{ Icon: FaMinusCircle, label: "Unanswered", value: result.unanswered, color: "gray.400" }} />
        </SimpleGrid>
      </Box>
    </Box>
  );
}

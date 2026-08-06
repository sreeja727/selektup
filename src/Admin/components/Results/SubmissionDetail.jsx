import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Badge, Box, Flex, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import { fetchAdminResultDetail, fetchAdminAttemptReviewByStudentTest } from "../../../pages/actions";
import {
  getAdminResultDetail, getAdminResultDetailLoading,
  getAdminAttemptReviewByStudentTest, getAdminAttemptReviewByStudentTestLoading,
} from "../../../pages/selectors";
import Breadcrumb from "../common/Breadcrumb";
import BackButton from "../common/BackButton";
import Loader from "../../../components/Loader";
import ReviewPanel from "./ReviewPanel";

function Stat({ label, value }) {
  return (
    <Box bg="gray.50" borderRadius="xl" p={4} textAlign="center">
      <Text fontSize="lg" fontWeight={800} color="#0C1222">{value}</Text>
      <Text fontSize="xs" color="gray.500" fontWeight={600} textTransform="uppercase" letterSpacing="0.06em">
        {label}
      </Text>
    </Box>
  );
}

export default function SubmissionDetail() {
  const { submissionId } = useParams();
  const dispatch = useDispatch();
  const detail = useSelector(getAdminResultDetail);
  const detailLoading = useSelector(getAdminResultDetailLoading);
  const review = useSelector(getAdminAttemptReviewByStudentTest);
  const reviewLoading = useSelector(getAdminAttemptReviewByStudentTestLoading);

  useEffect(() => {
    if (submissionId) dispatch(fetchAdminResultDetail(submissionId));
  }, [dispatch, submissionId]);

  if (detailLoading) return <Loader fullScreen />;

  if (!detail) {
    return (
      <Box bg="white" p={{ base: 4, md: 6, lg: 8 }} borderRadius="xl" boxShadow="md">
        <Text color="gray.500">Submission not found.</Text>
        <BackButton label="Back" />
      </Box>
    );
  }

  const canLoadReview = detail.studentId != null && detail.testId != null;

  return (
    <Box>
      <Breadcrumb
        items={[
          { label: "Dashboard", to: "/admin/dashboard" },
          { label: "Results", to: "/admin/results" },
          { label: `Submission #${submissionId}` },
        ]}
      />
      <BackButton label="Back" />

      <Box bg="white" p={{ base: 4, md: 6, lg: 8 }} borderRadius="xl" boxShadow="md" borderTop="4px solid" borderColor="#E91E8C" mb={6}>
        <Flex justify="space-between" align="flex-start" wrap="wrap" gap={4} mb={6}>
          <Box>
            <Heading size="lg" color="#0C1222" mb={1}>{detail.studentName}</Heading>
            <Text color="gray.500" fontSize="sm">{detail.studentEmail}</Text>
            <Text color="gray.400" fontSize="xs" mt={1}>
              {detail.categoryTitle} • {detail.testTitle}
            </Text>
          </Box>
          <Box textAlign={{ base: "left", md: "right" }}>
            {detail.hasPendingManualGrading && (
              <Badge colorPalette="purple" rounded="md" px={2} mb={2}>
                {detail.manualGradingCount} pending manual grading
              </Badge>
            )}
            <Text fontSize="xs" color="gray.400">Submitted</Text>
            <Text fontWeight={600} color="#0C1222">
              {detail.submittedAt ? new Date(detail.submittedAt).toLocaleString() : "—"}
            </Text>
          </Box>
        </Flex>

        <SimpleGrid columns={{ base: 2, md: 4 }} gap={4} mb={4}>
          <Stat label="Score" value={`${detail.score} / ${detail.totalMarks}`} />
          <Stat label="Correct" value={detail.correct} />
          <Stat label="Wrong" value={detail.wrong} />
          <Stat label="Unanswered" value={detail.unanswered} />
        </SimpleGrid>
        <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
          <Stat label="Total Questions" value={detail.totalQuestions} />
          <Stat label="Correct Marks" value={detail.correctMarks} />
          <Stat label="Negative Marks" value={detail.negativeMarks} />
        </SimpleGrid>
      </Box>

      {!review && (
        <Box bg="white" p={{ base: 4, md: 6, lg: 8 }} borderRadius="xl" boxShadow="md" mb={6}>
          <Flex justify="space-between" align="center" wrap="wrap" gap={3}>
            <Text color="gray.600">
              {canLoadReview
                ? "Load the full question-by-question review for this submission."
                : "Full review unavailable — this submission is missing student/test identifiers."}
            </Text>
            <Box
              as="button"
              onClick={() => dispatch(fetchAdminAttemptReviewByStudentTest({ studentId: detail.studentId, testId: detail.testId }))}
              disabled={!canLoadReview || reviewLoading}
              bg="#039BE5"
              color="white"
              fontWeight={700}
              borderRadius="lg"
              px={5}
              py={2}
              _hover={{ bg: "#0277BD" }}
              opacity={!canLoadReview || reviewLoading ? 0.5 : 1}
              cursor={!canLoadReview || reviewLoading ? "not-allowed" : "pointer"}
            >
              {reviewLoading ? "Loading…" : "View Full Review"}
            </Box>
          </Flex>
        </Box>
      )}

      {review && <ReviewPanel review={review} />}
    </Box>
  );
}

import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, Text } from "@chakra-ui/react";
import { fetchAdminResultReview } from "../../../pages/actions";
import { getAdminResultReview, getAdminResultReviewLoading } from "../../../pages/selectors";
import Breadcrumb from "../common/Breadcrumb";
import BackButton from "../common/BackButton";
import Loader from "../../../components/Loader";
import ReviewPanel from "./ReviewPanel";

export default function ResultReview() {
  const { attemptId } = useParams();
  const dispatch = useDispatch();
  const review = useSelector(getAdminResultReview);
  const loading = useSelector(getAdminResultReviewLoading);

  useEffect(() => {
    if (attemptId) dispatch(fetchAdminResultReview(attemptId));
  }, [dispatch, attemptId]);

  if (loading || !review) {
    if (loading) return <Loader fullScreen />;
    return (
      <Box bg="white" p={{ base: 4, md: 6, lg: 8 }} borderRadius="xl" boxShadow="md">
        <Text color="gray.500">Result not found.</Text>
        <BackButton label="Back" />
      </Box>
    );
  }

  return (
    <Box>
      <Breadcrumb
        items={[
          { label: "Dashboard", to: "/admin/dashboard" },
          { label: "Results", to: "/admin/results" },
          { label: review.studentName },
          { label: review.testTitle },
        ]}
      />
      <BackButton label="Back" />

      <ReviewPanel review={review} />
    </Box>
  );
}

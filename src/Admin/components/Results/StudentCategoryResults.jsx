import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Badge, Box, Flex, Heading, Table, Text } from "@chakra-ui/react";
import { fetchAdminStudentCategoryResults } from "../../../pages/actions";
import { getAdminStudentCategoryResults, getAdminStudentCategoryResultsLoading } from "../../../pages/selectors";
import Breadcrumb from "../common/Breadcrumb";
import BackButton from "../common/BackButton";
import Loader from "../../../components/Loader";

const STATUS_STYLE = {
  COMPLETED: { colorPalette: "green", label: "Completed" },
  NOT_ATTEMPTED: { colorPalette: "gray", label: "Not Attempted" },
};

export default function StudentCategoryResults() {
  const { studentId, categoryId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const tests = useSelector(getAdminStudentCategoryResults);
  const loading = useSelector(getAdminStudentCategoryResultsLoading);


  const { studentName, studentEmail, categoryTitle } = location.state || {};

  useEffect(() => {
    if (studentId && categoryId) {
      dispatch(fetchAdminStudentCategoryResults({ studentId, categoryId }));
    }
  }, [dispatch, studentId, categoryId]);

  if (loading) return <Loader fullScreen />;

  return (
    <Box>
      <Breadcrumb
        items={[
          { label: "Dashboard", to: "/admin/dashboard" },
          { label: "Results", to: "/admin/results" },
          { label: studentName || `Student #${studentId}` },
        ]}
      />
      <BackButton to="/admin/results" label="Back to Results" />

      <Box bg="white" p={{ base: 4, md: 6, lg: 8 }} borderRadius="xl" boxShadow="md" borderTop="4px solid" borderColor="#E91E8C" mb={6}>
        <Flex justify="space-between" align="flex-start" wrap="wrap" gap={4}>
          <Box>
            <Heading size="lg" color="#0C1222" mb={1}>{studentName || `Student #${studentId}`}</Heading>
            <Text color="gray.500" fontSize="sm">{studentEmail}</Text>
          </Box>
          <Box textAlign={{ base: "left", md: "right" }}>
            <Text fontSize="xs" color="gray.400">Category</Text>
            <Text fontWeight={600} color="#0C1222">{categoryTitle || `#${categoryId}`}</Text>
          </Box>
        </Flex>
      </Box>

      <Box bg="white" rounded="xl" shadow="md" p={{ base: 4, md: 6 }}>
        <Heading size="md" color="#0C1222" mb={4}>Mock Tests</Heading>
        <Table.ScrollArea>
          <Table.Root size="sm">
            <Table.Header>
              <Table.Row bg="gray.50">
                <Table.ColumnHeader>Test Name</Table.ColumnHeader>
                <Table.ColumnHeader>Status</Table.ColumnHeader>
                <Table.ColumnHeader>Score</Table.ColumnHeader>
                <Table.ColumnHeader>Submitted</Table.ColumnHeader>
                <Table.ColumnHeader></Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {tests.map((t) => {
                const isCompleted = t.status === "COMPLETED";
                const statusInfo = STATUS_STYLE[t.status] || STATUS_STYLE.NOT_ATTEMPTED;
                return (
                  <Table.Row key={t.testId} _hover={{ bg: "gray.50" }}>
                    <Table.Cell fontWeight={600} color="#0C1222">
                      <Text fontSize="sm">{t.testTitle}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge colorPalette={statusInfo.colorPalette} rounded="md" px={2}>{statusInfo.label}</Badge>
                    </Table.Cell>
                    <Table.Cell color="gray.600">
                      {isCompleted ? `${t.score} / ${t.totalMarks}` : "—"}
                    </Table.Cell>
                    <Table.Cell color="gray.600">
                      {t.submittedAt ? new Date(t.submittedAt).toLocaleString() : "—"}
                    </Table.Cell>
                    <Table.Cell>
                      {isCompleted && (
                        <Box
                          as="button"
                          onClick={() => navigate(`/admin/results/attempt/${t.attemptId}/review`)}
                          color="#039BE5"
                          fontWeight={600}
                          fontSize="sm"
                          _hover={{ textDecoration: "underline" }}
                        >
                          View Review
                        </Box>
                      )}
                    </Table.Cell>
                  </Table.Row>
                );
              })}

              {tests.length === 0 && (
                <Table.Row>
                  <Table.Cell colSpan={5}>
                    <Text textAlign="center" color="gray.400" py={8}>
                      No mock tests found in this category.
                    </Text>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      </Box>
    </Box>
  );
}

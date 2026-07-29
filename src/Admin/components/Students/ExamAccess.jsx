import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Badge, Box, Button, HStack, Heading, Table, Text } from "@chakra-ui/react";
import Breadcrumb from "../common/Breadcrumb";
import Pagination from "../common/Pagination";
import { fetchAdminRequests, approveRequest, rejectRequest } from "../../../pages/actions";
import { getAdminRequests, getAdminRequestsLoading, getActionLoading } from "../../../pages/selectors";
import { ACCESS_STATUS } from "../../../pages/constants";

const PAGE_SIZE = 5;

const STATUS_COLOR = {
  [ACCESS_STATUS.APPROVED]: "green",
  [ACCESS_STATUS.PENDING]: "orange",
  [ACCESS_STATUS.REJECTED]: "red",
  [ACCESS_STATUS.NOT_REQUESTED]: "gray",
};

export default function ExamAccess() {
  const dispatch = useDispatch();
  const requests = useSelector(getAdminRequests);
  const loading = useSelector(getAdminRequestsLoading);
  const actionLoading = useSelector(getActionLoading);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAdminRequests());
  }, [dispatch]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return requests.slice(start, start + PAGE_SIZE);
  }, [requests, page]);

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Dashboard", to: "/admin/dashboard" },
          { label: "Students", to: "/admin/students/exam-access" },
          { label: "Category Access" },
        ]}
      />

      <Heading mb={1} color="#0C1222">Category Access Requests</Heading>
      <Text color="gray.500" mb={8}>Approve a student's category request before they can attend any mock test inside it</Text>

      <Box bg="white" rounded="xl" shadow="md" p={6} borderTop="4px solid" borderColor="#E91E8C">
        <Table.ScrollArea>
          <Table.Root size="sm">
            <Table.Header>
              <Table.Row bg="gray.50">
                <Table.ColumnHeader>Student</Table.ColumnHeader>
                <Table.ColumnHeader>Email</Table.ColumnHeader>
                <Table.ColumnHeader>Mobile</Table.ColumnHeader>
                <Table.ColumnHeader>Category</Table.ColumnHeader>
                <Table.ColumnHeader>Requested</Table.ColumnHeader>
                <Table.ColumnHeader>Status</Table.ColumnHeader>
                <Table.ColumnHeader></Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {paginated.map((r) => (
                <Table.Row key={r.id} _hover={{ bg: "gray.50" }}>
                  <Table.Cell fontWeight={600} color="#0C1222">
                    <Text fontSize="sm">{r.studentName}</Text>
                  </Table.Cell>
                  <Table.Cell color="gray.600">{r.studentEmail}</Table.Cell>
                  <Table.Cell color="gray.600">{r.studentMobile}</Table.Cell>
                  <Table.Cell color="gray.600">{r.categoryTitle}</Table.Cell>
                  <Table.Cell color="gray.600">
                    {new Date(r.requestedDate).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge colorPalette={STATUS_COLOR[r.status]} rounded="md" px={2}>{r.status}</Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <HStack gap={2}>
                      <Button
                        size="xs"
                        rounded="full"
                        fontWeight={700}
                        disabled={actionLoading || r.status === ACCESS_STATUS.APPROVED}
                        onClick={() => dispatch(approveRequest(r.id))}
                        bg={r.status === ACCESS_STATUS.APPROVED ? "green.500" : "gray.100"}
                        color={r.status === ACCESS_STATUS.APPROVED ? "white" : "green.700"}
                        _hover={{ bg: "green.500", color: "white" }}
                      >
                        Approve
                      </Button>
                      <Button
                        size="xs"
                        rounded="full"
                        fontWeight={700}
                        disabled={actionLoading || r.status === ACCESS_STATUS.REJECTED || r.status === ACCESS_STATUS.APPROVED}
                        onClick={() => dispatch(rejectRequest(r.id))}
                        bg={r.status === ACCESS_STATUS.REJECTED ? "red.500" : "gray.100"}
                        color={r.status === ACCESS_STATUS.REJECTED ? "white" : "red.700"}
                        _hover={{ bg: "red.500", color: "white" }}
                      >
                        Reject
                      </Button>
                    </HStack>
                  </Table.Cell>
                </Table.Row>
              ))}

              {!loading && requests.length === 0 && (
                <Table.Row>
                  <Table.Cell colSpan={7}>
                    <Text textAlign="center" color="gray.400" py={8}>
                      No access requests yet.
                    </Text>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>

        <Pagination count={requests.length} pageSize={PAGE_SIZE} page={page} onPageChange={setPage} />
      </Box>
    </>
  );
}

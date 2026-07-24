import { useMemo, useState } from "react";
import { Badge, Box, Button, Heading, Table, Text } from "@chakra-ui/react";
import { examAccessRequests, STATUS_COLOR } from "../../data/mockAdminData";
import Breadcrumb from "../common/Breadcrumb";
import Pagination from "../common/Pagination";
import { toaster } from "../../../components/ui/toaster";

const PAGE_SIZE = 5;

export default function ExamAccess() {
  const [requests, setRequests] = useState(examAccessRequests);
  const [page, setPage] = useState(1);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return requests.slice(start, start + PAGE_SIZE);
  }, [requests, page]);

  const toggleAccess = (id) => {
    const target = requests.find((r) => r.id === id);
    if (!target) return;
    const nextStatus = target.status === "Enabled" ? "Disabled" : "Enabled";

    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: nextStatus } : r))
    );

    toaster.create({
      title: nextStatus === "Enabled" ? "Access enabled" : "Access disabled",
      description: `${target.studentName}'s exam access has been ${nextStatus.toLowerCase()}.`,
      type: nextStatus === "Enabled" ? "success" : "info",
      duration: 3500,
      closable: true,
    });
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Dashboard", to: "/admin/dashboard" },
          { label: "Students", to: "/admin/students/exam-access" },
          { label: "Exam Access" },
        ]}
      />

      <Heading mb={1} color="#0C1222">Exam Access Requests</Heading>
      <Text color="gray.500" mb={8}>Enable a student before they can start the test they've requested</Text>

      <Box bg="white" rounded="xl" shadow="md" p={6} borderTop="4px solid" borderColor="#E91E8C">
        <Table.ScrollArea>
          <Table.Root size="sm">
            <Table.Header>
              <Table.Row bg="gray.50">
                <Table.ColumnHeader>Student</Table.ColumnHeader>
                <Table.ColumnHeader>Test Series</Table.ColumnHeader>
                <Table.ColumnHeader>Test</Table.ColumnHeader>
                <Table.ColumnHeader>Requested</Table.ColumnHeader>
                <Table.ColumnHeader>Status</Table.ColumnHeader>
                <Table.ColumnHeader></Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {paginated.map((r) => {
                const isActive = r.status === "Enabled";
                return (
                  <Table.Row key={r.id} _hover={{ bg: "gray.50" }}>
                    <Table.Cell fontWeight={600} color="#0C1222">
                      <Text fontSize="sm">{r.studentName}</Text>
                    </Table.Cell>
                    <Table.Cell color="gray.600">{r.testSeries}</Table.Cell>
                    <Table.Cell color="gray.600">{r.testName}</Table.Cell>
                    <Table.Cell color="gray.600">{r.requestedDate}</Table.Cell>
                    <Table.Cell>
                      <Badge colorPalette={STATUS_COLOR[r.status]} rounded="md" px={2}>{r.status}</Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        size="xs"
                        minW="76px"
                        rounded="full"
                        fontWeight={700}
                        onClick={() => toggleAccess(r.id)}
                        bg={isActive ? "green.500" : "gray.200"}
                        color={isActive ? "white" : "gray.600"}
                        _hover={{ bg: isActive ? "green.600" : "gray.300" }}
                      >
                        {isActive ? "Active" : "Inactive"}
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                );
              })}

              {requests.length === 0 && (
                <Table.Row>
                  <Table.Cell colSpan={6}>
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

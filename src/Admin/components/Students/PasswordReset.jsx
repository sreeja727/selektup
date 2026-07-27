import { useMemo, useState } from "react";
import { Badge, Box, Heading, Table, Text } from "@chakra-ui/react";
import { KeyRound } from "lucide-react";
import { passwordResetRequests, STATUS_COLOR } from "../../data/mockAdminData";
import Breadcrumb from "../common/Breadcrumb";
import Pagination from "../common/Pagination";
import ResetPasswordDialog from "./ResetPasswordDialog";
import { toaster } from "../../../components/ui/toaster";

const PAGE_SIZE = 5;

export default function PasswordReset() {
  const [pwRequests, setPwRequests] = useState(passwordResetRequests);
  const [page, setPage] = useState(1);
  const [resetTarget, setResetTarget] = useState(null);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return pwRequests.slice(start, start + PAGE_SIZE);
  }, [pwRequests, page]);

  const handleResolved = (target) => {
    if (!target?.__isPwRequest) return;
    setPwRequests((prev) =>
      prev.map((r) => (r.id === target.id ? { ...r, status: "Resolved" } : r))
    );
    toaster.create({
      title: "Password reset resolved",
      description: `${target.name}'s reset request has been marked as resolved.`,
      type: "success",
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
          { label: "Password Reset" },
        ]}
      />

      <Heading mb={1} color="#0C1222">Password Reset Requests</Heading>
      <Text color="gray.500" mb={8}>
        Students who clicked "Forgot Password" and asked support for a reset
      </Text>

      <Box bg="white" rounded="xl" shadow="md" p={6} borderTop="4px solid" borderColor="#039BE5">
        <Table.ScrollArea>
          <Table.Root size="sm">
            <Table.Header>
              <Table.Row bg="gray.50">
                <Table.ColumnHeader>Student</Table.ColumnHeader>
                <Table.ColumnHeader>Contact</Table.ColumnHeader>
                <Table.ColumnHeader>Requested</Table.ColumnHeader>
                <Table.ColumnHeader>Status</Table.ColumnHeader>
                <Table.ColumnHeader></Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {paginated.map((r) => (
                <Table.Row key={r.id} _hover={{ bg: "gray.50" }}>
                  <Table.Cell fontWeight={600} color="#0C1222">
                    <Text fontSize="sm">{r.name}</Text>
                  </Table.Cell>
                  <Table.Cell color="gray.600">{r.contact}</Table.Cell>
                  <Table.Cell color="gray.600">{r.requestedDate}</Table.Cell>
                  <Table.Cell>
                    <Badge colorPalette={STATUS_COLOR[r.status]} rounded="md" px={2}>{r.status}</Badge>
                  </Table.Cell>
                  <Table.Cell>
                    {r.status !== "Resolved" && (
                      <Box
                        as="button"
                        onClick={() => setResetTarget({ id: r.id, name: r.name, __isPwRequest: true })}
                        display="flex"
                        alignItems="center"
                        gap={1}
                        color="#039BE5"
                        fontSize="sm"
                        fontWeight={600}
                        _hover={{ textDecoration: "underline" }}
                      >
                        <KeyRound size={14} />
                        Reset &amp; Send
                      </Box>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}

              {pwRequests.length === 0 && (
                <Table.Row>
                  <Table.Cell colSpan={5}>
                    <Text textAlign="center" color="gray.400" py={8}>
                      No password reset requests.
                    </Text>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>

        <Pagination count={pwRequests.length} pageSize={PAGE_SIZE} page={page} onPageChange={setPage} />
      </Box>

      <ResetPasswordDialog
        student={resetTarget}
        open={!!resetTarget}
        onClose={() => setResetTarget(null)}
        onResolved={handleResolved}
      />
    </>
  );
}

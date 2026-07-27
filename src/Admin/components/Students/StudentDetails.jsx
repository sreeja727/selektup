import { useMemo, useState } from "react";
import { Badge, Box, Flex, Heading, Input, Table, Text } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { KeyRound } from "lucide-react";
import { students, STATUS_COLOR } from "../../data/mockAdminData";
import Breadcrumb from "../common/Breadcrumb";
import Pagination from "../common/Pagination";
import ResetPasswordDialog from "./ResetPasswordDialog";

const FILTERS = ["All", "Active", "Blocked"];
const PAGE_SIZE = 5;

export default function StudentDetails() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [resetTarget, setResetTarget] = useState(null);

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchesFilter = filter === "All" || s.status === filter;
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase()) ||
        s.phone.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [search, filter]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Dashboard", to: "/admin/dashboard" },
          { label: "Students", to: "/admin/students/exam-access" },
          { label: "Student Details" },
        ]}
      />

      <Heading mb={1} color="#0C1222">Student Details</Heading>
      <Text color="gray.500" mb={8}>View registered students and manage their accounts</Text>

      <Box bg="white" rounded="xl" shadow="md" p={6}>
        <Flex
          justify="space-between"
          align={{ base: "stretch", md: "center" }}
          direction={{ base: "column", md: "row" }}
          gap={4}
          mb={6}
        >
          <Box position="relative" maxW={{ md: "320px" }} w="100%">
            <Box
              position="absolute"
              left={3}
              top="50%"
              transform="translateY(-50%)"
              color="gray.400"
              pointerEvents="none"
            >
              <FaSearch size={13} />
            </Box>
            <Input
              pl="34px"
              placeholder="Search by name, email or phone"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              borderColor="gray.200"
              borderWidth="2px"
              rounded="lg"
              _focus={{ borderColor: "#039BE5", boxShadow: "0 0 0 3px rgba(3,155,229,0.12)" }}
            />
          </Box>

          <Flex gap={2} wrap="wrap">
            {FILTERS.map((f) => (
              <Box
                key={f}
                as="button"
                onClick={() => {
                  setFilter(f);
                  setPage(1);
                }}
                px={4}
                py={2}
                rounded="lg"
                fontSize="sm"
                fontWeight={600}
                bg={filter === f ? "#039BE5" : "gray.100"}
                color={filter === f ? "white" : "gray.600"}
                _hover={{ bg: filter === f ? "#0277BD" : "gray.200" }}
                transition="all 0.15s"
              >
                {f}
              </Box>
            ))}
          </Flex>
        </Flex>

        <Table.ScrollArea>
          <Table.Root size="sm">
            <Table.Header>
              <Table.Row bg="gray.50">
                <Table.ColumnHeader>Student</Table.ColumnHeader>
                <Table.ColumnHeader>Phone</Table.ColumnHeader>
                <Table.ColumnHeader>Last Login</Table.ColumnHeader>
                <Table.ColumnHeader>Joined</Table.ColumnHeader>
                <Table.ColumnHeader>Status</Table.ColumnHeader>
                <Table.ColumnHeader></Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {paginated.map((s) => (
                <Table.Row key={s.id} _hover={{ bg: "gray.50" }}>
                  <Table.Cell fontWeight={600} color="#0C1222">
                    <Text fontSize="sm">{s.name}</Text>
                  </Table.Cell>
                  <Table.Cell color="gray.600">{s.phone}</Table.Cell>
                  <Table.Cell color="gray.600">{s.lastLogin}</Table.Cell>
                  <Table.Cell color="gray.600">{s.joined}</Table.Cell>
                  <Table.Cell>
                    <Badge colorPalette={STATUS_COLOR[s.status]} rounded="md" px={2}>{s.status}</Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Box
                      as="button"
                      onClick={() => setResetTarget(s)}
                      display="flex"
                      alignItems="center"
                      gap={1}
                      color="gray.500"
                      fontSize="sm"
                      fontWeight={600}
                      _hover={{ color: "#039BE5" }}
                    >
                      <KeyRound size={14} />
                      Reset Password
                    </Box>
                  </Table.Cell>
                </Table.Row>
              ))}

              {filtered.length === 0 && (
                <Table.Row>
                  <Table.Cell colSpan={6}>
                    <Text textAlign="center" color="gray.400" py={8}>
                      No students found.
                    </Text>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>

        <Pagination count={filtered.length} pageSize={PAGE_SIZE} page={page} onPageChange={setPage} />
      </Box>

      <ResetPasswordDialog
        student={resetTarget}
        open={!!resetTarget}
        onClose={() => setResetTarget(null)}
        onResolved={() => {}}
      />
    </>
  );
}

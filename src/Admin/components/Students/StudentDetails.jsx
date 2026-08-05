import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Badge, Box, Button, Flex, Heading, Input, Table, Text } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { STATUS_COLOR } from "../../data/mockAdminData";
import Breadcrumb from "../common/Breadcrumb";
import Pagination from "../common/Pagination";
import { blockStudent, fetchAdminStudents, unblockStudent } from "../../../pages/actions";
import { getActionLoading, getAdminStudents, getAdminStudentsLoading } from "../../../pages/selectors";

const FILTERS = ["All", "Active", "Blocked"];
const PAGE_SIZE = 5;

export default function StudentDetails() {
  const dispatch = useDispatch();
  const adminStudents = useSelector(getAdminStudents);
  const studentsLoading = useSelector(getAdminStudentsLoading);
  const actionLoading = useSelector(getActionLoading);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAdminStudents());
  }, [dispatch]);

  const students = useMemo(() => adminStudents.map((s) => ({
    id: s.id,
    name: s.fullName,
    email: s.email,
    phone: s.mobile,
    lastLogin: s.lastLoginAt,
    joined: s.joined,
    status: s.blocked ? "Blocked" : "Active",
  })), [adminStudents]);

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchesFilter = filter === "All" || s.status === filter;
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase()) ||
        s.phone.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [students, search, filter]);

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

      <Box bg="white" rounded="xl" shadow="md" p={{ base: 4, md: 6 }}>
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
              {paginated.map((s) => {
                const isBlocked = s.status === "Blocked";
                return (
                  <Table.Row key={s.id} _hover={{ bg: "gray.50" }}>
                    <Table.Cell fontWeight={600} color="#0C1222">
                      <Text fontSize="sm">{s.name}</Text>
                    </Table.Cell>
                    <Table.Cell color="gray.600">{s.phone}</Table.Cell>
                    <Table.Cell color="gray.600">
                      {s.lastLogin ? new Date(s.lastLogin).toLocaleString() : "—"}
                    </Table.Cell>
                    <Table.Cell color="gray.600">
                      {s.joined ? new Date(s.joined).toLocaleDateString() : "—"}
                    </Table.Cell>
                    <Table.Cell>
                      <Badge colorPalette={STATUS_COLOR[s.status]} rounded="md" px={2}>{s.status}</Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        size="xs"
                        rounded="full"
                        fontWeight={700}
                        disabled={actionLoading}
                        onClick={() => dispatch(isBlocked ? unblockStudent(s.id) : blockStudent(s.id))}
                        bg={isBlocked ? "gray.100" : "red.50"}
                        color={isBlocked ? "green.700" : "red.700"}
                        _hover={{ bg: isBlocked ? "green.500" : "red.500", color: "white" }}
                      >
                        {isBlocked ? "Unblock" : "Block"}
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                );
              })}

              {!studentsLoading && filtered.length === 0 && (
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
    </>
  );
}

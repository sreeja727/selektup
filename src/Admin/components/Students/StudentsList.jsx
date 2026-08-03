import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Flex, Heading, Input, Table, Badge, Text } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import {
  examAccessRequests, STATUS_COLOR,
} from "../../data/mockAdminData";
import Breadcrumb from "../common/Breadcrumb";
import Pagination from "../common/Pagination";
import { toaster } from "../../../components/ui/toaster";
import { fetchAdminStudents } from "../../../pages/actions";
import {
  getAdminStudents, getAdminStudentsLoading, getAdminStudentsTotalPages, getAdminStudentsPageSize,
} from "../../../pages/selectors";

const FILTERS = ["All", "Active", "Blocked"];
const PAGE_SIZE = 5;
const STUDENTS_PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 400;

export default function StudentsList() {
  const dispatch = useDispatch();
  const adminStudents = useSelector(getAdminStudents);
  const studentsLoading = useSelector(getAdminStudentsLoading);
  const adminStudentsTotalPages = useSelector(getAdminStudentsTotalPages);
  const adminStudentsPageSize = useSelector(getAdminStudentsPageSize) || STUDENTS_PAGE_SIZE;
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [requests, setRequests] = useState(examAccessRequests);
  const [requestsPage, setRequestsPage] = useState(1);
  const [studentsPage, setStudentsPage] = useState(1);

  // Debounce the search box so we don't hit the backend on every keystroke.
  useEffect(() => {
    const handle = setTimeout(() => setDebouncedSearch(search), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [search]);

  useEffect(() => {
    dispatch(fetchAdminStudents({
      search: debouncedSearch,
      page: studentsPage - 1,
      size: STUDENTS_PAGE_SIZE,
    }));
  }, [dispatch, debouncedSearch, studentsPage]);

  // Normalize the backend's { id, fullName, mobile, email, lastLoginAt, joined, blocked }
  // to the name/phone/lastLogin/status shape the filter below expects.
  const students = useMemo(() => adminStudents.map((s) => ({
    id: s.id,
    name: s.fullName,
    email: s.email,
    phone: s.mobile,
    lastLogin: s.lastLoginAt,
    joined: s.joined,
    status: s.blocked ? "Blocked" : "Active",
  })), [adminStudents]);

  // Search and pagination are server-side; only the status filter is applied
  // client-side, within the current page returned by the backend.
  const filtered = useMemo(() => (
    students.filter((s) => filter === "All" || s.status === filter)
  ), [students, filter]);

  const paginatedRequests = useMemo(() => {
    const start = (requestsPage - 1) * PAGE_SIZE;
    return requests.slice(start, start + PAGE_SIZE);
  }, [requests, requestsPage]);

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
      <Breadcrumb items={[{ label: "Dashboard", to: "/admin/dashboard" }, { label: "Students" }]} />

      <Heading mb={1} color="#0C1222">Students</Heading>
      <Text color="gray.500" mb={8}>Manage exam access requests and view registered students</Text>

      <Box
        bg="white"
        rounded="xl"
        shadow="md"
        p={6}
        mb={8}
        borderTop="4px solid"
        borderColor="#E91E8C"
      >
        <Heading size="md" color="#0C1222" mb={1}>Exam Access Requests</Heading>
        <Text color="gray.500" fontSize="sm" mb={6}>
          Enable a student before they can start the test they've requested
        </Text>

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
              {paginatedRequests.map((r) => {
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

        <Pagination count={requests.length} pageSize={PAGE_SIZE} page={requestsPage} onPageChange={setRequestsPage} />
      </Box>

      <Box bg="white" rounded="xl" shadow="md" p={6}>
        <Heading size="md" color="#0C1222" mb={6}>All Students</Heading>

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
                setStudentsPage(1);
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
                  setStudentsPage(1);
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
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filtered.map((s) => (
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
                </Table.Row>
              ))}

              {!studentsLoading && filtered.length === 0 && (
                <Table.Row>
                  <Table.Cell colSpan={5}>
                    <Text textAlign="center" color="gray.400" py={8}>
                      No students found.
                    </Text>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>

        <Pagination
          count={adminStudentsTotalPages * adminStudentsPageSize}
          pageSize={adminStudentsPageSize}
          page={studentsPage}
          onPageChange={setStudentsPage}
        />
      </Box>
    </>
  );
}

import { useMemo, useState } from "react";
import { Box, Flex, Heading, Input, Table, Badge, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { enquiries, STATUS_COLOR } from "../../data/mockAdminData";
import Breadcrumb from "../common/Breadcrumb";
import Pagination from "../common/Pagination";

const FILTERS = ["All", "New", "In Progress", "Resolved"];
const PAGE_SIZE = 5;

export default function EnquiriesList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return enquiries.filter((e) => {
      const matchesFilter = filter === "All" || e.status === filter;
      const matchesSearch =
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.email.toLowerCase().includes(search.toLowerCase()) ||
        e.subject.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [search, filter]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  return (
    <>
      <Breadcrumb items={[{ label: "Dashboard", to: "/admin/dashboard" }, { label: "Enquiries" }]} />

      <Heading mb={1} color="#0C1222">Enquiries</Heading>
      <Text color="gray.500" mb={8}>Manage student enquiries and support requests</Text>

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
              placeholder="Search by name, email or subject"
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
                bg={filter === f ? "#0B1E35" : "gray.100"}
                color={filter === f ? "white" : "gray.600"}
                _hover={{ bg: filter === f ? "#0B1E35" : "gray.200" }}
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
                <Table.ColumnHeader>Name</Table.ColumnHeader>
                <Table.ColumnHeader>Subject</Table.ColumnHeader>
                <Table.ColumnHeader>Date</Table.ColumnHeader>
                <Table.ColumnHeader>Status</Table.ColumnHeader>
                <Table.ColumnHeader></Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {paginated.map((e) => (
                <Table.Row key={e.id}>
                  <Table.Cell fontWeight={600} color="#0C1222">
                    <Text fontSize="sm">{e.name}</Text>
                    <Text fontSize="xs" color="gray.400">{e.email}</Text>
                  </Table.Cell>
                  <Table.Cell color="gray.600">{e.subject}</Table.Cell>
                  <Table.Cell color="gray.600">{e.date}</Table.Cell>
                  <Table.Cell>
                    <Badge colorScheme={STATUS_COLOR[e.status]}>{e.status}</Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Box
                      as="button"
                      onClick={() => navigate(`/admin/enquiries/${e.id}`)}
                      color="#039BE5"
                      fontWeight={600}
                      fontSize="sm"
                      _hover={{ textDecoration: "underline" }}
                    >
                      View
                    </Box>
                  </Table.Cell>
                </Table.Row>
              ))}

              {filtered.length === 0 && (
                <Table.Row>
                  <Table.Cell colSpan={5}>
                    <Text textAlign="center" color="gray.400" py={8}>
                      No enquiries found.
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

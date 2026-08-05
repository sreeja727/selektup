import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Field, Flex, Heading, Input, NativeSelect, Table, Text } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { testResults } from "../../data/mockAdminData";
import Breadcrumb from "../common/Breadcrumb";
import Pagination from "../common/Pagination";

const PAGE_SIZE = 5;

const selectStyle = {
  borderColor: "gray.200",
  borderWidth: "2px",
  borderRadius: "lg",
  _focus: { borderColor: "#039BE5", boxShadow: "0 0 0 3px rgba(3,155,229,0.12)" },
};

export default function ResultsList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [test, setTest] = useState("All");
  const [page, setPage] = useState(1);

  const categories = useMemo(
    () => [...new Set(testResults.map((r) => r.category))].sort(),
    []
  );

  const tests = useMemo(() => {
    const source = category === "All" ? testResults : testResults.filter((r) => r.category === category);
    return [...new Set(source.map((r) => r.testName))].sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true })
    );
  }, [category]);

  const filtered = useMemo(() => {
    return testResults.filter((r) => {
      const matchesCategory = category === "All" || r.category === category;
      const matchesTest = test === "All" || r.testName === test;
      const matchesSearch =
        r.studentName.toLowerCase().includes(search.toLowerCase()) ||
        r.studentEmail.toLowerCase().includes(search.toLowerCase()) ||
        r.testName.toLowerCase().includes(search.toLowerCase()) ||
        r.category.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesTest && matchesSearch;
    });
  }, [search, category, test]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  return (
    <>
      <Breadcrumb items={[{ label: "Dashboard", to: "/admin/dashboard" }, { label: "Results" }]} />

      <Heading mb={1} color="#0C1222">Results</Heading>
      <Text color="gray.500" mb={8}>View mock test results submitted by students</Text>

      <Box bg="white" rounded="xl" shadow="md" p={{ base: 4, md: 6 }}>
        <Flex gap={4} wrap="wrap" align="flex-end" mb={6}>
          <Box position="relative" flex={1} minW="220px" maxW={{ md: "320px" }}>
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
              placeholder="Search by student, test or category"
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

          <Field.Root minW="200px" maxW={{ md: "240px" }}>
            <Field.Label fontSize="sm" color="gray.600">Category</Field.Label>
            <NativeSelect.Root>
              <NativeSelect.Field
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setTest("All");
                  setPage(1);
                }}
                {...selectStyle}
              >
                <option value="All">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Field.Root>

          <Field.Root minW="200px" maxW={{ md: "240px" }}>
            <Field.Label fontSize="sm" color="gray.600">Mock Test</Field.Label>
            <NativeSelect.Root>
              <NativeSelect.Field
                value={test}
                onChange={(e) => {
                  setTest(e.target.value);
                  setPage(1);
                }}
                {...selectStyle}
              >
                <option value="All">All Tests</option>
                {tests.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Field.Root>
        </Flex>

        <Table.ScrollArea>
          <Table.Root size="sm">
            <Table.Header>
              <Table.Row bg="gray.50">
                <Table.ColumnHeader>Student</Table.ColumnHeader>
                <Table.ColumnHeader>Category</Table.ColumnHeader>
                <Table.ColumnHeader>Test</Table.ColumnHeader>
                <Table.ColumnHeader>Score</Table.ColumnHeader>
                <Table.ColumnHeader>Submitted</Table.ColumnHeader>
                <Table.ColumnHeader></Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {paginated.map((r) => (
                <Table.Row key={r.id} _hover={{ bg: "gray.50" }}>
                  <Table.Cell fontWeight={600} color="#0C1222">
                    <Text fontSize="sm">{r.studentName}</Text>
                  </Table.Cell>
                  <Table.Cell color="gray.600">{r.category}</Table.Cell>
                  <Table.Cell color="gray.600">{r.testName}</Table.Cell>
                  <Table.Cell color="gray.600">{r.score} / {r.totalMarks}</Table.Cell>
                  <Table.Cell color="gray.600">{r.submittedAt}</Table.Cell>
                  <Table.Cell>
                    <Box
                      as="button"
                      onClick={() => navigate(`/admin/results/${r.id}`)}
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
                  <Table.Cell colSpan={6}>
                    <Text textAlign="center" color="gray.400" py={8}>
                      No results found.
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

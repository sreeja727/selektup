import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, Field, Flex, Heading, Input, NativeSelect, Table, Text } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import Breadcrumb from "../common/Breadcrumb";
import Pagination from "../common/Pagination";
import { fetchAdminStudentResults, fetchTestCategories } from "../../../pages/actions";
import {
  getAdminStudentResults, getAdminStudentResultsLoading, getAdminStudentResultsTotalPages,
  getAdminStudentResultsPageSize, getTestCategories,
} from "../../../pages/selectors";

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 400;

const selectStyle = {
  borderColor: "gray.200",
  borderWidth: "2px",
  borderRadius: "lg",
  _focus: { borderColor: "#039BE5", boxShadow: "0 0 0 3px rgba(3,155,229,0.12)" },
};

export default function ResultsList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const results = useSelector(getAdminStudentResults);
  const resultsLoading = useSelector(getAdminStudentResultsLoading);
  const resultsTotalPages = useSelector(getAdminStudentResultsTotalPages);
  const resultsPageSize = useSelector(getAdminStudentResultsPageSize) || PAGE_SIZE;
  const categories = useSelector(getTestCategories);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchTestCategories());
  }, [dispatch]);

  // Debounce the search box so we don't hit the backend on every keystroke.
  useEffect(() => {
    const handle = setTimeout(() => setDebouncedSearch(search), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [search]);

  useEffect(() => {
    dispatch(fetchAdminStudentResults({
      search: debouncedSearch,
      categoryId: category === "All" ? undefined : category,
      page: page - 1,
      size: PAGE_SIZE,
    }));
  }, [dispatch, debouncedSearch, category, page]);

  return (
    <>
      <Breadcrumb items={[{ label: "Dashboard", to: "/admin/dashboard" }, { label: "Results" }]} />

      <Heading mb={1} color="#0C1222">Results</Heading>
      <Text color="gray.500" mb={8}>View each student's progress across their purchased test categories</Text>

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
              placeholder="Search by student name or email"
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
                  setPage(1);
                }}
                {...selectStyle}
              >
                <option value="All">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
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
                <Table.ColumnHeader>Student Name</Table.ColumnHeader>
                <Table.ColumnHeader>Category</Table.ColumnHeader>
                <Table.ColumnHeader>Tests Completed</Table.ColumnHeader>
                <Table.ColumnHeader>Average Score</Table.ColumnHeader>
                <Table.ColumnHeader>Last Attempt Date</Table.ColumnHeader>
                <Table.ColumnHeader></Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {results.map((r) => (
                <Table.Row key={`${r.studentId}-${r.categoryId}`} _hover={{ bg: "gray.50" }}>
                  <Table.Cell fontWeight={600} color="#0C1222">
                    <Text fontSize="sm">{r.studentName}</Text>
                  </Table.Cell>
                  <Table.Cell color="gray.600">{r.categoryTitle}</Table.Cell>
                  <Table.Cell color="gray.600">{r.testsCompleted}/{r.testsTotal}</Table.Cell>
                  <Table.Cell color="gray.600">{r.averageScorePercent}%</Table.Cell>
                  <Table.Cell color="gray.600">
                    {r.lastAttemptAt ? new Date(r.lastAttemptAt).toLocaleString() : "—"}
                  </Table.Cell>
                  <Table.Cell>
                    <Box
                      as="button"
                      onClick={() => navigate(`/admin/results/student/${r.studentId}/category/${r.categoryId}`, {
                        state: { studentName: r.studentName, studentEmail: r.studentEmail, categoryTitle: r.categoryTitle },
                      })}
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

              {!resultsLoading && results.length === 0 && (
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

        <Pagination
          count={resultsTotalPages * resultsPageSize}
          pageSize={resultsPageSize}
          page={page}
          onPageChange={setPage}
        />
      </Box>
    </>
  );
}

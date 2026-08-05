import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, Field, Flex, Heading, Input, NativeSelect, Table, Text } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import Breadcrumb from "../common/Breadcrumb";
import Pagination from "../common/Pagination";
import { fetchAdminResults, fetchAdminTests, fetchTestCategories } from "../../../pages/actions";
import {
  getAdminResults, getAdminResultsLoading, getAdminResultsTotalPages, getAdminResultsPageSize,
  getTestCategories, getAdminTests,
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

  const results = useSelector(getAdminResults);
  const resultsLoading = useSelector(getAdminResultsLoading);
  const resultsTotalPages = useSelector(getAdminResultsTotalPages);
  const resultsPageSize = useSelector(getAdminResultsPageSize) || PAGE_SIZE;
  const categories = useSelector(getTestCategories);
  const adminTests = useSelector(getAdminTests);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [test, setTest] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchTestCategories());
    // Admin-scoped list — unlike fetchTestCategoryDetail, its tests[] isn't
    // gated behind the calling account's own category-access approval, so
    // it actually populates for an admin session. Fetched once; filtered
    // per-category client-side below.
    dispatch(fetchAdminTests());
  }, [dispatch]);

  // Debounce the search box so we don't hit the backend on every keystroke.
  useEffect(() => {
    const handle = setTimeout(() => setDebouncedSearch(search), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [search]);

  useEffect(() => {
    dispatch(fetchAdminResults({
      search: debouncedSearch,
      categoryId: category === "All" ? undefined : category,
      testId: test === "All" ? undefined : test,
      page: page - 1,
      size: PAGE_SIZE,
    }));
  }, [dispatch, debouncedSearch, category, test, page]);

  const testsForCategory = category === "All"
    ? []
    : adminTests.filter((t) => String(t.categoryId) === category);

  const scoreLabel = useMemo(() => (r) => (
    r.totalMarks != null ? `${r.score} / ${r.totalMarks}` : `${r.score}`
  ), []);

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
                  <option key={c.id} value={c.id}>{c.title}</option>
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
                disabled={category === "All"}
                {...selectStyle}
              >
                <option value="All">All Tests</option>
                {testsForCategory.map((t) => (
                  <option key={t.id} value={t.id}>{t.title}</option>
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
              {results.map((r) => (
                <Table.Row key={r.submissionId} _hover={{ bg: "gray.50" }}>
                  <Table.Cell fontWeight={600} color="#0C1222">
                    <Text fontSize="sm">{r.studentName}</Text>
                  </Table.Cell>
                  <Table.Cell color="gray.600">{r.categoryTitle}</Table.Cell>
                  <Table.Cell color="gray.600">{r.testTitle}</Table.Cell>
                  <Table.Cell color="gray.600">{scoreLabel(r)}</Table.Cell>
                  <Table.Cell color="gray.600">
                    {r.submittedAt ? new Date(r.submittedAt).toLocaleString() : "—"}
                  </Table.Cell>
                  <Table.Cell>
                    <Box
                      as="button"
                      onClick={() => navigate(`/admin/results/${r.submissionId}`)}
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

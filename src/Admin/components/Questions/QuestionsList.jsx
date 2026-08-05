import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box, Button, Field, Flex, Heading, HStack, Input, NativeSelect, Separator, Table, Text,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaSearch, FaPlus, FaUpload, FaDownload } from "react-icons/fa";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Breadcrumb from "../common/Breadcrumb";
import Pagination from "../common/Pagination";
import Loader from "../../../components/Loader";
import BulkUploadDialog from "./BulkUploadDialog";
import QuestionTypeBadge from "./QuestionTypeBadge";
import { fieldStyle } from "./fieldStyle";
import { SAVEABLE_QUESTION_TYPE_LIST, getTypeConfig } from "../../../pages/questionTypes";
import {
  fetchTestCategories, fetchTestCategoryDetail, fetchAdminTestQuestions, deleteQuestion, deleteAllQuestions, downloadQuestionTemplate,
} from "../../../pages/actions";
import {
  getTestCategories, getTestCategoriesLoading,
  getTestCategoryDetail, getTestCategoryDetailLoading,
  getAdminTestQuestions, getAdminTestQuestionsLoading,
  getQuestionTemplateLoading, getDeleteAllQuestionsLoading,
} from "../../../pages/selectors";

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 400;

export default function QuestionsList() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const categories = useSelector(getTestCategories);
  const categoriesLoading = useSelector(getTestCategoriesLoading);
  const categoryDetail = useSelector(getTestCategoryDetail);
  const categoryDetailLoading = useSelector(getTestCategoryDetailLoading);
  const testQuestions = useSelector(getAdminTestQuestions);
  const testQuestionsLoading = useSelector(getAdminTestQuestionsLoading);
  const templateLoading = useSelector(getQuestionTemplateLoading);
  const deleteAllLoading = useSelector(getDeleteAllQuestionsLoading);

  // Coming back from Add/Edit/Preview carries the category/test that was
  // selected there, so the list doesn't reset to the first one on return.
  const [categoryId, setCategoryId] = useState(location.state?.categoryId ? String(location.state.categoryId) : "");
  const [testId, setTestId] = useState(location.state?.testId ? String(location.state.testId) : "");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(1);
  const [bulkOpen, setBulkOpen] = useState(false);

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedSearch(search), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [search]);

  // Default to the first category once the real list loads — a render-time
  // state adjustment (React's documented alternative to an effect for this).
  if (!categoryId && categories.length > 0) {
    setCategoryId(String(categories[0].id));
  }

  useEffect(() => {
    dispatch(fetchTestCategories());
  }, [dispatch]);

  useEffect(() => {
    if (categoryId) dispatch(fetchTestCategoryDetail(categoryId));
  }, [dispatch, categoryId]);

  const categoryDetailMatches = categoryDetail && String(categoryDetail.id) === String(categoryId);
  const tests = useMemo(
    () => (categoryDetailMatches ? categoryDetail.tests || [] : []),
    [categoryDetailMatches, categoryDetail]
  );

  // Default to the first test of the selected category once it loads.
  if (tests.length > 0 && !tests.some((t) => String(t.id) === String(testId))) {
    setTestId(String(tests[0].id));
  }
  const testTitle = tests.find((t) => String(t.id) === String(testId))?.title || "this test";

  // Both search and type are applied server-side (confirmed query params on
  // GET /api/admin/tests/{testId}/questions) — testQuestions already only
  // contains matching rows, no client-side filtering needed.
  useEffect(() => {
    if (testId) dispatch(fetchAdminTestQuestions({ testId, search: debouncedSearch, type: typeFilter }));
  }, [dispatch, testId, debouncedSearch, typeFilter]);

  const handleCategoryChange = (id) => {
    setCategoryId(id);
    setTestId("");
    setPage(1);
  };

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return testQuestions.slice(start, start + PAGE_SIZE);
  }, [testQuestions, page]);

  const goToAdd = () => {
    navigate("/admin/questions/add", { state: { categoryId, testId } });
  };

  const goToEdit = (q) => {
    navigate(`/admin/questions/edit/${q.id}`, { state: { question: q, testId, categoryId, testTitle } });
  };

  const goToPreview = (q) => {
    navigate(`/admin/questions/${q.id}`, { state: { question: q, testId, categoryId, testTitle } });
  };

  const handleDelete = (q) => {
    if (window.confirm("Delete this question? This cannot be undone.")) {
      dispatch(deleteQuestion({ testId, questionId: q.id }));
    }
  };

  const handleDownloadTemplate = () => {
    dispatch(downloadQuestionTemplate(testId));
  };

  // Deletes every question currently loaded for this test (i.e. matching the
  // active search/type filter, same as the "Questions : N" count below).
  // The real bulk-delete endpoint can't be scoped to a filter — it always
  // deletes everything in the test — so it's only used when no filter is
  // active; otherwise this falls back to looping the single-question DELETE
  // (see deleteAllQuestionsSaga in saga.js).
  const isFiltered = Boolean(debouncedSearch || typeFilter);
  const handleDeleteAll = () => {
    if (testQuestions.length === 0) return;
    const filterDescription = [
      debouncedSearch ? `matching "${debouncedSearch}"` : null,
      typeFilter ? `of type "${getTypeConfig(typeFilter).label}"` : null,
    ].filter(Boolean).join(' ');
    const scope = filterDescription ? `the ${testQuestions.length} question(s) ${filterDescription}` : `all ${testQuestions.length} question(s)`;
    if (window.confirm(`Delete ${scope} from "${testTitle}"? This cannot be undone.`)) {
      dispatch(deleteAllQuestions({ testId, questionIds: testQuestions.map((q) => q.id), isFiltered }));
    }
  };

  if (categoriesLoading && categories.length === 0) {
    return <Loader fullScreen />;
  }

  return (
    <>
      <Breadcrumb items={[{ label: "Dashboard", to: "/admin/dashboard" }, { label: "Questions" }]} />

      <Heading mb={1} color="#0C1222">Questions</Heading>
      <Text color="gray.500" mb={6}>Manage questions for a specific mock test</Text>

      <Box bg="white" rounded="xl" shadow="md" p={6}>
        <HStack gap={5} align="stretch" wrap="wrap">
          <Field.Root flex={1} minW="220px">
            <Field.Label>Category</Field.Label>
            <NativeSelect.Root>
              <NativeSelect.Field
                value={categoryId}
                onChange={(e) => handleCategoryChange(e.target.value)}
                {...fieldStyle}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Field.Root>

          <Field.Root flex={1} minW="220px">
            <Field.Label>Mock Test</Field.Label>
            <NativeSelect.Root>
              <NativeSelect.Field
                value={testId}
                onChange={(e) => { setTestId(e.target.value); setPage(1); }}
                disabled={categoryDetailLoading || tests.length === 0}
                {...fieldStyle}
              >
                {tests.map((t) => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Field.Root>
        </HStack>

        <Separator my={6} />

        <Flex gap={3} wrap="wrap">
          <Button colorPalette="blue" onClick={goToAdd} disabled={!testId}>
            <FaPlus size={13} style={{ marginRight: 8 }} />
            Add Question
          </Button>
          <Button variant="outline" onClick={() => setBulkOpen(true)} disabled={!testId}>
            <FaUpload size={13} style={{ marginRight: 8 }} />
            Bulk Upload Questions
          </Button>
          <Button variant="outline" onClick={handleDownloadTemplate} disabled={!testId} loading={templateLoading}>
            <FaDownload size={13} style={{ marginRight: 8 }} />
            Download Excel Template
          </Button>
          <Button
            variant="outline"
            colorPalette="red"
            onClick={handleDeleteAll}
            disabled={!testId || testQuestions.length === 0}
            loading={deleteAllLoading}
          >
            <Trash2 size={13} style={{ marginRight: 8 }} />
            Delete All
          </Button>
        </Flex>

        <Separator my={6} />

        <Text fontWeight={700} color="#0C1222">
          Questions : {testQuestionsLoading ? "—" : testQuestions.length}
        </Text>

        <Separator my={6} />

        <Flex gap={4} wrap="wrap" align="flex-end">
          <Box position="relative" maxW={{ md: "320px" }} flex={1} minW="220px">
            <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" color="gray.400" pointerEvents="none">
              <FaSearch size={13} />
            </Box>
            <Input
              pl="34px"
              placeholder="Search question text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              {...fieldStyle}
            />
          </Box>

          <Field.Root maxW={{ md: "260px" }} minW="220px">
            <Field.Label>Question Type</Field.Label>
            <NativeSelect.Root>
              <NativeSelect.Field
                value={typeFilter}
                onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
                {...fieldStyle}
              >
                <option value="">All types</option>
                {SAVEABLE_QUESTION_TYPE_LIST.map((t) => (
                  <option key={t} value={t}>{getTypeConfig(t).label}</option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Field.Root>
        </Flex>

        <Separator my={6} />

        <Table.ScrollArea>
          <Table.Root size="sm">
            <Table.Header>
              <Table.Row bg="gray.50">
                <Table.ColumnHeader>Question</Table.ColumnHeader>
                <Table.ColumnHeader>Type</Table.ColumnHeader>
                <Table.ColumnHeader></Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {paginated.map((q) => (
                <Table.Row key={q.id} _hover={{ bg: "gray.50" }}>
                  <Table.Cell fontWeight={600} color="#0C1222" maxW="480px">
                    <Text fontSize="sm" lineClamp={2}>{q.text}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <QuestionTypeBadge type={q.type} />
                  </Table.Cell>
                  <Table.Cell>
                    <Flex gap={3}>
                      <Box as="button" onClick={() => goToPreview(q)} color="gray.500" _hover={{ color: "#039BE5" }} title="Preview">
                        <Eye size={16} />
                      </Box>
                      <Box as="button" onClick={() => goToEdit(q)} color="gray.500" _hover={{ color: "#039BE5" }} title="Edit">
                        <Pencil size={16} />
                      </Box>
                      <Box as="button" onClick={() => handleDelete(q)} color="gray.500" _hover={{ color: "red.500" }} title="Delete">
                        <Trash2 size={16} />
                      </Box>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))}

              {!testQuestionsLoading && testQuestions.length === 0 && (
                <Table.Row>
                  <Table.Cell colSpan={3}>
                    <Text textAlign="center" color="gray.400" py={8}>
                      {!testId
                        ? "Select a category and mock test to see its questions."
                        : typeFilter || debouncedSearch
                          ? "No questions match the current filters."
                          : "No questions found."}
                    </Text>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>

        <Pagination count={testQuestions.length} pageSize={PAGE_SIZE} page={page} onPageChange={setPage} />
      </Box>

      <BulkUploadDialog
        isOpen={bulkOpen}
        onClose={() => setBulkOpen(false)}
        testId={testId}
        testTitle={testTitle}
      />
    </>
  );
}

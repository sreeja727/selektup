import { useMemo, useState } from "react";
import { Box, Button, Flex, Heading, Input, Table, Badge, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaPlus } from "react-icons/fa";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useQuestions } from "../../context/QuestionsContext";
import { TEST_CATEGORIES } from "../../../data/testSeries";
import Breadcrumb from "../common/Breadcrumb";
import Pagination from "../common/Pagination";

const DIFFICULTY_COLOR = { Easy: "green", Medium: "orange", Hard: "red" };
const PAGE_SIZE = 5;

function categoryTitle(slug) {
  return TEST_CATEGORIES.find((c) => c.slug === slug)?.title || slug;
}

export default function QuestionsList() {
  const navigate = useNavigate();
  const { questions, deleteQuestion } = useQuestions();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      const matchesFilter = filter === "All" || q.categorySlug === filter;
      const matchesSearch = q.text.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [questions, search, filter]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const handleDelete = (id) => {
    if (window.confirm("Delete this question? This cannot be undone.")) {
      deleteQuestion(id);
    }
  };

  return (
    <>
      <Breadcrumb items={[{ label: "Dashboard", to: "/admin/dashboard" }, { label: "Questions" }]} />

      <Flex justify="space-between" align="center" mb={8}>
        <Box>
          <Heading mb={1} color="#0C1222">Questions</Heading>
          <Text color="gray.500">Manage questions across all test series</Text>
        </Box>
        <Button colorScheme="blue" onClick={() => navigate("/admin/questions/add")}>
          <FaPlus size={13} style={{ marginRight: 8 }} />
          Add Question
        </Button>
      </Flex>

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
              placeholder="Search question text"
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
            {["All", ...TEST_CATEGORIES.map((c) => c.slug)].map((slug) => (
              <Box
                key={slug}
                as="button"
                onClick={() => {
                  setFilter(slug);
                  setPage(1);
                }}
                px={4}
                py={2}
                rounded="lg"
                fontSize="sm"
                fontWeight={600}
                bg={filter === slug ? "#0B1E35" : "gray.100"}
                color={filter === slug ? "white" : "gray.600"}
                _hover={{ bg: filter === slug ? "#0B1E35" : "gray.200" }}
                transition="all 0.15s"
              >
                {slug === "All" ? "All" : categoryTitle(slug)}
              </Box>
            ))}
          </Flex>
        </Flex>

        <Table.ScrollArea>
          <Table.Root size="sm">
            <Table.Header>
              <Table.Row bg="gray.50">
                <Table.ColumnHeader>Question</Table.ColumnHeader>
                <Table.ColumnHeader>Category</Table.ColumnHeader>
                <Table.ColumnHeader>Mock Test</Table.ColumnHeader>
                <Table.ColumnHeader>Difficulty</Table.ColumnHeader>
                <Table.ColumnHeader></Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {paginated.map((q) => (
                <Table.Row key={q.id}>
                  <Table.Cell fontWeight={600} color="#0C1222" maxW="360px">
                    <Text fontSize="sm" lineClamp={2}>{q.text}</Text>
                  </Table.Cell>
                  <Table.Cell color="gray.600">{categoryTitle(q.categorySlug)}</Table.Cell>
                  <Table.Cell color="gray.600">Mock Test {q.mockTestNumber}</Table.Cell>
                  <Table.Cell>
                    <Badge colorScheme={DIFFICULTY_COLOR[q.difficulty]}>{q.difficulty}</Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex gap={3}>
                      <Box as="button" onClick={() => navigate(`/admin/questions/${q.id}`)} color="gray.500" _hover={{ color: "#039BE5" }}>
                        <Eye size={16} />
                      </Box>
                      <Box as="button" onClick={() => navigate(`/admin/questions/edit/${q.id}`)} color="gray.500" _hover={{ color: "#039BE5" }}>
                        <Pencil size={16} />
                      </Box>
                      <Box as="button" onClick={() => handleDelete(q.id)} color="gray.500" _hover={{ color: "red.500" }}>
                        <Trash2 size={16} />
                      </Box>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))}

              {filtered.length === 0 && (
                <Table.Row>
                  <Table.Cell colSpan={5}>
                    <Text textAlign="center" color="gray.400" py={8}>
                      No questions found.
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

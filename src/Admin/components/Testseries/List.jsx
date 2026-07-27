import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../common/Breadcrumb";
import Pagination from "../common/Pagination";
import { useTestSeries } from "../../context/TestSeriesContext";

const PAGE_SIZE = 5;

export default function TestSeriesList() {
  const navigate = useNavigate();
  const { testSeries, deleteTestSeries } = useTestSeries();
  const [page, setPage] = useState(1);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return testSeries.slice(start, start + PAGE_SIZE);
  }, [testSeries, page]);

  return (
    <Box>
      <Breadcrumb items={[{ label: "Dashboard", to: "/admin/dashboard" }, { label: "Test Series" }]} />

      <Flex justify="space-between" align="center" mb={8}>
        <Heading color="#0C1222">Test Series</Heading>

        <Button
          colorPalette="blue"
          gap={2}
          onClick={() => navigate("/admin/test-series/add")}
        >
          <Plus size={18} />
          Add Test Series
        </Button>
      </Flex>

      <VStack gap={4} align="stretch">
        {paginated.map((series) => (
          <Box
            key={series.id}
            bg="white"
            p={6}
            borderRadius="xl"
            boxShadow="md"
            border="1px solid"
            borderColor="gray.100"
            transition="box-shadow 0.2s"
            _hover={{ boxShadow: "0 10px 28px rgba(12,18,34,0.1)" }}
          >
            <Flex
              justify="space-between"
              align="center"
              direction={{ base: "column", md: "row" }}
              gap={4}
            >
              <Box>
                <Heading size="md">
                  {series.title}
                </Heading>

                <Text color="gray.500" mt={2}>
                  {series.tests} Mock Tests • {series.price}
                </Text>
              </Box>

              <HStack gap={3}>
                <Button
                  size="sm"
                  variant="outline"
                  gap={2}
                >
                  <Pencil size={16} />
                  Edit
                </Button>

                <Button
                  size="sm"
                  colorPalette="red"
                  variant="outline"
                  gap={2}
                  onClick={() => {
                    if (window.confirm(`Delete "${series.title}"? This cannot be undone.`)) {
                      deleteTestSeries(series.id);
                    }
                  }}
                >
                  <Trash2 size={16} />
                  Delete
                </Button>
              </HStack>
            </Flex>
          </Box>
        ))}
      </VStack>

      <Pagination count={testSeries.length} pageSize={PAGE_SIZE} page={page} onPageChange={setPage} />
    </Box>
  );
}
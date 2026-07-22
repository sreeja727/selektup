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

const PAGE_SIZE = 5;


const testSeries = [
  {
    id: 1,
    title: "UPSC Prelims 2027",
    price: "₹999",
    tests: 100,
  },
  {
    id: 2,
    title: "KTET Test Series",
    price: "₹699",
    tests: 50,
  },
  {
    id: 3,
    title: "PSC Mock Tests",
    price: "₹499",
    tests: 30,
  },
];
export default function TestSeriesList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return testSeries.slice(start, start + PAGE_SIZE);
  }, [page]);

  return (
    <Box>
      <Breadcrumb items={[{ label: "Dashboard", to: "/admin/dashboard" }, { label: "Test Series" }]} />

      <Flex justify="space-between" align="center" mb={8}>
        <Heading>Test Series</Heading>

       <Button
  colorScheme="blue"
  leftIcon={<Plus size={18} />}
  onClick={() =>
    navigate("/admin/test-series/add")
  }
>
  Add Test Series
</Button>
      </Flex>

      <VStack spacing={4} align="stretch">
        {paginated.map((series) => (
          <Box
            key={series.id}
            bg="white"
            p={6}
            borderRadius="xl"
            boxShadow="md"
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

              <HStack spacing={3}>
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Pencil size={16} />}
                >
                  Edit
                </Button>

                <Button
                  size="sm"
                  colorScheme="red"
                  variant="outline"
                  leftIcon={<Trash2 size={16} />}
                >
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
import { Badge, Box, Button, Flex, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { Pencil, Trash2, CheckCircle2 } from "lucide-react";
import { useQuestions } from "../../context/QuestionsContext";
import { TEST_CATEGORIES } from "../../../data/testSeries";
import Breadcrumb from "../common/Breadcrumb";
import BackButton from "../common/BackButton";

const DIFFICULTY_COLOR = { Easy: "green", Medium: "orange", Hard: "red" };

export default function QuestionsView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getQuestion, deleteQuestion } = useQuestions();
  const question = getQuestion(id);

  if (!question) {
    return (
      <Box bg="white" p={8} borderRadius="xl" boxShadow="md">
        <Text color="gray.500">Question not found.</Text>
        <BackButton to="/admin/questions" label="Back to Questions" />
      </Box>
    );
  }

  const categoryTitle = TEST_CATEGORIES.find((c) => c.slug === question.categorySlug)?.title || question.categorySlug;

  const handleDelete = () => {
    if (window.confirm("Delete this question? This cannot be undone.")) {
      deleteQuestion(id);
      navigate("/admin/questions");
    }
  };

  return (
    <Box>
      <Breadcrumb
        items={[
          { label: "Dashboard", to: "/admin/dashboard" },
          { label: "Questions", to: "/admin/questions" },
          { label: "View Question" },
        ]}
      />
      <BackButton to="/admin/questions" label="Back to Questions" />

      <Box bg="white" p={8} borderRadius="xl" boxShadow="md" maxW="800px">
        <Flex justify="space-between" align="flex-start" mb={6} gap={4} wrap="wrap">
          <Box>
            <Badge colorPalette={DIFFICULTY_COLOR[question.difficulty]} rounded="md" px={2} mb={2}>{question.difficulty}</Badge>
            <Heading size="lg" color="#0C1222">{categoryTitle}</Heading>
            <Text color="gray.500" mt={1}>Mock Test {question.mockTestNumber}</Text>
          </Box>

          <HStack gap={3}>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/admin/questions/edit/${question.id}`)}
            >
              <Pencil size={16} style={{ marginRight: 6 }} />
              Edit
            </Button>
            <Button size="sm" colorPalette="red" variant="outline" onClick={handleDelete}>
              <Trash2 size={16} style={{ marginRight: 6 }} />
              Delete
            </Button>
          </HStack>
        </Flex>

        <Box borderTop="1px solid" borderColor="gray.100" pt={5}>
          <Text fontSize="xs" color="gray.400" mb={2}>Question</Text>
          <Text color="#0C1222" fontWeight={600} whiteSpace="pre-wrap">{question.text}</Text>
        </Box>

        <VStack align="stretch" gap={2} mt={5}>
          <Text fontSize="xs" color="gray.400">Options</Text>
          {question.options.map((opt, index) => (
            <Flex
              key={index}
              align="center"
              gap={2}
              p={3}
              rounded="lg"
              bg={index === question.correctIndex ? "green.50" : "gray.50"}
              border="1px solid"
              borderColor={index === question.correctIndex ? "green.200" : "gray.100"}
            >
              {index === question.correctIndex && <CheckCircle2 size={16} color="#38A169" />}
              <Text color="#0C1222" fontWeight={index === question.correctIndex ? 600 : 400}>
                {opt}
              </Text>
            </Flex>
          ))}
        </VStack>

        {question.explanation && (
          <Box borderTop="1px solid" borderColor="gray.100" pt={5} mt={5}>
            <Text fontSize="xs" color="gray.400" mb={2}>Solution / Explanation</Text>
            <Text color="gray.700" whiteSpace="pre-wrap">{question.explanation}</Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}

import { useDispatch } from "react-redux";
import { Box, Button, Flex, Heading, HStack, Text } from "@chakra-ui/react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import Breadcrumb from "../common/Breadcrumb";
import BackButton from "../common/BackButton";
import QuestionTypeBadge from "./QuestionTypeBadge";
import QuestionAnswerView from "./QuestionAnswerView";
import { getTypeConfig } from "../../../pages/questionTypes";
import { deleteQuestion } from "../../../pages/actions";

export default function QuestionsView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Comes from QuestionsList's Preview action — this page doesn't have a
  // "fetch one question" endpoint of its own, so a direct link/refresh here
  // (without having come from the list) has nothing to show.
  const { question, testId, categoryId, testTitle } = location.state || {};

  if (!question || String(question.id) !== String(id)) {
    return (
      <Box bg="white" p={{ base: 4, md: 6, lg: 8 }} borderRadius="xl" boxShadow="md">
        <Text color="gray.500">Open this question from the Questions list to preview it.</Text>
        <BackButton to="/admin/questions" label="Back to Questions" />
      </Box>
    );
  }

  const handleDelete = () => {
    if (window.confirm("Delete this question? This cannot be undone.")) {
      dispatch(deleteQuestion({ testId, questionId: question.id }));
      navigate("/admin/questions", { state: { categoryId, testId } });
    }
  };

  const typeConfig = getTypeConfig(question.type);

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

      <Box bg="white" p={{ base: 4, md: 6, lg: 8 }} borderRadius="xl" boxShadow="md" maxW="800px">
        <Flex justify="space-between" align="flex-start" mb={6} gap={4} wrap="wrap">
          <Box>
            {testTitle && <Heading size="lg" color="#0C1222" mb={2}>{testTitle}</Heading>}
            <HStack gap={3}>
              <QuestionTypeBadge type={question.type} />
              <Text fontSize="xs" color="gray.500" fontWeight={600}>{question.marks ?? 1} mark(s)</Text>
            </HStack>
          </Box>

          <HStack gap={3}>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/admin/questions/edit/${question.id}`, { state: { question, testId, categoryId, testTitle } })}
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
          <Text fontSize="xs" color="gray.400" mb={2}>{typeConfig.hasAssertionReason ? "Assertion" : "Question"}</Text>
          <Text color="#0C1222" fontWeight={600} whiteSpace="pre-wrap">{question.text}</Text>
        </Box>

        <QuestionAnswerView question={question} />

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

import { useState } from "react";
import {
  Box,
  Button,
  Field,
  Heading,
  HStack,
  Input,
  NativeSelect,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { TEST_CATEGORIES } from "../../../data/testSeries";
import { useQuestions } from "../../context/QuestionsContext";
import Breadcrumb from "../common/Breadcrumb";
import BackButton from "../common/BackButton";
import { toaster } from "../../../components/ui/toaster";

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

const fieldStyle = {
  borderColor: "gray.200",
  borderWidth: "2px",
  borderRadius: "lg",
  _focus: { borderColor: "#039BE5", boxShadow: "0 0 0 3px rgba(3,155,229,0.12)" },
  _hover: { borderColor: "#039BE5" },
};

export default function QuestionsEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getQuestion, updateQuestion } = useQuestions();
  const question = getQuestion(id);

  const [categorySlug, setCategorySlug] = useState(question?.categorySlug || TEST_CATEGORIES[0].slug);
  const category = TEST_CATEGORIES.find((c) => c.slug === categorySlug);
  const [mockTestNumber, setMockTestNumber] = useState(question?.mockTestNumber || 1);
  const [difficulty, setDifficulty] = useState(question?.difficulty || DIFFICULTIES[0]);
  const [text, setText] = useState(question?.text || "");
  const [options, setOptions] = useState(question?.options || ["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(question?.correctIndex ?? 0);
  const [explanation, setExplanation] = useState(question?.explanation || "");

  if (!question) {
    return (
      <Box bg="white" p={8} borderRadius="xl" boxShadow="md">
        <Text color="gray.500">Question not found.</Text>
        <BackButton to="/admin/questions" label="Back to Questions" />
      </Box>
    );
  }

  const handleCategoryChange = (slug) => {
    setCategorySlug(slug);
    setMockTestNumber(1);
  };

  const updateOption = (index, value) => {
    setOptions((prev) => prev.map((opt, i) => (i === index ? value : opt)));
  };

  const handleSave = () => {
    updateQuestion(id, {
      categorySlug,
      mockTestNumber,
      difficulty,
      text,
      options,
      correctIndex,
      explanation,
    });
    toaster.create({ title: "Question updated", description: "Your changes have been saved.", type: "success", duration: 3500, closable: true });
    navigate("/admin/questions");
  };

  return (
    <Box>
      <Breadcrumb
        items={[
          { label: "Dashboard", to: "/admin/dashboard" },
          { label: "Questions", to: "/admin/questions" },
          { label: "Edit Question" },
        ]}
      />
      <BackButton to="/admin/questions" label="Back to Questions" />

      <Box bg="white" p={8} borderRadius="xl" boxShadow="md" maxW="800px">
        <Heading mb={6} color="#0C1222">Edit Question</Heading>

        <VStack gap={5} align="stretch">
          <HStack gap={5} align="stretch">
            <Field.Root flex={1}>
              <Field.Label>Category</Field.Label>
              <NativeSelect.Root>
                <NativeSelect.Field
                  value={categorySlug}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  {...fieldStyle}
                >
                  {TEST_CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.title}</option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Field.Root>

            <Field.Root flex={1}>
              <Field.Label>Mock Test Number</Field.Label>
              <NativeSelect.Root>
                <NativeSelect.Field
                  value={mockTestNumber}
                  onChange={(e) => setMockTestNumber(Number(e.target.value))}
                  {...fieldStyle}
                >
                  {category.tests.map((t, i) => (
                    <option key={t.slug} value={i + 1}>Mock Test {i + 1}</option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Field.Root>

            <Field.Root flex={1}>
              <Field.Label>Difficulty</Field.Label>
              <NativeSelect.Root>
                <NativeSelect.Field
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  {...fieldStyle}
                >
                  {DIFFICULTIES.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Field.Root>
          </HStack>

          <Field.Root>
            <Field.Label>Question</Field.Label>
            <Textarea
              placeholder="Enter the full question, including any numbered statements, assertion/reason, match-the-following pairs, etc."
              rows={10}
              value={text}
              onChange={(e) => setText(e.target.value)}
              {...fieldStyle}
            />
          </Field.Root>

          {options.map((opt, index) => (
            <Field.Root key={index}>
              <Field.Label>
                Option {index + 1}
                {correctIndex === index && (
                  <Box as="span" color="green.500" ml={2} fontSize="xs">
                    (Correct Answer)
                  </Box>
                )}
              </Field.Label>
              <HStack gap={3}>
                <Input
                  placeholder={`Option ${index + 1}`}
                  value={opt}
                  onChange={(e) => updateOption(index, e.target.value)}
                  {...fieldStyle}
                />
                <Button
                  size="sm"
                  variant={correctIndex === index ? "solid" : "outline"}
                  colorPalette="green"
                  onClick={() => setCorrectIndex(index)}
                  flexShrink={0}
                >
                  Mark Correct
                </Button>
              </HStack>
            </Field.Root>
          ))}

          <Field.Root>
            <Field.Label>Solution / Explanation</Field.Label>
            <Textarea
              placeholder="Explain why the correct answer is right (shown to students after they attempt the question). One point per line works well for statement-based questions."
              rows={6}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              {...fieldStyle}
            />
          </Field.Root>

          <Button colorPalette="blue" size="lg" onClick={handleSave}>
            Save Changes
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}

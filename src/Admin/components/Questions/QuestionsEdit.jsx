import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Field,
  Heading,
  HStack,
  Input,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../common/Breadcrumb";
import BackButton from "../common/BackButton";
import { toaster } from "../../../components/ui/toaster";
import QuestionTypeFields from "./QuestionTypeFields";
import QuestionTypeBadge from "./QuestionTypeBadge";
import { fieldStyle } from "./fieldStyle";
import {
  toFormFields, getTypeConfig, isSaveable, validate as validateQuestion,
} from "../../../pages/questionTypes";
import { updateQuestion } from "../../../pages/actions";
import { getUpdateQuestionLoading, getUpdateQuestionResult } from "../../../pages/selectors";

export default function QuestionsEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Comes from QuestionsList's Edit action — a question is edited in place
  // under the mock test it already belongs to, so there's no "fetch by id"
  // endpoint to fall back on for a direct link/refresh here.
  const { question, testId, categoryId, testTitle } = location.state || {};
  const updateLoading = useSelector(getUpdateQuestionLoading);
  const updateResult = useSelector(getUpdateQuestionResult);

  const type = question?.type || "SINGLE_CORRECT_MCQ";
  const typeConfig = getTypeConfig(type);
  const [fields, setFields] = useState(() => (question ? toFormFields(question) : null));
  const [fieldErrors, setFieldErrors] = useState({});

  // Once the save succeeds, head back to the list for this test.
  useEffect(() => {
    if (updateResult) {
      navigate("/admin/questions", { state: { categoryId, testId } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateResult]);

  if (!question || String(question.id) !== String(id) || !fields) {
    return (
      <Box bg="white" p={8} borderRadius="xl" boxShadow="md">
        <Text color="gray.500">Open this question from the Questions list to edit it.</Text>
        <BackButton to="/admin/questions" label="Back to Questions" />
      </Box>
    );
  }

  const clearError = (key) => {
    setFieldErrors((f) => ({ ...f, [key]: undefined }));
  };

  const handleSave = () => {
    if (!isSaveable(type)) {
      toaster.create({ title: "Not available yet", description: `"${typeConfig.label}" isn't supported by the backend yet — it can't be saved until that's added.`, type: "error", duration: 4000, closable: true });
      return;
    }
    const errors = validateQuestion(type, fields);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      toaster.create({ title: "Missing information", description: "Please fill in all required fields before saving.", type: "error", duration: 3500, closable: true });
      return;
    }
    setFieldErrors({});
    dispatch(updateQuestion({
      testId,
      questionId: question.id,
      question: { type, ...fields },
    }));
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
        <HStack justify="space-between" align="center" mb={6}>
          <Heading color="#0C1222">Edit Question</Heading>
          <HStack gap={3}>
            {testTitle && <Text color="gray.500" fontWeight={600}>{testTitle}</Text>}
            <QuestionTypeBadge type={type} />
          </HStack>
        </HStack>

        <VStack gap={5} align="stretch">
          <Field.Root maxW="160px">
            <Field.Label>Marks</Field.Label>
            <Input
              type="number"
              min={1}
              value={fields.marks}
              onChange={(e) => {
                setFields((prev) => ({ ...prev, marks: Number(e.target.value) }));
                clearError("marks");
              }}
              {...fieldStyle}
              borderColor={fieldErrors.marks ? "red.400" : fieldStyle.borderColor}
            />
            {fieldErrors.marks && <Text color="red.500" fontSize="xs" mt={1}>{fieldErrors.marks}</Text>}
          </Field.Root>

          <Field.Root>
            <Field.Label>{typeConfig.hasAssertionReason ? "Assertion" : "Question"}</Field.Label>
            <Textarea
              placeholder={typeConfig.hasAssertionReason ? "State the assertion" : "Enter the full question text"}
              rows={6}
              value={fields.text}
              onChange={(e) => {
                setFields((prev) => ({ ...prev, text: e.target.value }));
                clearError("text");
              }}
              {...fieldStyle}
              borderColor={fieldErrors.text ? "red.400" : fieldStyle.borderColor}
            />
            {fieldErrors.text && <Text color="red.500" fontSize="xs" mt={1}>{fieldErrors.text}</Text>}
          </Field.Root>

          <QuestionTypeFields
            type={type}
            fields={fields}
            setFields={setFields}
            errors={fieldErrors}
            clearError={clearError}
          />

          <Field.Root>
            <Field.Label>Solution / Explanation</Field.Label>
            <Textarea
              placeholder="Explain why the correct answer is right (shown to students after they attempt the question)."
              rows={6}
              value={fields.explanation}
              onChange={(e) => {
                setFields((prev) => ({ ...prev, explanation: e.target.value }));
                clearError("explanation");
              }}
              {...fieldStyle}
              borderColor={fieldErrors.explanation ? "red.400" : fieldStyle.borderColor}
            />
            {fieldErrors.explanation && <Text color="red.500" fontSize="xs" mt={1}>{fieldErrors.explanation}</Text>}
          </Field.Root>

          <Button colorPalette="blue" size="lg" onClick={handleSave} loading={updateLoading} disabled={typeConfig.comingSoon}>
            Save Changes
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}

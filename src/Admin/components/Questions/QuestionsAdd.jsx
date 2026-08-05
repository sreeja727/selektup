import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {Box,Button,Field,Heading,HStack,Input,NativeSelect,Stack,Text,Textarea,VStack,} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumb from "../common/Breadcrumb";
import BackButton from "../common/BackButton";
import Loader from "../../../components/Loader";
import { toaster } from "../../../components/ui/toaster";
import QuestionTypeFields from "./QuestionTypeFields";
import { fieldStyle } from "./fieldStyle";
import {
  QUESTION_TYPE_LIST, getTypeConfig, emptyFields, isSaveable, validate as validateQuestion,
} from "../../../pages/questionTypes";
import {
  fetchTestCategories, fetchTestCategoryDetail, fetchAdminTestQuestions, addQuestion,
} from "../../../pages/actions";
import {
  getTestCategories, getTestCategoriesLoading,
  getTestCategoryDetail, getTestCategoryDetailLoading,
  getAdminTestQuestions, getAdminTestQuestionsLoading,
  getAddQuestionLoading, getAddQuestionResult,
} from "../../../pages/selectors";

export default function QuestionsAdd() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const categories = useSelector(getTestCategories);
  const categoriesLoading = useSelector(getTestCategoriesLoading);
  const categoryDetail = useSelector(getTestCategoryDetail);
  const categoryDetailLoading = useSelector(getTestCategoryDetailLoading);
  const testQuestions = useSelector(getAdminTestQuestions);
  const testQuestionsLoading = useSelector(getAdminTestQuestionsLoading);
  const addQuestionLoading = useSelector(getAddQuestionLoading);
  const addQuestionResult = useSelector(getAddQuestionResult);


  const [categoryId, setCategoryId] = useState(location.state?.categoryId ? String(location.state.categoryId) : "");
  const [testId, setTestId] = useState(location.state?.testId ? String(location.state.testId) : "");
  const [type, setType] = useState(QUESTION_TYPE_LIST[0]);
  const [fields, setFields] = useState(() => emptyFields(QUESTION_TYPE_LIST[0]));
  const [fieldErrors, setFieldErrors] = useState({});
 
  const [handledResult, setHandledResult] = useState(null);
  const typeConfig = getTypeConfig(type);

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

  if (tests.length > 0 && !tests.some((t) => String(t.id) === String(testId))) {
    setTestId(String(tests[0].id));
  }

  useEffect(() => {
    if (testId) dispatch(fetchAdminTestQuestions({ testId }));
  }, [dispatch, testId]);

  const questionNumber = testQuestionsLoading ? null : testQuestions.length + 1;

  if (addQuestionResult && addQuestionResult !== handledResult) {
    setHandledResult(addQuestionResult);
    setFields(emptyFields(type));
    setFieldErrors({});
  }

  const handleCategoryChange = (id) => {
    setCategoryId(id);
    setTestId("");
  };

  const handleTypeChange = (nextType) => {
    setType(nextType);
    setFields(emptyFields(nextType));
    setFieldErrors({});
  };

  const clearError = (key) => {
    setFieldErrors((f) => ({ ...f, [key]: undefined }));
  };

  const handleSave = () => {
    if (!isSaveable(type)) {
      toaster.create({ title: "Not available yet", description: `"${typeConfig.label}" isn't supported by the backend yet — it can't be saved until that's added.`, type: "error", duration: 4000, closable: true });
      return;
    }
    const errors = validateQuestion(type, fields);
    if (!testId) errors.test = "Select a mock test";
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      toaster.create({ title: "Missing information", description: "Please fill in all required fields before saving.", type: "error", duration: 3500, closable: true });
      return;
    }
    setFieldErrors({});
    dispatch(addQuestion({
      testId,
      question: { type, ...fields },
    }));
  };

  if (categoriesLoading && categories.length === 0) {
    return <Loader fullScreen />;
  }

  return (
    <Box>
      <Breadcrumb
        items={[
          { label: "Dashboard", to: "/admin/dashboard" },
          { label: "Questions", to: "/admin/questions" },
          { label: "Add Question" },
        ]}
      />
      <BackButton to="/admin/questions" label="Back to Questions" />

      <Box bg="white" p={{ base: 4, md: 6, lg: 8 }} borderRadius="xl" boxShadow="md" maxW="800px">
      <HStack justify="space-between" align="center" mb={6} wrap="wrap" gap={2}>
        <Heading color="#0C1222">Add Question</Heading>
        {questionNumber !== null && (
          <Text color="gray.500" fontWeight={600}>Question {questionNumber}</Text>
        )}
      </HStack>

      <VStack gap={5} align="stretch">
        <Stack direction={{ base: "column", md: "row" }} gap={5} align="stretch">
          <Field.Root flex={1}>
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

          <Field.Root flex={1}>
            <Field.Label>Mock Test</Field.Label>
            <NativeSelect.Root>
              <NativeSelect.Field
                value={testId}
                onChange={(e) => setTestId(e.target.value)}
                disabled={categoryDetailLoading || tests.length === 0}
                {...fieldStyle}
                borderColor={fieldErrors.test ? "red.400" : fieldStyle.borderColor}
              >
                {tests.map((t) => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
            {fieldErrors.test && <Text color="red.500" fontSize="xs" mt={1}>{fieldErrors.test}</Text>}
          </Field.Root>
        </Stack>

        <Stack direction={{ base: "column", md: "row" }} gap={5} align="stretch">
          <Field.Root flex={2}>
            <Field.Label>Question Type</Field.Label>
            <NativeSelect.Root>
              <NativeSelect.Field
                value={type}
                onChange={(e) => handleTypeChange(e.target.value)}
                {...fieldStyle}
              >
                {QUESTION_TYPE_LIST.map((t) => (
                  <option key={t} value={t}>
                    {getTypeConfig(t).label}{getTypeConfig(t).comingSoon ? " (Coming Soon)" : ""}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Field.Root>

          <Field.Root flex={1}>
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
        </Stack>

        {typeConfig.comingSoon && (
          <Box bg="orange.50" border="1px solid" borderColor="orange.200" rounded="lg" p={3}>
            <Text fontSize="sm" color="orange.700" fontWeight={600}>
              "{typeConfig.label}" isn't supported by the backend yet. You can preview the form, but saving is disabled until it's added.
            </Text>
          </Box>
        )}

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

        <Stack direction={{ base: "column", sm: "row" }} gap={3} align="stretch">
          <Button colorPalette="blue" size="lg" onClick={handleSave} loading={addQuestionLoading} disabled={typeConfig.comingSoon} flex={1}>
            Save &amp; Next
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/admin/questions", { state: { categoryId, testId } })}>
            Finish
          </Button>
        </Stack>
      </VStack>
      </Box>
    </Box>
  );
}

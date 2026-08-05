import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box, Button, Dialog, HStack, Input, Portal, Stack, Text,
} from "@chakra-ui/react";
import { FaUpload } from "react-icons/fa";
import { bulkUploadQuestions, downloadQuestionTemplate } from "../../../pages/actions";
import { actions } from "../../../pages/slice";
import { SAVEABLE_QUESTION_TYPE_LIST, getTypeConfig } from "../../../pages/questionTypes";
import QuestionTypeBadge from "./QuestionTypeBadge";
import {
  getBulkUploadLoading, getBulkUploadResult, getBulkUploadError, getQuestionTemplateLoading,
} from "../../../pages/selectors";

export default function BulkUploadDialog({ isOpen, onClose, testId, testTitle }) {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [prevOpen, setPrevOpen] = useState(false);
  const loading = useSelector(getBulkUploadLoading);
  const result = useSelector(getBulkUploadResult);
  const error = useSelector(getBulkUploadError);
  const templateLoading = useSelector(getQuestionTemplateLoading);

  const typeBreakdown = useMemo(() => {
    if (!Array.isArray(result?.questions)) return [];
    const counts = {};
    result.questions.forEach((q) => {
      counts[q.type] = (counts[q.type] || 0) + 1;
    });
    return Object.entries(counts);
  }, [result]);

  if (isOpen !== prevOpen) {
    setPrevOpen(isOpen);
    if (isOpen) setFile(null);
  }

  useEffect(() => {
    if (isOpen) dispatch(actions.clearBulkUploadStatus());
  }, [isOpen, dispatch]);

  const handleUpload = () => {
    if (!file || !testId) return;
    dispatch(bulkUploadQuestions({ testId, file }));
  };

  const handleDownloadTemplate = () => {
    if (!testId) return;
    dispatch(downloadQuestionTemplate(testId));
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()} placement="center">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner p={{ base: 4, md: 0 }}>
          <Dialog.Content borderRadius="xl" w={{ base: "100%", md: "440px" }}>
            <Dialog.Header>
              <Dialog.Title color="#0C1222" fontWeight={800}>Bulk Upload Questions</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <Stack gap={4}>
                <Text fontSize="sm" color="gray.600">
                  Upload a single Excel (.xlsx) file to add many questions at once to <strong>{testTitle}</strong>.
                  One sheet can mix any of the {SAVEABLE_QUESTION_TYPE_LIST.length} supported question types — each
                  row's <strong>Question Type</strong> column tells us which one it is, so different question
                  types can sit side by side in the same file.
                </Text>

                <Box bg="gray.50" border="1px solid" borderColor="gray.100" rounded="lg" p={3}>
                  <Text fontSize="xs" fontWeight={700} color="gray.500" mb={2} textTransform="uppercase" letterSpacing="0.04em">
                    Supported question types
                  </Text>
                  <Stack gap={1.5}>
                    {SAVEABLE_QUESTION_TYPE_LIST.map((t) => (
                      <Text key={t} fontSize="xs" color="gray.600">• {getTypeConfig(t).label}</Text>
                    ))}
                  </Stack>
                </Box>

                <Box
                  as="button"
                  onClick={handleDownloadTemplate}
                  color="#039BE5"
                  fontWeight={600}
                  fontSize="sm"
                  textAlign="left"
                  opacity={templateLoading ? 0.6 : 1}
                >
                  {templateLoading ? "Downloading template…" : "Download the Excel template"}
                </Box>

                <Input
                  type="file"
                  accept=".xlsx"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  borderColor="gray.200"
                  borderWidth="2px"
                  rounded="lg"
                  p={1.5}
                />

                {result && (
                  <Box bg="green.50" border="1px solid" borderColor="green.200" rounded="lg" p={3}>
                    <Text fontSize="sm" color="green.700" fontWeight={600}>
                      {(result.questions?.length ?? result.addedCount ?? 0)} question(s) added.
                    </Text>
                    {typeBreakdown.length > 0 && (
                      <Stack gap={1.5} mt={3}>
                        {typeBreakdown.map(([type, count]) => (
                          <HStack key={type} justify="space-between">
                            <QuestionTypeBadge type={type} />
                            <Text fontSize="xs" color="gray.600" fontWeight={600}>{count}</Text>
                          </HStack>
                        ))}
                      </Stack>
                    )}
                    {result.errors?.length > 0 && (
                      <Stack gap={1} mt={2}>
                        {result.errors.map((e, i) => (
                          <Text key={i} fontSize="xs" color="orange.600">
                            Row {e.row}: {e.message}
                          </Text>
                        ))}
                      </Stack>
                    )}
                  </Box>
                )}

                {error && (
                  <Text fontSize="sm" color="red.500">{error}</Text>
                )}
              </Stack>
            </Dialog.Body>

            <Dialog.Footer>
              <Button variant="outline" borderRadius="lg" mr={3} onClick={onClose}>
                Close
              </Button>
              <Button
                colorPalette="blue"
                borderRadius="lg"
                fontWeight={700}
                onClick={handleUpload}
                loading={loading}
                disabled={!file}
              >
                <FaUpload size={12} style={{ marginRight: 6 }} />
                Upload
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

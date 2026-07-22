import {
  Box,
  Button,
  Field,
  Heading,
  Input,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import Breadcrumb from "../common/Breadcrumb";
import BackButton from "../common/BackButton";

const fieldStyle = {
  borderColor: "gray.200",
  borderWidth: "2px",
  borderRadius: "lg",
  _focus: { borderColor: "#039BE5", boxShadow: "0 0 0 3px rgba(3,155,229,0.12)" },
  _hover: { borderColor: "#039BE5" },
};

export default function AddTestSeries() {
  return (
    <Box>
      <Breadcrumb
        items={[
          { label: "Dashboard", to: "/admin/dashboard" },
          { label: "Test Series", to: "/admin/test-series" },
          { label: "Add Test Series" },
        ]}
      />
      <BackButton to="/admin/test-series" label="Back to Test Series" />

    <Box
      bg="white"
      p={8}
      borderRadius="xl"
      boxShadow="md"
      maxW="800px"
    >
      <Heading mb={6} color="#0C1222">Add Test Series</Heading>

      <VStack gap={5} align="stretch">
        <Field.Root>
          <Field.Label>Title</Field.Label>
          <Input placeholder="UPSC Prelims 2027" {...fieldStyle} />
        </Field.Root>

        <Field.Root>
          <Field.Label>Description</Field.Label>
          <Textarea
            placeholder="Enter description"
            rows={4}
            {...fieldStyle}
          />
        </Field.Root>

        <Field.Root>
          <Field.Label>Price</Field.Label>
          <Input placeholder="999" {...fieldStyle} />
        </Field.Root>

        <Field.Root>
          <Field.Label>Duration</Field.Label>
          <Input placeholder="12 Months" {...fieldStyle} />
        </Field.Root>

        <Field.Root>
          <Field.Label>Thumbnail URL</Field.Label>
          <Input placeholder="https://..." {...fieldStyle} />
        </Field.Root>

        <Button colorPalette="blue" size="lg">
          Save Test Series
        </Button>
      </VStack>
    </Box>
    </Box>
  );
}
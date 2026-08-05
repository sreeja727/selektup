import { useState } from "react";
import {
  Box,
  Button,
  Field,
  Heading,
  Input,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../common/Breadcrumb";
import BackButton from "../common/BackButton";
import { useTestSeries } from "../../context/TestSeriesContext";
import { toaster } from "../../../components/ui/toaster";

const fieldStyle = {
  borderColor: "gray.200",
  borderWidth: "2px",
  borderRadius: "lg",
  _focus: { borderColor: "#039BE5", boxShadow: "0 0 0 3px rgba(3,155,229,0.12)" },
  _hover: { borderColor: "#039BE5" },
};

const URL_RE = /^https?:\/\/.+/i;

export default function AddTestSeries() {
  const navigate = useNavigate();
  const { addTestSeries } = useTestSeries();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!title.trim()) errors.title = "Title is required";
    if (!description.trim()) errors.description = "Description is required";
    if (!price.trim()) errors.price = "Price is required";
    else if (!/^\d+(\.\d+)?$/.test(price.trim())) errors.price = "Enter a valid number, e.g. 999";
    if (!duration.trim()) errors.duration = "Duration is required";
    if (thumbnail.trim() && !URL_RE.test(thumbnail.trim())) errors.thumbnail = "Enter a valid URL starting with http:// or https://";
    return errors;
  };

  const handleSave = () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      toaster.create({ title: "Missing information", description: "Please fill in all required fields before saving.", type: "error", duration: 3500, closable: true });
      return;
    }
    setFieldErrors({});
    addTestSeries({
      title: title.trim(),
      description: description.trim(),
      price: `₹${price.trim()}`,
      duration: duration.trim(),
      thumbnail: thumbnail.trim(),
    });
    toaster.create({ title: "Test series added", description: "The new test series is now live.", type: "success", duration: 3500, closable: true });
    navigate("/admin/test-series");
  };

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
      p={{ base: 4, md: 6, lg: 8 }}
      borderRadius="xl"
      boxShadow="md"
      maxW="800px"
    >
      <Heading mb={6} color="#0C1222">Add Test Series</Heading>

      <VStack gap={5} align="stretch">
        <Field.Root>
          <Field.Label>Title</Field.Label>
          <Input
            placeholder="UPSC Prelims 2027"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setFieldErrors((f) => ({ ...f, title: undefined }));
            }}
            {...fieldStyle}
            borderColor={fieldErrors.title ? "red.400" : fieldStyle.borderColor}
          />
          {fieldErrors.title && <Text color="red.500" fontSize="xs" mt={1}>{fieldErrors.title}</Text>}
        </Field.Root>

        <Field.Root>
          <Field.Label>Description</Field.Label>
          <Textarea
            placeholder="Enter description"
            rows={4}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setFieldErrors((f) => ({ ...f, description: undefined }));
            }}
            {...fieldStyle}
            borderColor={fieldErrors.description ? "red.400" : fieldStyle.borderColor}
          />
          {fieldErrors.description && <Text color="red.500" fontSize="xs" mt={1}>{fieldErrors.description}</Text>}
        </Field.Root>

        <Field.Root>
          <Field.Label>Price</Field.Label>
          <Input
            placeholder="999"
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
              setFieldErrors((f) => ({ ...f, price: undefined }));
            }}
            {...fieldStyle}
            borderColor={fieldErrors.price ? "red.400" : fieldStyle.borderColor}
          />
          {fieldErrors.price && <Text color="red.500" fontSize="xs" mt={1}>{fieldErrors.price}</Text>}
        </Field.Root>

        <Field.Root>
          <Field.Label>Duration</Field.Label>
          <Input
            placeholder="12 Months"
            value={duration}
            onChange={(e) => {
              setDuration(e.target.value);
              setFieldErrors((f) => ({ ...f, duration: undefined }));
            }}
            {...fieldStyle}
            borderColor={fieldErrors.duration ? "red.400" : fieldStyle.borderColor}
          />
          {fieldErrors.duration && <Text color="red.500" fontSize="xs" mt={1}>{fieldErrors.duration}</Text>}
        </Field.Root>

        <Field.Root>
          <Field.Label>Thumbnail URL</Field.Label>
          <Input
            placeholder="https://..."
            value={thumbnail}
            onChange={(e) => {
              setThumbnail(e.target.value);
              setFieldErrors((f) => ({ ...f, thumbnail: undefined }));
            }}
            {...fieldStyle}
            borderColor={fieldErrors.thumbnail ? "red.400" : fieldStyle.borderColor}
          />
          {fieldErrors.thumbnail && <Text color="red.500" fontSize="xs" mt={1}>{fieldErrors.thumbnail}</Text>}
        </Field.Root>

        <Button colorPalette="blue" size="lg" onClick={handleSave}>
          Save Test Series
        </Button>
      </VStack>
    </Box>
    </Box>
  );
}

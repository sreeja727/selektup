import {
  Box,
  Button,
  Dialog,
  HStack,
  Portal,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FaCheckCircle, FaTimesCircle, FaBookmark, FaExclamationTriangle } from "react-icons/fa";

function StatTile({ tile }) {
  return (
    <Stack gap={1} align="center" textAlign="center" bg={tile.bg} borderRadius="lg" p={3}>
      <Box color={tile.color}>
        <tile.Icon size={16} />
      </Box>
      <Text fontSize="lg" fontWeight={800} color="#0C1222">{tile.value}</Text>
      <Text fontSize="2xs" color="gray.500" fontWeight={600} textTransform="uppercase" letterSpacing="0.04em">
        {tile.label}
      </Text>
    </Stack>
  );
}

export default function SubmitModal({
  isOpen,
  onClose,
  onSubmit,
  answered,
  notAnswered,
  review,
}) {
  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      placement="center"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content borderRadius="xl" w={{ base: "92vw", md: "460px" }} maxW="460px" mx="auto">
            <Dialog.Header>
              <Dialog.Title color="#0C1222" fontWeight={800}>Submit Test</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <Stack gap={5}>
                <SimpleGrid columns={3} gap={{ base: 2, md: 3 }}>
                  <StatTile tile={{ Icon: FaCheckCircle, label: "Answered", value: answered, color: "#2E7D32", bg: "green.50" }} />
                  <StatTile tile={{ Icon: FaTimesCircle, label: "Not Answered", value: notAnswered, color: "#C62828", bg: "red.50" }} />
                  <StatTile tile={{ Icon: FaBookmark, label: "For Review", value: review, color: "#B8860B", bg: "yellow.50" }} />
                </SimpleGrid>

                <HStack
                  bg="rgba(211,47,47,0.06)"
                  border="1px solid"
                  borderColor="rgba(211,47,47,0.25)"
                  borderRadius="lg"
                  p={3}
                  gap={3}
                  align="flex-start"
                >
                  <Box color="#D32F2F" mt={0.5}>
                    <FaExclamationTriangle size={14} />
                  </Box>
                  <Text fontSize="sm" color="#B71C1C" fontWeight={600}>
                    Once submitted, you cannot attend the test again.
                  </Text>
                </HStack>

                <Text fontSize="sm" color="gray.600">
                  Are you sure you want to submit the exam?
                </Text>
              </Stack>
            </Dialog.Body>

            <Dialog.Footer wrap="wrap" gap={2}>
              <Button variant="outline" borderRadius="lg" mr={{ base: 0, sm: 3 }} onClick={onClose}>
                Cancel
              </Button>

              <Button bg="#D32F2F" color="white" borderRadius="lg" fontWeight={700} _hover={{ bg: "#B71C1C" }} onClick={onSubmit}>
                Submit Test
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

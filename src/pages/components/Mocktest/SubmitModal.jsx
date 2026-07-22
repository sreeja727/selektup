import {
  Button,
  Dialog,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";

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
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Submit Test</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <VStack gap={4} align="start">
                <Text>
                  <b>Answered Questions:</b> {answered}
                </Text>

                <Text>
                  <b>Not Answered:</b> {notAnswered}
                </Text>

                <Text>
                  <b>Marked for Review:</b> {review}
                </Text>

                <Text color="red.500" fontWeight="bold">
                  Once submitted, you cannot attend the test again.
                </Text>

                <Text>
                  Are you sure you want to submit the exam?
                </Text>
              </VStack>
            </Dialog.Body>

            <Dialog.Footer>
              <Button mr={3} onClick={onClose}>
                Cancel
              </Button>

              <Button colorPalette="red" onClick={onSubmit}>
                Submit Test
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

import { Button, Dialog, Portal, Text } from "@chakra-ui/react";

export default function ConfirmDialog({
  isOpen,
  title = "Are you sure?",
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  confirmColorPalette = "red",
  loading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onCancel()} placement="center">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner p={{ base: 4, md: 0 }}>
          <Dialog.Content borderRadius="xl" w={{ base: "100%", md: "420px" }}>
            <Dialog.Header>
              <Dialog.Title color="#0C1222" fontWeight={800}>{title}</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <Text fontSize="sm" color="gray.600">{message}</Text>
            </Dialog.Body>

            <Dialog.Footer>
              <Button variant="outline" borderRadius="lg" mr={3} onClick={onCancel} disabled={loading}>
                {cancelLabel}
              </Button>
              <Button
                colorPalette={confirmColorPalette}
                borderRadius="lg"
                fontWeight={700}
                onClick={onConfirm}
                loading={loading}
              >
                {confirmLabel}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

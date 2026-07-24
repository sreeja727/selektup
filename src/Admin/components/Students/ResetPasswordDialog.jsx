import { useState } from "react";
import { Box, Button, Dialog, HStack, Input, Portal, Text } from "@chakra-ui/react";
import { KeyRound, Copy, Check, Mail, MessageSquare } from "lucide-react";
import { toaster } from "../../../components/ui/toaster";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789@#$%";

function generatePassword() {
  let pwd = "";
  for (let i = 0; i < 10; i += 1) {
    pwd += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return pwd;
}

export default function ResetPasswordDialog({ student, open, onClose, onResolved }) {
  const [tempPassword, setTempPassword] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(null);
  const [sendError, setSendError] = useState("");
  const [sendSuccess, setSendSuccess] = useState("");

  const reset = () => {
    setTempPassword("");
    setError("");
    setDone(false);
    setCopied(false);
    setSending(null);
    setSendError("");
    setSendSuccess("");
  };

  const handleOpenChange = (e) => {
    if (!e.open) {
      reset();
      onClose();
    }
  };

  const handleGenerate = () => {
    setTempPassword(generatePassword());
    setError("");
  };

  const handleReset = () => {
    if (tempPassword.trim().length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setError("");
    // TODO: wire to a real backend endpoint once one exists, e.g.
    // PUT /admin/students/:id/reset-password { tempPassword }
    // For now this only updates local UI state — no student data is actually changed server-side.
    setDone(true);
    onResolved?.(student);
    toaster.create({
      title: "Temporary password set",
      description: `A temporary password has been set for ${student.name}.`,
      type: "success",
      duration: 3500,
      closable: true,
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(tempPassword);
    setCopied(true);
    toaster.create({ title: "Copied to clipboard", type: "info", duration: 2000, closable: true });
  };

  // TODO: this endpoint doesn't exist yet — implement it on the backend to actually
  // deliver the temp password. Expected contract:
  //   POST /api/admin/students/:id/notify-password
  //   body: { channel: 'email' | 'sms', tempPassword }
  //   -> { success: true } | { success: false, message }
  // Until then this will just fail with a connection error, which is surfaced below.
  const handleSend = async (channel) => {
    setSending(channel);
    setSendError("");
    setSendSuccess("");
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/admin/students/${student.id}/notify-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ channel, tempPassword }),
        }
      );
      const data = await res.json();
      if (data.success) {
        const message = channel === "email" ? "Sent via email." : "Sent via SMS.";
        setSendSuccess(message);
        toaster.create({ title: "Password sent", description: message, type: "success", duration: 3500, closable: true });
      } else {
        const message = data.message || "Failed to send. Please try again.";
        setSendError(message);
        toaster.create({ title: "Send failed", description: message, type: "error", duration: 4000, closable: true });
      }
    } catch {
      const message = "Couldn't reach the server — this endpoint still needs to be built on the backend.";
      setSendError(message);
      toaster.create({ title: "Send failed", description: message, type: "error", duration: 4000, closable: true });
    } finally {
      setSending(null);
    }
  };

  if (!student) return null;

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange} placement="center">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Reset Password</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              {!done ? (
                <>
                  <Text fontSize="sm" color="gray.500" mb={4}>
                    Set a temporary password for{" "}
                    <Text as="span" fontWeight={700} color="#0C1222">{student.name}</Text>.
                    Share it with them through a secure channel — they'll be asked to
                    change it after logging in.
                  </Text>

                  <HStack gap={2}>
                    <Input
                      placeholder="Temporary password"
                      value={tempPassword}
                      onChange={(e) => {
                        setTempPassword(e.target.value);
                        setError("");
                      }}
                      borderColor={error ? "red.400" : "gray.200"}
                      borderWidth="2px"
                      borderRadius="lg"
                      _focus={{ borderColor: "#039BE5", boxShadow: "0 0 0 3px rgba(3,155,229,0.12)" }}
                    />
                    <Button variant="outline" flexShrink={0} onClick={handleGenerate}>
                      <KeyRound size={16} />
                      Generate
                    </Button>
                  </HStack>
                  {error && <Text color="red.500" fontSize="xs" mt={1}>{error}</Text>}
                </>
              ) : (
                <Box
                  bg="green.50"
                  border="1px solid"
                  borderColor="green.200"
                  borderRadius="lg"
                  p={4}
                >
                  <Text fontSize="sm" color="green.700" fontWeight={600} mb={2}>
                    Temporary password set for {student.name}
                  </Text>
                  <HStack
                    justify="space-between"
                    bg="white"
                    border="1px solid"
                    borderColor="green.200"
                    borderRadius="md"
                    px={3}
                    py={2}
                    mb={4}
                  >
                    <Text fontFamily="monospace" fontWeight={700} color="#0C1222">
                      {tempPassword}
                    </Text>
                    <Box as="button" onClick={handleCopy} color="gray.500" _hover={{ color: "#039BE5" }}>
                      {copied ? <Check size={16} color="#22C55E" /> : <Copy size={16} />}
                    </Box>
                  </HStack>

                  <Text fontSize="xs" color="gray.500" mb={2}>
                    Or send it directly:
                  </Text>
                  <HStack gap={2}>
                    <Button
                      size="sm"
                      variant="outline"
                      flex={1}
                      gap={2}
                      loading={sending === "email"}
                      disabled={sending !== null}
                      onClick={() => handleSend("email")}
                    >
                      <Mail size={14} />
                      Email
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      flex={1}
                      gap={2}
                      loading={sending === "sms"}
                      disabled={sending !== null}
                      onClick={() => handleSend("sms")}
                    >
                      <MessageSquare size={14} />
                      SMS
                    </Button>
                  </HStack>
                  {sendError && <Text color="red.500" fontSize="xs" mt={2}>{sendError}</Text>}
                  {sendSuccess && <Text color="green.600" fontSize="xs" mt={2}>{sendSuccess}</Text>}
                </Box>
              )}
            </Dialog.Body>

            <Dialog.Footer>
              {!done ? (
                <>
                  <Button variant="outline" mr={3} onClick={() => handleOpenChange({ open: false })}>
                    Cancel
                  </Button>
                  <Button colorPalette="blue" onClick={handleReset}>
                    Reset Password
                  </Button>
                </>
              ) : (
                <Button colorPalette="blue" onClick={() => handleOpenChange({ open: false })}>
                  Done
                </Button>
              )}
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

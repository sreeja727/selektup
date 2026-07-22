import { Box } from "@chakra-ui/react";

const KEYFRAMES = `
@keyframes sku-spin { to { transform: rotate(360deg); } }
`;

export default function Loader({ fullScreen = false, size = 96 }) {
  const content = (
    <Box position="relative" w={`${size}px`} h={`${size}px`}>
      <style>{KEYFRAMES}</style>
      <Box
        position="absolute"
        inset="0"
        borderRadius="full"
        border="4px solid"
        borderColor="#E91E8C"
        borderRightColor="#039BE5"
        borderBottomColor="#039BE5"
        style={{ animation: "sku-spin 0.8s linear infinite" }}
      />
      <Box
        as="img"
        src="/logo.png"
        alt="Loading"
        position="absolute"
        top="50%"
        left="50%"
        w="62%"
        style={{ transform: "translate(-50%, -50%)" }}
      />
    </Box>
  );

  if (!fullScreen) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" py={10}>
        {content}
      </Box>
    );
  }

  return (
    <Box
      position="fixed"
      inset="0"
      zIndex={9999}
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="rgba(255, 255, 255, 0.85)"
      style={{ backdropFilter: "blur(4px)" }}
    >
      {content}
    </Box>
  );
}

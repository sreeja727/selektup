import { Box, Flex, Text } from "@chakra-ui/react";

export default function Header() {
  return (
    <Flex
      bg="white"
      h="70px"
      align="center"
      justify="space-between"
      px={8}
      shadow="sm"
    >
      <Text fontWeight="bold" fontSize="xl">
        Admin Dashboard
      </Text>

      <Text>Admin</Text>
    </Flex>
  );
}
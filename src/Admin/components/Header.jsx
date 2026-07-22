import { Box, Flex, HStack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { logoutAdmin } from "../../utils/adminAuth";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    navigate("/login", { replace: true });
  };

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

      <HStack
        gap={2}
        cursor="pointer"
        color="gray.600"
        _hover={{ color: "#039BE5" }}
        onClick={handleLogout}
      >
        <Text>Logout</Text>
        <Box as={FaSignOutAlt} />
      </HStack>
    </Flex>
  );
}
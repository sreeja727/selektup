import { Box, Flex, HStack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaBars } from "react-icons/fa";
import { logoutAdmin } from "../../utils/adminAuth";

export default function Header({ sidebarOpen, onToggleSidebar }) {
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
      px={{ base: 4, md: 6, lg: 8 }}
      borderBottom="1px solid"
      borderColor="gray.100"
    >
      <HStack gap={{ base: 2, md: 4 }}>
        <Box
          as="button"
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          display="flex"
          alignItems="center"
          justifyContent="center"
          w="38px"
          h="38px"
          rounded="lg"
          color="gray.600"
          _hover={{ color: "#E91E8C", bg: "pink.50" }}
          transition="all 0.15s"
          onClick={onToggleSidebar}
          flexShrink={0}
        >
          <FaBars size={16} />
        </Box>
        <Text fontWeight="800" fontSize={{ base: "md", md: "xl" }} color="#0C1222">
          Admin Dashboard
        </Text>
      </HStack>

      <HStack
        gap={2}
        cursor="pointer"
        color="gray.600"
        fontWeight={600}
        fontSize="sm"
        px={{ base: 2, md: 4 }}
        py={2}
        rounded="lg"
        _hover={{ color: "#E91E8C", bg: "pink.50" }}
        transition="all 0.15s"
        onClick={handleLogout}
      >
        <Text>Logout</Text>
        <Box as={FaSignOutAlt} fontSize="14px" />
      </HStack>
    </Flex>
  );
}
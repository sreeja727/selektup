import { Box, VStack, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const menu = [
  { name: "Dashboard", path: "/admin/dashboard" },
  { name: "Test Series", path: "/admin/test-series" },
  { name: "Mock Tests", path: "/admin/mock-tests" },
  { name: "Questions", path: "/admin/questions" },
  { name: "Students", path: "/admin/students" },
  { name: "Payments", path: "/admin/payments" },
];

export default function Sidebar() {
  return (
    <Box
      w="250px"
      bg="#0B1E35"
      color="white"
      h="100vh"
      p={5}
      position="fixed"
    >
      <Text fontSize="2xl" fontWeight="bold" mb={8}>
        SelektUp Admin
      </Text>

      <VStack align="stretch" spacing={4}>
        {menu.map((item) => (
          <Link key={item.name} to={item.path}>
            <Box
              p={3}
              rounded="md"
              _hover={{
                bg: "#039BE5",
              }}
            >
              {item.name}
            </Box>
          </Link>
        ))}
      </VStack>
    </Box>
  );
}
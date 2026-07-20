import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AdminLayout() {
  return (
    <Box bg="gray.100" minH="100vh">
      <Sidebar />

      <Box ml="250px">
        <Header />

        <Box p={8}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
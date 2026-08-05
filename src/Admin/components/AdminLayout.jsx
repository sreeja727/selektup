import { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { TestSeriesProvider } from "../context/TestSeriesContext";
import Loader from "../../components/Loader";

export default function AdminLayout() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [loadedPath, setLoadedPath] = useState(null);

  if (location.pathname !== loadedPath) {
    setLoadedPath(location.pathname);
    setLoading(true);
  }

  useEffect(() => {
    if (!loading) return undefined;
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [loading]);

  return (
    <TestSeriesProvider>
      {loading && <Loader fullScreen />}
      <Box bg="gray.100" minH="100vh">
        <Sidebar />

        <Box ml="250px">
          <Header />

          <Box p={8}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </TestSeriesProvider>
  );
}
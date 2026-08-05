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
  // Sidebar defaults open on desktop but should start closed on mobile/tablet
  // so it doesn't cover the page on first load — it becomes an overlay
  // drawer there (toggled via the header's hamburger button).
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 992 : true
  );

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
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <Box
          ml={{ base: 0, lg: sidebarOpen ? "250px" : "0px" }}
          transition="margin-left 0.2s ease"
        >
          <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((o) => !o)} />

          <Box p={{ base: 4, md: 6, lg: 8 }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </TestSeriesProvider>
  );
}
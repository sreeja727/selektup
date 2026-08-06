import { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { TestSeriesProvider } from "../context/TestSeriesContext";
import Loader from "../../components/Loader";

const SIDEBAR_WIDTH_EXPANDED = "250px";
const SIDEBAR_WIDTH_COLLAPSED = "76px";

export default function AdminLayout() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [loadedPath, setLoadedPath] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 992 : false
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
        <Sidebar collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed((c) => !c)} />

        <Box
          ml={sidebarCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED}
          transition="margin-left 0.25s ease"
        >
          <Header />

          <Box p={{ base: 4, md: 6, lg: 8 }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </TestSeriesProvider>
  );
}

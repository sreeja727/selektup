import { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { TestSeriesProvider } from "../context/TestSeriesContext";
import Loader from "../../components/Loader";

// Must match the WIDTH_EXPANDED/WIDTH_COLLAPSED constants in Sidebar.jsx.
const SIDEBAR_WIDTH_EXPANDED = "250px";
const SIDEBAR_WIDTH_COLLAPSED = "76px";

export default function AdminLayout() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [loadedPath, setLoadedPath] = useState(null);
  // Sidebar defaults expanded on desktop but starts collapsed to icon-only
  // on mobile/tablet, so it doesn't eat too much width on first load. The
  // toggle lives on the sidebar itself (see Sidebar.jsx) and works the same
  // way at every screen size.
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

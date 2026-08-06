import { useState } from "react";
import { Box, VStack, Text } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import {FaTachometerAlt,FaEnvelopeOpenText,FaLayerGroup,FaUserGraduate,FaBook,FaQuestionCircle,FaChevronDown,FaChevronLeft,FaChevronRight,FaUserCheck,FaIdCard,FaChartBar,} from "react-icons/fa";

const WIDTH_EXPANDED = "250px";
const WIDTH_COLLAPSED = "76px";

const menu = [
  { name: "Dashboard", path: "/admin/dashboard", icon: FaTachometerAlt },
  {
    name: "Students",
    icon: FaUserGraduate,
    children: [
      { name: "Category Access", path: "/admin/students/exam-access", icon: FaUserCheck },
      { name: "Student Details", path: "/admin/students/details", icon: FaIdCard },
    ],
  },
  { name: "Enquiries", path: "/admin/enquiries", icon: FaEnvelopeOpenText },
  {
    name: "Test Series & Questions",
    icon: FaLayerGroup,
    children: [
      { name: "Test Series", path: "/admin/test-series", icon: FaBook },
      { name: "Questions", path: "/admin/questions", icon: FaQuestionCircle },
    ],
  },
  { name: "Results", path: "/admin/results", icon: FaChartBar },
];

function isGroupActive(item, pathname) {
  return item.children.some((child) => pathname.startsWith(child.path));
}

export default function Sidebar({ collapsed = false, onToggleCollapse }) {
  const { pathname } = useLocation();
  const [openGroups, setOpenGroups] = useState(() => {
    const initial = {};
    menu.forEach((item) => {
      if (item.children) initial[item.name] = isGroupActive(item, pathname);
    });
    return initial;
  });

  const toggleGroup = (name) => {
    setOpenGroups((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleGroupClick = (name) => {
    if (collapsed) {
      onToggleCollapse?.();
      setOpenGroups((prev) => ({ ...prev, [name]: true }));
    } else {
      toggleGroup(name);
    }
  };

  return (
    
    <Box
      w={collapsed ? WIDTH_COLLAPSED : WIDTH_EXPANDED}
      bg="#0C1222"
      color="white"
      h="100vh"
      position="fixed"
      top={0}
      left={0}
      zIndex={1000}
      transition="width 0.25s ease"
    >
      {/* Collapse/expand toggle — sits on the sidebar's own right edge,
          half-overlapping it, so it's reachable and visible in both states
          and at every screen size. */}
      <Box
        as="button"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        onClick={onToggleCollapse}
        position="absolute"
        top="28px"
        right="-14px"
        w="28px"
        h="28px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        rounded="full"
        bg="white"
        color="#0C1222"
        border="1px solid"
        borderColor="gray.200"
        boxShadow="0 2px 8px rgba(0,0,0,0.2)"
        cursor="pointer"
        zIndex={1001}
        _hover={{ bg: "#039BE5", color: "white", borderColor: "#039BE5" }}
        transition="background 0.15s, color 0.15s"
      >
        {collapsed ? <FaChevronRight size={11} /> : <FaChevronLeft size={11} />}
      </Box>

      <Box w="100%" h="100%" overflowX="hidden" overflowY="auto" p={collapsed ? 3 : 5}>
        <Box
          mb={8}
          px={1}
          pb={5}
          borderBottom="1px solid"
          borderColor="rgba(255,255,255,0.08)"
          display="flex"
          flexDirection="column"
          alignItems={collapsed ? "center" : "flex-start"}
        >
          {collapsed ? (
            <Text fontWeight="900" fontSize="xl" letterSpacing="-0.5px">
              <span style={{ color: "#039BE5" }}>S</span>
              <span style={{ color: "#E91E8C" }}>U</span>
            </Text>
          ) : (
            <>
              <Text fontWeight="900" fontSize="xl" letterSpacing="-0.5px">
                <span style={{ color: "#039BE5" }}>SeleKt</span>
                <span style={{ color: "#E91E8C" }}>Up</span>
              </Text>
              <Text fontSize="10px" fontWeight={700} color="gray.400" letterSpacing="0.12em" mt={1}>
                ADMIN PANEL
              </Text>
            </>
          )}
        </Box>

        <VStack align="stretch" gap={2}>
          {menu.map((item) => {
          if (item.children) {
            const active = isGroupActive(item, pathname);
            const groupOpen = !collapsed && (openGroups[item.name] || active);
            return (
              <Box key={item.name}>
                <Box
                  as="button"
                  w="100%"
                  display="flex"
                  alignItems="center"
                  justifyContent={collapsed ? "center" : "flex-start"}
                  gap={collapsed ? 0 : 3}
                  p={3}
                  rounded="lg"
                  fontWeight={600}
                  fontSize="sm"
                  bg={active ? "rgba(255,255,255,0.08)" : "transparent"}
                  color={active ? "white" : "gray.300"}
                  _hover={{ bg: "rgba(255,255,255,0.08)", color: "white" }}
                  transition="all 0.15s"
                  onClick={() => handleGroupClick(item.name)}
                  title={collapsed ? item.name : undefined}
                >
                  <Box as={item.icon} fontSize="14px" flexShrink={0} />
                  {!collapsed && <Text flex={1} textAlign="left">{item.name}</Text>}
                  {!collapsed && (
                    <Box
                      as={FaChevronDown}
                      fontSize="10px"
                      transform={groupOpen ? "rotate(180deg)" : "rotate(0deg)"}
                      transition="transform 0.15s"
                    />
                  )}
                </Box>

                {groupOpen && (
                  <VStack align="stretch" gap={1} mt={1} pl={6}>
                    {item.children.map((child) => {
                      const childActive = pathname.startsWith(child.path);
                      return (
                        <Box
                          key={child.name}
                          as={Link}
                          to={child.path}
                          display="flex"
                          alignItems="center"
                          gap={3}
                          p={2}
                          rounded="lg"
                          fontWeight={600}
                          fontSize="sm"
                          bg={childActive ? "#039BE5" : "transparent"}
                          color={childActive ? "white" : "gray.400"}
                          _hover={{
                            bg: childActive ? "#039BE5" : "rgba(255,255,255,0.08)",
                            color: "white",
                            textDecoration: "none",
                          }}
                          transition="all 0.15s"
                        >
                          <Box as={child.icon} fontSize="12px" />
                          <Text>{child.name}</Text>
                        </Box>
                      );
                    })}
                  </VStack>
                )}
              </Box>
            );
          }

          const active = pathname.startsWith(item.path);
          return (
            <Box
              key={item.name}
              as={Link}
              to={item.path}
              display="flex"
              alignItems="center"
              justifyContent={collapsed ? "center" : "flex-start"}
              gap={collapsed ? 0 : 3}
              p={3}
              rounded="lg"
              fontWeight={600}
              fontSize="sm"
              bg={active ? "#039BE5" : "transparent"}
              color={active ? "white" : "gray.300"}
              _hover={{
                bg: active ? "#039BE5" : "rgba(255,255,255,0.08)",
                color: "white",
                textDecoration: "none",
              }}
              transition="all 0.15s"
              title={collapsed ? item.name : undefined}
            >
              <Box as={item.icon} fontSize="14px" flexShrink={0} />
              {!collapsed && <Text>{item.name}</Text>}
            </Box>
          );
        })}
        </VStack>
      </Box>
    </Box>
  );
}

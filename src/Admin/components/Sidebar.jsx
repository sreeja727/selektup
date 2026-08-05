import { useState } from "react";
import { Box, VStack, Text } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaEnvelopeOpenText,
  FaLayerGroup,
  FaUserGraduate,
  FaBook,
  FaQuestionCircle,
  FaChevronDown,
  FaUserCheck,
  FaIdCard,
  FaChartBar,
} from "react-icons/fa";

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

export default function Sidebar({ open = true, onClose }) {
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

  // On mobile/tablet the sidebar behaves as an overlay drawer (fixed width,
  // slides in/out via transform, dims the page behind it) instead of
  // squeezing the content. On desktop it keeps its original collapse-to-0
  // push behavior.
  return (
    <>
      <Box
        display={{ base: open ? "block" : "none", lg: "none" }}
        position="fixed"
        inset={0}
        bg="blackAlpha.600"
        zIndex={999}
        onClick={onClose}
      />
      <Box
        w={{ base: "250px", lg: open ? "250px" : "0px" }}
        bg="#0C1222"
        color="white"
        h="100vh"
        p={{ base: 5, lg: open ? 5 : 0 }}
        position="fixed"
        top={0}
        left={0}
        overflowX="hidden"
        overflowY="auto"
        zIndex={1000}
        transform={{ base: open ? "translateX(0)" : "translateX(-100%)", lg: "translateX(0)" }}
        boxShadow={{ base: open ? "2xl" : "none", lg: "none" }}
        transition="width 0.2s ease, padding 0.2s ease, transform 0.2s ease"
      >
      <Box w="240px">
        <Box mb={8} px={1} pb={5} borderBottom="1px solid" borderColor="rgba(255,255,255,0.08)">
          <Text fontWeight="900" fontSize="xl" letterSpacing="-0.5px">
            <span style={{ color: "#039BE5" }}>SeleKt</span>
            <span style={{ color: "#E91E8C" }}>Up</span>
          </Text>
          <Text fontSize="10px" fontWeight={700} color="gray.400" letterSpacing="0.12em" mt={1}>
            ADMIN PANEL
          </Text>
        </Box>

        <VStack align="stretch" gap={2}>
          {menu.map((item) => {
          if (item.children) {
            const active = isGroupActive(item, pathname);
            const open = openGroups[item.name] || active;
            return (
              <Box key={item.name}>
                <Box
                  as="button"
                  w="100%"
                  display="flex"
                  alignItems="center"
                  gap={3}
                  p={3}
                  rounded="lg"
                  fontWeight={600}
                  fontSize="sm"
                  bg={active ? "rgba(255,255,255,0.08)" : "transparent"}
                  color={active ? "white" : "gray.300"}
                  _hover={{ bg: "rgba(255,255,255,0.08)", color: "white" }}
                  transition="all 0.15s"
                  onClick={() => toggleGroup(item.name)}
                >
                  <Box as={item.icon} fontSize="14px" />
                  <Text flex={1} textAlign="left">{item.name}</Text>
                  <Box
                    as={FaChevronDown}
                    fontSize="10px"
                    transform={open ? "rotate(180deg)" : "rotate(0deg)"}
                    transition="transform 0.15s"
                  />
                </Box>

                {open && (
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
                          onClick={() => onClose?.()}
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
              gap={3}
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
              onClick={() => onClose?.()}
            >
              <Box as={item.icon} fontSize="14px" />
              <Text>{item.name}</Text>
            </Box>
          );
        })}
        </VStack>
      </Box>
      </Box>
    </>
  );
}

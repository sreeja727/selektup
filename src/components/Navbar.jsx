import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
<<<<<<< HEAD
import {Box,Flex,Text,Container,HStack,Stack,Button,} from "@chakra-ui/react";
import {FaPhone,FaEnvelope,FaFacebook,FaTwitter,FaYoutube,FaInstagram,FaBars,FaTimes,FaTelegram,FaChevronDown,} from "react-icons/fa";
import { selektup } from "../assets";

const NAV_LINKS = [
  "Home",
  "About Us",
  "Courses",
  "Contact",
  "Study Materials",
];
=======
import { Box, Flex, Text, Container, HStack, Stack, Button } from "@chakra-ui/react";
import {
  FaPhone, FaEnvelope, FaFacebook, FaYoutube, FaInstagram,
  FaBars, FaTimes, FaTelegram, FaChevronDown,
} from "react-icons/fa";
import { selektup } from "../assets";
import { isLoggedIn, logoutUser } from "../utils/auth";

const NAV_LINKS = ["Home", "About Us", "Courses", "Test Series", "Contact", "Study Materials"];
>>>>>>> 1f7908aaed02400d7441d351ceff84dab95da44b

const ROUTE_PATHS = {
  Home: "/",
  "About Us": "/about",
  Courses: "/courses",
<<<<<<< HEAD
=======
  "Test Series": "/test-series",
>>>>>>> 1f7908aaed02400d7441d351ceff84dab95da44b
  Contact: "/contact",
};

const STUDY_MATERIAL_LINKS = [
  { label: "Telegram", icon: FaTelegram, href: "https://t.me/selektup", color: "#0088cc" },
  { label: "YouTube", icon: FaYoutube, href: "https://www.youtube.com/@selektup", color: "#FF0000" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [studyOpen, setStudyOpen] = useState(false);
  const [mobileStudyOpen, setMobileStudyOpen] = useState(false);
<<<<<<< HEAD
  const enquirySubmitted = localStorage.getItem('enquirySubmitted') === 'true';

  return (
    <>
      <Box bg="#0C1222" color="white" py={2}>
        <Container maxW="7xl">
          <Flex justify="space-between" align="center" >
=======
  const enquirySubmitted = localStorage.getItem("enquirySubmitted") === "true";
  const loggedIn = isLoggedIn();

  function handleLogout() {
    logoutUser();
    navigate("/");
  }

  return (
    <>
      {/* Top info bar — hidden on mobile */}
      <Box bg="#0C1222" color="white" py={2} display={{ base: "none", md: "block" }}>
        <Container maxW="7xl">
          <Flex justify="space-between" align="center">
>>>>>>> 1f7908aaed02400d7441d351ceff84dab95da44b
            <HStack gap={5}>
              <HStack gap={2}>
                <FaPhone size={11} />
                <Text fontSize="xs">+91 8089712121</Text>
              </HStack>
              <HStack gap={2}>
                <FaEnvelope size={11} />
                <Text fontSize="xs">selektup@gmail.com</Text>
              </HStack>
            </HStack>
<<<<<<< HEAD

            <HStack gap={3}>
              {[
                { icon: FaFacebook, href: 'https://facebook.com/profile.php?id=61585841854078' },
                { icon: FaYoutube, href: 'https://www.youtube.com/@SeleKtUp' },
                { icon: FaInstagram, href: 'https://instagram.com/selektup/' },

=======
            <HStack gap={3}>
              {[
                { icon: FaFacebook, href: "https://facebook.com/profile.php?id=61585841854078" },
                { icon: FaYoutube, href: "https://www.youtube.com/@SeleKtUp" },
                { icon: FaInstagram, href: "https://instagram.com/selektup/" },
>>>>>>> 1f7908aaed02400d7441d351ceff84dab95da44b
              ].map((item, i) => (
                <Box
                  key={i}
                  as="a"
                  href={item.href}
<<<<<<< HEAD
                  target={item.href !== '#' ? '_blank' : undefined}
                  rel={item.href !== '#' ? 'noopener noreferrer' : undefined}
=======
                  target="_blank"
                  rel="noopener noreferrer"
>>>>>>> 1f7908aaed02400d7441d351ceff84dab95da44b
                  color="gray.400"
                  _hover={{ color: "#E91E8C" }}
                >
                  <item.icon size={14} />
                </Box>
              ))}
            </HStack>
          </Flex>
        </Container>
      </Box>

<<<<<<< HEAD
      <Box  bg="white" boxShadow="sm" position="sticky" top="0" zIndex="1000">
        <Container maxW="7xl" py={3}>
          <Flex align="center" justify="space-between">
            
=======
      {/* Main navbar */}
      <Box bg="white" boxShadow="sm" position="sticky" top="0" zIndex="1000">
        <Container maxW="7xl" px={{ base: 4, md: 6 }} py={{ base: 2, md: 3 }}>
          <Flex align="center" justify="space-between">

            {/* Logo */}
>>>>>>> 1f7908aaed02400d7441d351ceff84dab95da44b
            <Box
              as={Link}
              to="/"
              display="flex"
              alignItems="center"
<<<<<<< HEAD
              gap={3}
              _hover={{ textDecoration: "none" }}
            >
              <Box
                p="3px"
                borderRadius="xl" 
                bg="linear-gradient(135deg, #E91E8C, #039BE5)"
              >
=======
              gap={2}
              _hover={{ textDecoration: "none" }}
              onClick={() => setOpen(false)}
            >
              <Box p="3px" borderRadius="xl" bg="linear-gradient(135deg, #E91E8C, #039BE5)">
>>>>>>> 1f7908aaed02400d7441d351ceff84dab95da44b
                <Box bg="white" borderRadius="lg" p="2px">
                  <Box
                    as="img"
                    src={selektup}
<<<<<<< HEAD
                    h={{ base: "45px", md: "60px" }}
=======
                    h={{ base: "38px", md: "50px", lg: "60px" }}
>>>>>>> 1f7908aaed02400d7441d351ceff84dab95da44b
                    alt="SeleKtUp"
                  />
                </Box>
              </Box>
<<<<<<< HEAD

              <Box>
                <Text
                  fontWeight="900"
                  fontSize={{ base: "xl", md: "2xl" }}
=======
              <Box>
                <Text
                  fontWeight="900"
                  fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
>>>>>>> 1f7908aaed02400d7441d351ceff84dab95da44b
                  letterSpacing="-0.5px"
                >
                  <span style={{ color: "#1E63B5" }}>SeleKt</span>
                  <span style={{ color: "#E91E8C" }}>Up</span>
                </Text>
<<<<<<< HEAD

                <Text
                  fontSize="10px"
                  fontWeight="800"
                  color="gray.500"
                  letterSpacing="0.1em"
                >
=======
                <Text fontSize="9px" fontWeight="800" color="gray.500" letterSpacing="0.1em">
>>>>>>> 1f7908aaed02400d7441d351ceff84dab95da44b
                  Curated by intelligence
                </Text>
              </Box>
            </Box>

<<<<<<< HEAD
            <HStack gap={4} display={{ base: "none", lg: "flex" }}>
=======
            {/* Desktop nav links */}
            <HStack gap={1} display={{ base: "none", lg: "flex" }}>
>>>>>>> 1f7908aaed02400d7441d351ceff84dab95da44b
              {NAV_LINKS.map((link) =>
                ROUTE_PATHS[link] ? (
                  <Box
                    as={Link}
                    to={ROUTE_PATHS[link]}
                    key={link}
                    px={3}
                    py={2}
                    borderRadius="md"
                    fontWeight={600}
<<<<<<< HEAD
                    color={pathname === ROUTE_PATHS[link] ? "#E91E8C" : "#1a1a2e"}
                    bg={pathname === ROUTE_PATHS[link] ? "pink.50" : "transparent"}
                    // borderBottom={pathname === ROUTE_PATHS[link] ? "2px solid #E91E8C" : "2px solid transparent"}
                    // _hover={{
                    //   color: "#E91E8C",
                    //   bg: "pink.50",
                    // }}
=======
                    fontSize="sm"
                    color={pathname === ROUTE_PATHS[link] ? "#E91E8C" : "#1a1a2e"}
                    bg={pathname === ROUTE_PATHS[link] ? "pink.50" : "transparent"}
                    _hover={{ color: "#E91E8C", bg: "pink.50", textDecoration: "none" }}
>>>>>>> 1f7908aaed02400d7441d351ceff84dab95da44b
                  >
                    {link}
                  </Box>
                ) : link === "Study Materials" ? (
                  <Box key={link} position="relative">
                    <HStack
                      gap={1}
                      px={3}
                      py={2}
                      borderRadius="md"
                      fontWeight={600}
<<<<<<< HEAD
                      cursor="pointer"
                      color="#1a1a2e"
                      _hover={{ color: "#E91E8C", bg: "pink.50" }}
                      transition="all 0.2s"
                      onClick={() => setStudyOpen(o => !o)}
=======
                      fontSize="sm"
                      cursor="pointer"
                      color="#1a1a2e"
                      _hover={{ color: "#E91E8C", bg: "pink.50" }}
                      onClick={() => setStudyOpen((o) => !o)}
>>>>>>> 1f7908aaed02400d7441d351ceff84dab95da44b
                    >
                      <Text>{link}</Text>
                      <FaChevronDown
                        size={11}
                        style={{
                          transform: studyOpen ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.2s",
                        }}
                      />
                    </HStack>
<<<<<<< HEAD

=======
>>>>>>> 1f7908aaed02400d7441d351ceff84dab95da44b
                    {studyOpen && (
                      <Box
                        position="absolute"
                        top="100%"
                        left={0}
                        mt={1}
                        bg="white"
                        boxShadow="0 8px 24px rgba(0,0,0,0.12)"
                        borderRadius="lg"
                        border="1px solid"
                        borderColor="gray.100"
                        minW="160px"
                        zIndex={2000}
                        overflow="hidden"
                        onMouseLeave={() => setStudyOpen(false)}
                      >
                        {STUDY_MATERIAL_LINKS.map((item) => (
                          <HStack
                            key={item.label}
                            as="a"
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            gap={3}
                            px={4}
                            py={3}
                            color={item.color}
                            fontWeight={600}
                            fontSize="sm"
                            _hover={{ bg: "gray.50", textDecoration: "none" }}
                            onClick={() => setStudyOpen(false)}
                          >
                            <item.icon size={16} />
                            <Text>{item.label}</Text>
                          </HStack>
                        ))}
                      </Box>
                    )}
                  </Box>
<<<<<<< HEAD
                ) : (
                  <Box key={link}>{link}</Box>
                )
              )}
            </HStack>

            {!enquirySubmitted && (
              <HStack gap={3} display={{ base: "none", md: "flex" }}>
                <Button
                  size="sm"
                  variant="outline"
                  borderColor="#039BE5"
                  color="#039BE5"
                  onClick={() => {
                    const hasRegistered = localStorage.getItem('selektup_has_registered') === 'true'
                    navigate(hasRegistered ? '/login' : '/register')
                  }}
                >
                  Students Login
                </Button>

                <Button size="sm" bg="#E91E8C" color="white">
                  Enroll
                </Button>
              </HStack>
            )}

            <Box
              display={{ base: "block", lg: "none" }}
              onClick={() => setOpen(!open)}
              cursor="pointer"
            >
              {open ? <FaTimes /> : <FaBars />}
            </Box>
          </Flex>

          {open && (
            <Stack mt={4} display={{ lg: "none" }}>
              {NAV_LINKS.map((link) =>
                ROUTE_PATHS[link] ? (
                  <Box
                    as={Link}
                    to={ROUTE_PATHS[link]}
                    key={link}
                    py={2}
                    px={2}
                    borderRadius="md"
                    fontWeight={600}
                    color={pathname === ROUTE_PATHS[link] ? "#E91E8C" : "#1a1a2e"}
                    bg={pathname === ROUTE_PATHS[link] ? "pink.50" : "transparent"}
                    borderLeft={pathname === ROUTE_PATHS[link] ? "3px solid #E91E8C" : "3px solid transparent"}
                    onClick={() => setOpen(false)}
                  >
                    {link}
                  </Box>
                ) : link === "Study Materials" ? (
                  <Box key={link}>
                    <HStack
                      gap={1}
                      py={2}
                      fontWeight={600}
                      cursor="pointer"
                      onClick={() => setMobileStudyOpen(o => !o)}
                      borderBottom="1px solid"
                      borderColor="gray.100"
                    >
                      <Text>{link}</Text>
                      <FaChevronDown
                        size={11}
                        style={{
                          transform: mobileStudyOpen ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.2s",
                        }}
                      />
                    </HStack>
                    {mobileStudyOpen && (
                      <Stack pl={4} pt={1} pb={2} gap={2}>
                        {STUDY_MATERIAL_LINKS.map((item) => (
                          <HStack
                            key={item.label}
                            as="a"
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            gap={2}
                            py={1}
                            color={item.color}
                            fontWeight={600}
                            fontSize="sm"
                            _hover={{ textDecoration: "none" }}
                            onClick={() => setOpen(false)}
                          >
                            <item.icon size={14} />
                            <Text>{item.label}</Text>
                          </HStack>
                        ))}
                      </Stack>
                    )}
                  </Box>
                ) : (
                  <Box key={link}>{link}</Box>
                )
              )}
            </Stack>
=======
                ) : null
              )}
            </HStack>

            {/* Desktop CTA buttons */}
            <HStack gap={3} display={{ base: "none", lg: "flex" }}>
              {loggedIn ? (
                <>
                  <Button as={Link} to="/dashboard" size="sm" bg="#039BE5" color="white" _hover={{ bg: "#0284C7" }}>
                    Dashboard
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <Button as={Link} to="/login" size="sm" bg="#039BE5" color="white" _hover={{ bg: "#0284C7" }}>
                  Students Login
                </Button>
              )}
              {!enquirySubmitted && (
                <Button size="sm" bg="#E91E8C" color="white">
                  Enroll
                </Button>
              )}
            </HStack>

            {/* Hamburger — mobile/tablet only */}
            <Box
              display={{ base: "flex", lg: "none" }}
              alignItems="center"
              justifyContent="center"
              w="44px"
              h="44px"
              borderRadius="md"
              cursor="pointer"
              color="#1a1a2e"
              _hover={{ bg: "gray.100" }}
              onClick={() => setOpen(!open)}
            >
              {open ? <FaTimes size={22} /> : <FaBars size={22} />}
            </Box>
          </Flex>

          {/* Mobile/tablet dropdown menu */}
          {open && (
            <Box borderTop="1px solid" borderColor="gray.100" mt={3} pt={2} pb={4}>
              <Stack gap={1}>
                {NAV_LINKS.map((link) =>
                  ROUTE_PATHS[link] ? (
                    <Box
                      as={Link}
                      to={ROUTE_PATHS[link]}
                      key={link}
                      py={3}
                      px={4}
                      borderRadius="md"
                      fontWeight={600}
                      fontSize="sm"
                      color={pathname === ROUTE_PATHS[link] ? "#E91E8C" : "#1a1a2e"}
                      bg={pathname === ROUTE_PATHS[link] ? "pink.50" : "transparent"}
                      borderLeft={
                        pathname === ROUTE_PATHS[link]
                          ? "3px solid #E91E8C"
                          : "3px solid transparent"
                      }
                      _hover={{ bg: "gray.50", textDecoration: "none" }}
                      onClick={() => setOpen(false)}
                    >
                      {link}
                    </Box>
                  ) : link === "Study Materials" ? (
                    <Box key={link}>
                      <Flex
                        align="center"
                        justify="space-between"
                        py={3}
                        px={4}
                        borderRadius="md"
                        fontWeight={600}
                        fontSize="sm"
                        cursor="pointer"
                        color="#1a1a2e"
                        _hover={{ bg: "gray.50" }}
                        onClick={() => setMobileStudyOpen((o) => !o)}
                      >
                        <Text>{link}</Text>
                        <FaChevronDown
                          size={12}
                          style={{
                            transform: mobileStudyOpen ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.2s",
                          }}
                        />
                      </Flex>
                      {mobileStudyOpen && (
                        <Stack pl={4} gap={1} pb={1}>
                          {STUDY_MATERIAL_LINKS.map((item) => (
                            <HStack
                              key={item.label}
                              as="a"
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              gap={3}
                              py={2}
                              px={4}
                              borderRadius="md"
                              color={item.color}
                              fontWeight={600}
                              fontSize="sm"
                              _hover={{ bg: "gray.50", textDecoration: "none" }}
                              onClick={() => setOpen(false)}
                            >
                              <item.icon size={16} />
                              <Text>{item.label}</Text>
                            </HStack>
                          ))}
                        </Stack>
                      )}
                    </Box>
                  ) : null
                )}

                <HStack gap={3} pt={3} mt={1} borderTop="1px solid" borderColor="gray.100">
                  {loggedIn ? (
                    <>
                      <Button
                        as={Link}
                        to="/dashboard"
                        size="sm"
                        flex={1}
                        bg="#039BE5"
                        color="white"
                        _hover={{ bg: "#0284C7" }}
                        onClick={() => setOpen(false)}
                      >
                        Dashboard
                      </Button>
                      <Button
                        size="sm"
                        flex={1}
                        variant="outline"
                        onClick={() => {
                          handleLogout();
                          setOpen(false);
                        }}
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <Button
                      as={Link}
                      to="/login"
                      size="sm"
                      flex={1}
                      bg="#039BE5"
                      color="white"
                      _hover={{ bg: "#0284C7" }}
                      onClick={() => setOpen(false)}
                    >
                      Students Login
                    </Button>
                  )}
                  {!enquirySubmitted && (
                    <Button
                      size="sm"
                      flex={1}
                      bg="#E91E8C"
                      color="white"
                      onClick={() => setOpen(false)}
                    >
                      Enroll
                    </Button>
                  )}
                </HStack>
              </Stack>
            </Box>
>>>>>>> 1f7908aaed02400d7441d351ceff84dab95da44b
          )}
        </Container>
      </Box>
    </>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 1f7908aaed02400d7441d351ceff84dab95da44b

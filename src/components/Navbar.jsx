import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
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

const ROUTE_PATHS = {
  Home: "/",
  "About Us": "/about",
  Courses: "/courses",
  Contact: "/contact",
};

const STUDY_MATERIAL_LINKS = [
  { label: "Telegram", icon: FaTelegram, href: "https://t.me/selektup", color: "#0088cc" },
  { label: "YouTube", icon: FaYoutube, href: "https://www.youtube.com/@selektup", color: "#FF0000" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [studyOpen, setStudyOpen] = useState(false);
  const [mobileStudyOpen, setMobileStudyOpen] = useState(false);
  const enquirySubmitted = localStorage.getItem('enquirySubmitted') === 'true';

  return (
    <>
      <Box bg="#0C1222" color="white" py={2}>
        <Container maxW="7xl">
          <Flex justify="space-between" align="center" >
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

            <HStack gap={3}>
              {[
                { icon: FaFacebook, href: 'https://facebook.com/profile.php?id=61585841854078' },
                { icon: FaYoutube, href: 'https://www.youtube.com/@SeleKtUp' },
                { icon: FaInstagram, href: 'https://instagram.com/selektup/' },

              ].map((item, i) => (
                <Box
                  key={i}
                  as="a"
                  href={item.href}
                  target={item.href !== '#' ? '_blank' : undefined}
                  rel={item.href !== '#' ? 'noopener noreferrer' : undefined}
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

      <Box  bg="white" boxShadow="sm" position="sticky" top="0" zIndex="1000">
        <Container maxW="7xl" py={3}>
          <Flex align="center" justify="space-between">
            
            <Box
              as={Link}
              to="/"
              display="flex"
              alignItems="center"
              gap={3}
              _hover={{ textDecoration: "none" }}
            >
              <Box
                p="3px"
                borderRadius="xl" 
                bg="linear-gradient(135deg, #E91E8C, #039BE5)"
              >
                <Box bg="white" borderRadius="lg" p="2px">
                  <Box
                    as="img"
                    src={selektup}
                    h={{ base: "45px", md: "60px" }}
                    alt="SeleKtUp"
                  />
                </Box>
              </Box>

              <Box>
                <Text
                  fontWeight="900"
                  fontSize={{ base: "xl", md: "2xl" }}
                  letterSpacing="-0.5px"
                >
                  <span style={{ color: "#1E63B5" }}>SeleKt</span>
                  <span style={{ color: "#E91E8C" }}>Up</span>
                </Text>

                <Text
                  fontSize="10px"
                  fontWeight="800"
                  color="gray.500"
                  letterSpacing="0.1em"
                >
                  Curated by intelligence
                </Text>
              </Box>
            </Box>

            <HStack gap={4} display={{ base: "none", lg: "flex" }}>
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
                    color={pathname === ROUTE_PATHS[link] ? "#E91E8C" : "#1a1a2e"}
                    bg={pathname === ROUTE_PATHS[link] ? "pink.50" : "transparent"}
                    // borderBottom={pathname === ROUTE_PATHS[link] ? "2px solid #E91E8C" : "2px solid transparent"}
                    // _hover={{
                    //   color: "#E91E8C",
                    //   bg: "pink.50",
                    // }}
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
                      cursor="pointer"
                      color="#1a1a2e"
                      _hover={{ color: "#E91E8C", bg: "pink.50" }}
                      transition="all 0.2s"
                      onClick={() => setStudyOpen(o => !o)}
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
          )}
        </Container>
      </Box>
    </>
  );
}
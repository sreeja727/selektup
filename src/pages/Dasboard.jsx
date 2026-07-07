import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  Progress,
  SimpleGrid,
  Stat,
  Text,
  VStack,
} from "@chakra-ui/react";

import {
  FaBookOpen,
  FaClipboardList,
  FaUserGraduate,
  FaPlayCircle,
} from "react-icons/fa";

export default function Dashboard() {
  return (
    <Box bg="gray.100" minH="100vh" py={10}>
      <Container maxW="7xl">

        {/* Welcome Section */}
        <Flex
          bg="white"
          p={8}
          rounded="xl"
          shadow="md"
          justify="space-between"
          align="center"
          mb={8}
        >
          <Box>
            <Heading size="lg">Welcome 👋</Heading>
            <Text mt={2} color="gray.600">
              Ready for today's preparation?
            </Text>
          </Box>

          <Button colorPalette="blue">
            View Profile
          </Button>
        </Flex>

        {/* Statistics */}

        <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} mb={8}>

          <Stat.Root bg="white" p={6} rounded="xl" shadow="md">
            <HStack mb={3}>
              <Icon color="blue.500" boxSize={6}><FaBookOpen /></Icon>
              <Stat.Label>Purchased Courses</Stat.Label>
            </HStack>

            <Stat.ValueText>1</Stat.ValueText>
          </Stat.Root>

          <Stat.Root bg="white" p={6} rounded="xl" shadow="md">
            <HStack mb={3}>
              <Icon color="green.500" boxSize={6}><FaClipboardList /></Icon>
              <Stat.Label>Mock Tests</Stat.Label>
            </HStack>

            <Stat.ValueText>15</Stat.ValueText>
          </Stat.Root>

          <Stat.Root bg="white" p={6} rounded="xl" shadow="md">
            <HStack mb={3}>
              <Icon color="orange.400" boxSize={6}><FaUserGraduate /></Icon>
              <Stat.Label>Completed</Stat.Label>
            </HStack>

            <Stat.ValueText>8</Stat.ValueText>
          </Stat.Root>

        </SimpleGrid>

        {/* Main Section */}

        <Grid
          templateColumns={{ base: "1fr", lg: "2fr 1fr" }}
          gap={8}
        >

          {/* Left */}

          <GridItem>

            <Box bg="white" p={6} rounded="xl" shadow="md">

              <Heading size="md" mb={6}>
                Available Mock Tests
              </Heading>

              <VStack gap={5} align="stretch">

                {[1, 2, 3].map((test) => (

                  <Flex
                    key={test}
                    justify="space-between"
                    align="center"
                    border="1px solid"
                    borderColor="gray.200"
                    rounded="lg"
                    p={5}
                  >
                    <Box>
                      <Heading size="sm">
                        UPSC Mock Test {test}
                      </Heading>

                      <Text color="gray.500" mt={1}>
                        100 Questions • 90 Minutes
                      </Text>
                    </Box>

                    <Button colorPalette="blue">
                      <FaPlayCircle />
                      Start
                    </Button>

                  </Flex>

                ))}

              </VStack>

            </Box>

          </GridItem>

          {/* Right */}

          <GridItem>

            <Box bg="white" p={6} rounded="xl" shadow="md">

              <Heading size="md" mb={5}>
                Progress
              </Heading>

              <Text mb={2}>Course Completion</Text>

              <Progress.Root value={65} colorPalette="green" rounded="full" mb={6}>
                <Progress.Track>
                  <Progress.Range />
                </Progress.Track>
              </Progress.Root>

              <Text color="gray.600">
                65% Completed
              </Text>

              <Button
                mt={8}
                colorPalette="teal"
                w="full"
              >
                Continue Learning
              </Button>

            </Box>

          </GridItem>

        </Grid>

      </Container>
    </Box>
  );
}
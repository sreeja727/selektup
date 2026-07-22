import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  BookOpen,
  ClipboardList,
  Users,
} from "lucide-react";

const ACCENTS = {
  blue: { fg: "#039BE5", bg: "rgba(3,155,229,0.1)" },
  pink: { fg: "#E91E8C", bg: "rgba(233,30,140,0.1)" },
};

const dashboardCards = [
  {
    title: "Test Series",
    value: "12",
    icon: BookOpen,
    accent: "blue",
  },
  {
    title: "Mock Tests",
    value: "48",
    icon: ClipboardList,
    accent: "pink",
  },
  {
    title: "Students",
    value: "1,240",
    icon: Users,
    accent: "blue",
  },
];

export default function Dashboard() {
  return (
    <Box>
      <Heading mb={8} color="#0C1222">Admin Dashboard</Heading>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={6}>
        {dashboardCards.map((card) => {
          const Icon = card.icon;
          const accent = ACCENTS[card.accent];

          return (
            <Box
              key={card.title}
              bg="white"
              p={6}
              borderRadius="xl"
              boxShadow="md"
              border="1px solid"
              borderColor="gray.100"
              transition="all 0.2s"
              _hover={{ boxShadow: "0 10px 28px rgba(12,18,34,0.1)", transform: "translateY(-2px)" }}
            >
              <VStack align="start" gap={3}>
                <Box
                  p={3}
                  borderRadius="lg"
                  bg={accent.bg}
                  color={accent.fg}
                  display="flex"
                >
                  <Icon size={24} />
                </Box>

                <Text color="gray.500" fontWeight={600} fontSize="sm">
                  {card.title}
                </Text>

                <Heading size="lg" color="#0C1222">
                  {card.value}
                </Heading>
              </VStack>
            </Box>
          );
        })}
      </SimpleGrid>
    </Box>
  );
}

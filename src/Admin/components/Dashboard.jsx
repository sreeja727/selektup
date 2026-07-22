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
  CreditCard,} from "lucide-react";

const dashboardCards = [
  {
    title: "Test Series",
    value: "12",
    icon: BookOpen,
  },
  {
    title: "Mock Tests",
    value: "48",
    icon: ClipboardList,
  },
  {
    title: "Students",
    value: "1,240",
    icon: Users,
  },
  {
    title: "Payments",
    value: "₹2.4L",
    icon: CreditCard,
  },
];

export default function Dashboard() {
  return (
    <Box>
      <Heading mb={8}>Admin Dashboard</Heading>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} gap={6}>
        {dashboardCards.map((card) => {
          const Icon = card.icon;

          return (
            <Box
              key={card.title}
              bg="white"
              p={6}
              borderRadius="xl"
              boxShadow="md"
            >
              <VStack align="start" spacing={3}>
                <Icon size={28} color="#2563EB" />

                <Text color="gray.500">
                  {card.title}
                </Text>

                <Heading size="lg">
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
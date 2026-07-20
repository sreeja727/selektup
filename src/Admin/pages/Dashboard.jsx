import {
  Heading,
  SimpleGrid,
  Box,
  Text,
} from "@chakra-ui/react";

const cards = [
  {
    title: "Test Series",
    value: 12,
  },
  {
    title: "Mock Tests",
    value: 56,
  },
  {
    title: "Students",
    value: 128,
  },
  {
    title: "Payments",
    value: "₹54,000",
  },
];

export default function Dashboard() {
  return (
    <>
      <Heading mb={8}>
        Dashboard
      </Heading>

      <SimpleGrid
        columns={{
          base: 1,
          md: 2,
          lg: 4,
        }}
        spacing={6}
      >
        {cards.map((card) => (
          <Box
            key={card.title}
            bg="white"
            p={6}
            rounded="xl"
            shadow="md"
          >
            <Text color="gray.500">
              {card.title}
            </Text>

            <Heading mt={2}>
              {card.value}
            </Heading>
          </Box>
        ))}
      </SimpleGrid>
    </>
  );
}
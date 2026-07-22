import { Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function Breadcrumb({ items = [] }) {
  return (
    <Flex align="center" gap={1} mb={4} fontSize="sm" wrap="wrap">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <Flex key={`${item.label}-${index}`} align="center" gap={1}>
            {index > 0 && <ChevronRight size={14} color="#A0AEC0" />}
            {isLast || !item.to ? (
              <Text color={isLast ? "#0C1222" : "gray.500"} fontWeight={isLast ? 600 : 500}>
                {item.label}
              </Text>
            ) : (
              <Text
                as={Link}
                to={item.to}
                color="gray.500"
                fontWeight={500}
                _hover={{ color: "#039BE5", textDecoration: "underline" }}
              >
                {item.label}
              </Text>
            )}
          </Flex>
        );
      })}
    </Flex>
  );
}

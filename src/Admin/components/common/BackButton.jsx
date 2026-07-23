import { Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ to, label = "Back" }) {
  const navigate = useNavigate();

  return (
    <Flex
      as="button"
      align="center"
      gap={2}
      color="#039BE5"
      fontWeight={600}
      fontSize="sm"
      mb={6}
      onClick={() => (to ? navigate(to) : navigate(-1))}
    >
      <ArrowLeft size={16} />
      {label}
    </Flex>
  );
}

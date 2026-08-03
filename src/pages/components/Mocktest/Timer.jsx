import { HStack, Text } from "@chakra-ui/react";
import { FaClock } from "react-icons/fa";
import { useEffect, useState } from "react";

const WARNING_THRESHOLD = 300; // 5 minutes
const CRITICAL_THRESHOLD = 60; // 1 minute

export default function Timer({ duration = 7200, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onTimeUp) onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const isCritical = timeLeft <= CRITICAL_THRESHOLD;
  const isWarning = timeLeft <= WARNING_THRESHOLD;
  const bg = isCritical ? "#D32F2F" : isWarning ? "#E65100" : "#0C1222";

  return (
    <HStack
      gap={2}
      bg={bg}
      color="white"
      px={5}
      py={2.5}
      borderRadius="lg"
      boxShadow="0 2px 10px rgba(0,0,0,0.12)"
      animation={isCritical ? "pulse 1s ease-in-out infinite" : undefined}
      css={{
        "@keyframes pulse": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.6 },
        },
      }}
    >
      <FaClock size={14} />
      <Text
        fontWeight={800}
        fontSize="lg"
        fontFamily="mono"
        letterSpacing="0.02em"
      >
        {String(hours).padStart(2, "0")}:
        {String(minutes).padStart(2, "0")}:
        {String(seconds).padStart(2, "0")}
      </Text>
    </HStack>
  );
}

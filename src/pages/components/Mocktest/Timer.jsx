import { HStack, Text } from "@chakra-ui/react";
import { FaClock } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";

const WARNING_THRESHOLD = 300; // 5 minutes
const CRITICAL_THRESHOLD = 60; // 1 minute

function remainingSeconds(endTime) {
  if (!endTime) return null;
  return Math.max(0, Math.round((endTime - Date.now()) / 1000));
}

// `endTime` is an absolute timestamp (ms since epoch), not a duration — the
// caller anchors it once (and persists it across refreshes), so remaining
// time is always recomputed from the wall clock rather than decremented in
// React state. That avoids both timer drift (a decrementing setInterval
// tends to lose a few ms per tick) and the countdown silently resetting to
// the full duration on every page refresh.
export default function Timer({ endTime, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(() => remainingSeconds(endTime));
  const onTimeUpRef = useRef(onTimeUp);
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  // endTime is set exactly once by the caller (before this component ever
  // mounts with a real value — see TestScreen's render-time adjustment), so
  // the lazy useState initializer above already has the correct starting
  // value; this effect only needs to run the ongoing tick.
  useEffect(() => {
    if (!endTime) return undefined;

    let firedTimeUp = false;
    const interval = setInterval(() => {
      const remaining = remainingSeconds(endTime);
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        if (!firedTimeUp) {
          firedTimeUp = true;
          if (onTimeUpRef.current) onTimeUpRef.current();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  if (timeLeft == null) {
    return (
      <HStack gap={{ base: 1.5, md: 2 }} bg="#0C1222" color="white" px={{ base: 3, md: 5 }} py={{ base: 2, md: 2.5 }} borderRadius="lg" boxShadow="0 2px 10px rgba(0,0,0,0.12)">
        <FaClock size={14} />
        <Text fontWeight={800} fontSize={{ base: "sm", md: "lg" }} fontFamily="mono" letterSpacing="0.02em">
          --:--:--
        </Text>
      </HStack>
    );
  }

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const isCritical = timeLeft <= CRITICAL_THRESHOLD;
  const isWarning = timeLeft <= WARNING_THRESHOLD;
  const bg = isCritical ? "#D32F2F" : isWarning ? "#E65100" : "#0C1222";

  return (
    <HStack
      gap={{ base: 1.5, md: 2 }}
      bg={bg}
      color="white"
      px={{ base: 3, md: 5 }}
      py={{ base: 2, md: 2.5 }}
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
        fontSize={{ base: "sm", md: "lg" }}
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

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams, Link as RouterLink } from "react-router-dom";
import { Box, Button, Field, Heading, Input, InputGroup, Stack, Text, Link } from "@chakra-ui/react";
import { LuEye, LuEyeOff, LuUser, LuMail, LuLock } from "react-icons/lu";
import { registerUser } from "../../utils/auth";
import { register } from "../actions";
import { getCommonConfigSelector } from "../common/selectors";

export default function Register() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");
  const { apiLoading, customToast } = useSelector(getCommonConfigSelector);
  const apiError = customToast?.open && customToast?.variant === "error" ? customToast.message : "";

  function handleRegister() {
    setError("");
    if (!name || !identifier || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    dispatch(register({ fullName: name, emailOrMobile: identifier, password }));
    const result = registerUser({ name, identifier, password });
    if (!result.success) {
      setError(result.error);
      return;
    }
    navigate(`/login${redirect ? `?redirect=${redirect}` : ""}`, {
      state: { registered: true },
    });
  }

  return (
    <Box
      minH="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bg="gray.50"
      px={4}
    >
      <Box
        bg="white"
        w={{ base: "100%", md: "450px" }}
        p={10}
        borderRadius="xl"
        boxShadow="lg"
        border="1px solid"
        borderColor="gray.100"
      >
        <Stack gap={6}>
          <Box textAlign="center">
            <Heading size="2xl" letterSpacing="-0.5px">
              <span style={{ color: "#1E63B5" }}>SeleKt</span>
              <span style={{ color: "#E91E8C" }}>Up</span>
            </Heading>

            <Text mt={2} color="gray.600" fontWeight="medium">
              Create Your Account 🎓
            </Text>

            <Text color="gray.500">
              Register to access mock tests
            </Text>
          </Box>

          <Field.Root>
            <Field.Label>Full Name</Field.Label>

            <InputGroup startElement={<LuUser color="#039BE5" />}>
              <Input
                placeholder="Enter Full Name"
                size="lg"
                borderRadius="md"
                focusRingColor="#039BE5"
                _hover={{ borderColor: "#039BE5" }}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </InputGroup>
          </Field.Root>

          <Field.Root>
            <Field.Label>Email / Mobile Number</Field.Label>

            <InputGroup startElement={<LuMail color="#039BE5" />}>
              <Input
                placeholder="Enter Email or Mobile Number"
                size="lg"
                borderRadius="md"
                focusRingColor="#039BE5"
                _hover={{ borderColor: "#039BE5" }}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </InputGroup>
          </Field.Root>

          <Field.Root>
            <Field.Label>Password</Field.Label>

            <InputGroup
              startElement={<LuLock color="#039BE5" />}
              endElement={
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShow(!show)}
                >
                  {show ? <LuEyeOff /> : <LuEye />}
                </Button>
              }
            >
              <Input
                type={show ? "text" : "password"}
                placeholder="Create a Password"
                size="lg"
                borderRadius="md"
                focusRingColor="#039BE5"
                _hover={{ borderColor: "#039BE5" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </InputGroup>
          </Field.Root>

          {(error || apiError) && (
            <Text fontSize="sm" color="red.500" textAlign="center">
              {error || apiError}
            </Text>
          )}

          <Button
            size="lg"
            borderRadius="md"
            bg="#E91E8C"
            color="white"
            fontWeight="bold"
            transition="background 0.2s ease"
            _hover={{ bg: "#c8177a" }}
            onClick={handleRegister}
            loading={apiLoading}
            disabled={apiLoading}
          >
            Register
          </Button>

          <Text
            fontSize="sm"
            color="gray.500"
            textAlign="center"
          >
            Already have an account?{" "}
            <Link
              as={RouterLink}
              to={`/login${redirect ? `?redirect=${redirect}` : ""}`}
              color="#039BE5"
              fontWeight="medium"
              _hover={{ color: "#E91E8C", textDecoration: "underline" }}
            >
              Login
            </Link>
          </Text>
        </Stack>
      </Box>
    </Box>
  );
}

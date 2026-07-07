import { useState } from "react";
import { useNavigate, useSearchParams, Link as RouterLink } from "react-router-dom";
import {Box,Button,Field,Heading,Input,InputGroup,Stack,Text,Link,Checkbox,} from "@chakra-ui/react";
import { LuEye, LuEyeOff, LuUser, LuLock } from "react-icons/lu";
import { loginUser } from "../utils/auth";

export default function Login() {
  const [show, setShow] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  function handleLogin() {
    if (!identifier || !password) return;
    loginUser({ identifier });
    navigate(searchParams.get("redirect") || "/dashboard");
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
              Welcome Back 👋
            </Text>

            <Text color="gray.500">
              Login to continue 
            </Text>
          </Box>

          <Field.Root>
            <Field.Label>Email / Mobile Number</Field.Label>

            <InputGroup startElement={<LuUser color="#039BE5" />}>
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
                placeholder="Enter Password"
                size="lg"
                borderRadius="md"
                focusRingColor="#039BE5"
                _hover={{ borderColor: "#039BE5" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </InputGroup>
          </Field.Root>

          <Checkbox.Root>
            <Checkbox.HiddenInput />
            <Checkbox.Control borderColor="gray.300" _checked={{ bg: "#039BE5", borderColor: "#039BE5" }} />
            <Checkbox.Label>
              Remember Me
            </Checkbox.Label>
          </Checkbox.Root>

          <Button
            size="lg"
            borderRadius="md"
            bg="#039BE5"
            color="white"
            fontWeight="bold"
            transition="background 0.2s ease"
            _hover={{ bg: "#0284C7" }}
            onClick={handleLogin}
          >
            Login
          </Button>

          <Box textAlign="center">
            <Link
              color="#039BE5"
              fontWeight="medium"
              href="#"
              _hover={{ color: "#E91E8C", textDecoration: "underline" }}
            >
              Forgot Password?
            </Link>
          </Box>

          <Text
            fontSize="sm"
            color="gray.500"
            textAlign="center"
          >
            New here?{" "}
            <Link
              as={RouterLink}
              to={`/register${searchParams.get("redirect") ? `?redirect=${searchParams.get("redirect")}` : ""}`}
              color="#039BE5"
              fontWeight="medium"
              _hover={{ color: "#E91E8C", textDecoration: "underline" }}
            >
              Create an account
            </Link>
          </Text>

          <Text
            fontSize="sm"
            color="gray.500"
            textAlign="center"
          >
            Need Help? Contact Administrator
          </Text>
        </Stack>
      </Box>
    </Box>
  );
}
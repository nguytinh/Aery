"use client";

import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  return (
    <Center minH="100vh" bg="white">
      <Box 
        w="full" 
        maxW="md" 
        p={8} 
        borderRadius="xl" 
        boxShadow="2xl" 
        bg="white"
        border="1px"
        borderColor="gray.100"
      >
        <VStack spacing={6}>
          <Heading 
            as="h2" 
            size="xl" 
            color="black"
            fontWeight="bold"
            letterSpacing="tight"
          >
            Forgot Password
          </Heading>
          <Text 
            color="gray.600" 
            textAlign="center"
            fontSize="md"
          >
            Enter your email address below to receive a password reset link.
          </Text>
          {showAlert && (
            <Alert 
              status="success" 
              variant="subtle" 
              borderRadius="lg"
              bg="black"
              color="white"
            >
              <AlertIcon color="white" />
              <Box>
                <AlertTitle fontWeight="bold">Password reset link sent!</AlertTitle>
                <AlertDescription>Check your email for instructions.</AlertDescription>
              </Box>
            </Alert>
          )}
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <FormControl id="email" isRequired>
              <FormLabel 
                color="black"
                fontSize="sm"
                fontWeight="medium"
              >
                Email address
              </FormLabel>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="lg"
                borderColor="gray.200"
                _hover={{
                  borderColor: "gray.300"
                }}
                _focus={{
                  borderColor: "black",
                  boxShadow: "none"
                }}
                bg="white"
              />
            </FormControl>
            <Button 
              type="submit" 
              width="full" 
              mt={6}
              bg="black"
              color="white"
              size="lg"
              _hover={{
                bg: "gray.800"
              }}
              _active={{
                bg: "gray.900"
              }}
              letterSpacing="wide"
            >
              Send Reset Link
            </Button>
          </form>
        </VStack>
      </Box>
    </Center>
  );
}
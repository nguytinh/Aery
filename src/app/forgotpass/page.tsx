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
    <Center 
      minH="100vh" 
      style={{
        background: `url('https://images.pexels.com/photos/19727169/pexels-photo-19727169/free-photo-of-a-view-of-a-snowy-mountain-range-with-a-ski-slope.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2') center/cover no-repeat fixed`
      }}
    >
      <Box 
        w="full" 
        maxW="md" 
        p={8} 
        borderRadius="xl" 
        boxShadow="2xl" 
        bg="rgba(255, 255, 255, 0.9)"
        border="1px"
        borderColor="blue.100"
      >
        <VStack spacing={6}>
          <Heading 
            as="h2" 
            size="xl" 
            color="blue.600"
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
              bg="blue.400"
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
                color="blue.700"
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
                borderColor="blue.200"
                _hover={{
                  borderColor: "blue.300"
                }}
                _focus={{
                  borderColor: "blue.400",
                  boxShadow: "none"
                }}
                bg="white"
              />
            </FormControl>
            <Button 
              type="submit" 
              width="full" 
              mt={6}
              bg="blue.400"
              color="white"
              size="lg"
              _hover={{
                bg: "blue.500"
              }}
              _active={{
                bg: "blue.600"
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
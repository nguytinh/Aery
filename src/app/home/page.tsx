'use client'

// HomePage.tsx
import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import Navbar from '../../components/navbar';

const HomePage: React.FC = () => {
  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <Box as="main" pt="100px" textAlign="center">
        <VStack spacing={6} mx="auto" maxW="800px" py={10}>
          <Heading as="h1" size="2xl" color="black">
            Welcome to Aery
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Discover your next adventure with Aery, your one-stop platform for all things travel and exploration. 
            Let's make your journey unforgettable.
          </Text>
        </VStack>
      </Box>
    </>
  );
};

export default HomePage;

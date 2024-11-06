// Navbar.tsx
import { Box, Flex, Image, Link, HStack } from '@chakra-ui/react';
import NextLink from 'next/link';

const Navbar: React.FC = () => {
    return (
      <Box as="nav" bg="white" py={4} shadow="md" position="fixed" width="100%" zIndex="100">
        <Flex maxW="1200px" mx="auto" align="center" px={4} justify="center">
          {/* Links */}
          <HStack spacing={8}>
            <NextLink href="/home" passHref>
              <Link 
                color="gray.700" 
                fontWeight="semibold"
                _hover={{ 
                color: "blue.300",
                textDecoration: "none" 
              }}>Home</Link>
            </NextLink>
            <NextLink href="/services" passHref>
              <Link 
                color="gray.700" 
                fontWeight="semibold"
                _hover={{ 
                color: "blue.300",
                textDecoration: "none" 
              }}>Friends</Link>
            </NextLink>
  
            {/* Logo */}
            <NextLink href="/" passHref>
              <Link>
                <Image 
                  src="/assets/AeryLogo.jpg" 
                  alt="Logo" 
                  boxSize="65px"
                  mx={8} // Add more spacing around the logo
                />
              </Link>
            </NextLink>
  
            <NextLink href="/contact" passHref>
              <Link 
                color="gray.700" 
                fontWeight="semibold"
                _hover={{ 
                color: "blue.300",
                textDecoration: "none" 
              }}>Profile</Link>
            </NextLink>
            <NextLink href="/portfolio" passHref>
              <Link 
                color="gray.700" 
                fontWeight="semibold"
                _hover={{ 
                color: "blue.300",
                textDecoration: "none" 
              }}>Logout</Link>
            </NextLink>
          </HStack>
        </Flex>
      </Box>
    );
  };

export default Navbar;

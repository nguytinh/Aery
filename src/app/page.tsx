// app/page.tsx
'use client'

import { Box, SimpleGrid, Text, VStack, Heading } from "@chakra-ui/react";
import NextLink from "next/link";

export default function Page() {
    const pages = [
        { name: "Home", path: "/home", description: "Return to the main page" },
        { name: "About", path: "/about", description: "Learn more about us" },
        { name: "Profile", path: "/profile", description: "View your profile" },
        { name: "Login", path: "/login", description: "Sign in to your account" },
        { name: "Sign Up", path: "/signup", description: "Create a new account" },
        { name: "Forgot Password", path: "/forgotpass", description: "Reset your password" },
        { name: "other", path: "/other", description: "add page..." }
    ];

    return (
        <Box p={8} maxW="1200px" mx="auto">
            <VStack gap={8} mb={8} textAlign="center">
                <Heading size="xl" color="black">
                    Navigate to the page you&apos;re responsible for developing :D
                </Heading>
            </VStack>

            <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={6}>
                {pages.map((page) => (
                    <NextLink key={page.path} href={page.path} style={{ textDecoration: 'none' }}>
                        <Box
                            p={6}
                            bg="white"
                            boxShadow="lg"
                            borderRadius="lg"
                            transition="all 0.3s"
                            _hover={{
                                transform: "translateY(-4px)",
                                boxShadow: "xl",
                                bg: "gray.200"
                            }}
                            border="1px"
                            borderColor="gray.200"
                        >
                            <VStack gap={3} align="stretch">
                                <Heading size="md" color="black">
                                    {page.name}
                                </Heading>
                                <Text color="gray.600">
                                    {page.description}
                                </Text>
                            </VStack>
                        </Box>
                    </NextLink>
                ))}
            </SimpleGrid>
        </Box>
    );
}
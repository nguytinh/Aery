"use client";

import { ClientUser } from "@/app/interfaces/primsa"
import Navbar from "../../../components/navbar";
import {
    Box,
    Heading,
    Text,
    Grid,
    Image as ChakraImage,
    Center,
    VStack,
    HStack,
    Flex,
} from "@chakra-ui/react";

export default function UserProfile({ user }: { user: ClientUser | null }) {
    return (
        <>
            <Navbar />
            <Box mx="auto" p={6} bg="white" shadow="md" rounded="lg" paddingTop="120px">
                {!user && (
                    <Center>
                        <Text>Sorry, could not find this user!</Text>
                    </Center>
                )}
                {user && (
                    <>
                        <VStack align="center">
                            <ChakraImage
                                boxSize="128px"
                                borderRadius="full"
                                objectFit="cover"
                                src="https://xsgames.co/randomusers/avatar.php?g=pixel"
                                alt="Profile"
                            />
                            <Flex align="center">
                                <Heading as="h1" size="xl" mr={4}>
                                    {user.userName}
                                </Heading>
                            </Flex>

                            <HStack>
                                <Box textAlign="center">
                                    <Text fontSize="xl" fontWeight="bold">
                                        {user.posts.length}
                                    </Text>
                                    <Text color="gray.600">Posts</Text>
                                </Box>
                                <Box textAlign="center">
                                    <Text fontSize="xl" fontWeight="bold">
                                        {user.friends.length}
                                    </Text>
                                    <Text color="gray.600">Friends</Text>
                                </Box>
                            </HStack>
                            <Box textAlign="center">
                                <Box className="border-2 px-1" borderRadius="md" color="gray.700">
                                    {user.bio}
                                </Box>
                            </Box>
                        </VStack>

                        <Box mt={10}>
                            <Heading as="h2" size="lg" mb={6} textAlign="center">
                                Posts
                            </Heading>
                            <Grid
                                templateColumns="repeat(auto-fit, minmax(200px, 1fr))"
                                gap={4}
                            >
                                {user.posts.map((post) => (
                                    <Box
                                        key={post.id}
                                        w="100%"
                                        h="48"
                                        bg="gray.100"
                                        rounded="lg"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        flexDirection="column"
                                        padding="30px"
                                    >
                                        {post.image && (
                                            <ChakraImage
                                                src={post.image}
                                                alt={post.title}
                                                objectFit="cover"
                                                boxSize="200px"
                                                mb={2}
                                                borderRadius="md"
                                            />
                                        )}
                                        <Text>{post.title}</Text>
                                    </Box>
                                ))}
                            </Grid>
                        </Box>
                    </>
                )}
            </Box>
        </>
    );
}

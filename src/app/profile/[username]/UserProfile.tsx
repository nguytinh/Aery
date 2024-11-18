"use client";

import { ClientUser } from "@/app/interfaces/primsa";
import Navbar from "../../../components/navbar";
import {
    Box,
    Heading,
    Text,
    SimpleGrid,
    Image as ChakraImage,
    Center,
    VStack,
    HStack,
    Container,
    Card,
    CardBody,
    Stat,
    StatNumber,
    StatLabel,
    Divider,
    Badge,
} from "@chakra-ui/react";

export default function UserProfile({ user }: { user: ClientUser | null }) {
    return (
        <>
            <Navbar />
            <Container maxW="6xl" py={16} px={4}>
                {!user && (
                    <Center h="50vh">
                        <Text fontSize="xl" color="gray.600">
                            Sorry, could not find this user!
                        </Text>
                    </Center>
                )}
                {user && (
                    <VStack spacing={10}>
                        <Card w="full" variant="elevated" p={6}>
                            <CardBody>
                                <VStack spacing={6}>
                                    <ChakraImage
                                        boxSize="160px"
                                        borderRadius="full"
                                        objectFit="cover"
                                        src="https://xsgames.co/randomusers/avatar.php?g=pixel"
                                        alt="Profile"
                                        shadow="lg"
                                    />
                                    
                                    <VStack spacing={2}>
                                        <Heading size="xl" color="gray.800">
                                            {user.userName}
                                        </Heading>
                                        <Badge
                                            px={3}
                                            py={1}
                                            colorScheme="gray"
                                            borderRadius="full"
                                            fontSize="md"
                                        >
                                            {user.bio}
                                        </Badge>
                                    </VStack>

                                    <Divider />

                                    <HStack spacing={12} pt={2}>
                                        <Stat textAlign="center">
                                            <StatNumber fontSize="3xl" color="black">
                                                {user.posts.length}
                                            </StatNumber>
                                            <StatLabel fontSize="lg" color="gray.600">
                                                Posts
                                            </StatLabel>
                                        </Stat>
                                        <Stat textAlign="center">
                                            <StatNumber fontSize="3xl" color="black">
                                                {user.friends.length}
                                            </StatNumber>
                                            <StatLabel fontSize="lg" color="gray.600">
                                                Friends
                                            </StatLabel>
                                        </Stat>
                                    </HStack>
                                </VStack>
                            </CardBody>
                        </Card>

                        <Box w="full">
                            <Heading
                                as="h2"
                                size="lg"
                                mb={8}
                                color="gray.700"
                                textAlign="center"
                            >
                                Posts
                            </Heading>
                            <SimpleGrid
                                columns={{ base: 1, md: 2, lg: 3 }}
                                spacing={6}
                                w="full"
                            >
                                {user.posts.map((post) => (
                                    <Card
                                        key={post.id}
                                        variant="outline"
                                        _hover={{
                                            transform: "translateY(-4px)",
                                            shadow: "lg",
                                        }}
                                        transition="all 0.2s"
                                    >
                                        <CardBody>
                                            <VStack spacing={4}>
                                                {post.image && (
                                                    <ChakraImage
                                                        src={post.image}
                                                        alt={post.title}
                                                        objectFit="cover"
                                                        w="full"
                                                        h="200px"
                                                        borderRadius="md"
                                                    />
                                                )}
                                                <Text
                                                    fontSize="lg"
                                                    fontWeight="medium"
                                                    color="gray.700"
                                                >
                                                    {post.title}
                                                </Text>
                                            </VStack>
                                        </CardBody>
                                    </Card>
                                ))}
                            </SimpleGrid>
                        </Box>
                    </VStack>
                )}
            </Container>
        </>
    );
}
"use client";

import {
    Box,
    Heading,
    SimpleGrid,
    Card,
    CardBody,
    VStack,
    HStack,
    Text,
} from "@chakra-ui/react";
import { Flame } from "lucide-react";

interface Streak {
    id: number;
    category: {
        id: number;
        name: string;
    };
    // Note: You'll need to add these fields to your Prisma schema and query
    currentStreak: number;
}

interface StreaksSectionProps {
    streaks: Streak[];
}

export default function StreaksSection({ streaks }: StreaksSectionProps) {
    return (
        <Box w="full">
            <Heading
                as="h2"
                size="lg"
                mb={8}
                color="gray.700"
                textAlign="center"
            >
                Active Streaks
            </Heading>
            <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3 }}
                spacing={6}
                w="full"
            >
                {streaks.map((streak) => (
                    <Card
                        key={streak.id}
                        variant="outline"
                        _hover={{
                            transform: "translateY(-4px)",
                            shadow: "lg",
                        }}
                        transition="all 0.2s"
                    >
                        <CardBody>
                            <VStack spacing={4} align="stretch">
                                <HStack justify="space-between" align="center">
                                    <Text
                                        fontSize="lg"
                                        fontWeight="medium"
                                        color="gray.700"
                                    >
                                        {streak.category.name}
                                    </Text>
                                    <HStack spacing={1} color="orange.500">
                                        <Flame size={20} />
                                        <Text
                                            fontSize="md"
                                            fontWeight="bold"
                                        >
                                            {streak.currentStreak} days
                                        </Text>
                                    </HStack>
                                </HStack>
                            </VStack>
                        </CardBody>
                    </Card>
                ))}
            </SimpleGrid>
        </Box>
    );
}
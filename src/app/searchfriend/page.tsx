"use client";

import { useState, useRef, useEffect } from "react";
import {
    Box,
    Button,
    Container,
    Input,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    VStack,
    Heading,
    Card,
    CardHeader,
    CardBody,
    FormControl,
    useToast,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    useDisclosure,
    Link as ChakraLink,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
} from "@chakra-ui/react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface Friend {
    id: number;
    userName: string;
    name: string | null;
    email: string;
}

interface FriendRequest {
    id: number;
    sender: {
        id: number;
        userName: string;
        name: string | null;
        email: string;
    };
}

const FriendsPage = () => {
    const { status } = useSession();
    const [friends, setFriends] = useState<Friend[]>([]);
    const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
    const [newFriend, setNewFriend] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [removingFriendId, setRemovingFriendId] = useState<number | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef<HTMLButtonElement>(null);
    const toast = useToast();

    useEffect(() => {
        if (status === 'authenticated') {
            fetchFriends();
            fetchPendingRequests();
        }
    }, [status]);

    const fetchFriends = async () => {
        try {
            const response = await fetch('/api/friends/list');
            if (!response.ok) throw new Error('Failed to fetch friends');
            const data = await response.json();
            setFriends(data);
        } catch (err) {
            toast({
                title: "Error",
                description: err instanceof Error ? err.message : "Failed to fetch friends",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const fetchPendingRequests = async () => {
        try {
            const response = await fetch('/api/friends/pending');
            if (!response.ok) throw new Error('Failed to fetch pending requests');
            const data = await response.json();
            setPendingRequests(data);
        } catch (err) {
            toast({
                title: "Error",
                description: err instanceof Error ? err.message : "Failed to fetch pending requests",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleSendRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/friends/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userName: newFriend }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            setNewFriend("");
            toast({
                title: "Friend request sent successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (err) {
            toast({
                title: "Error",
                description: err instanceof Error ? err.message : "Failed to send friend request",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleRequestResponse = async (requestId: number, action: "ACCEPT" | "REJECT") => {
        try {
            console.log("Responding to request:", requestId, "with action:", action);

            const response = await fetch('/api/friends/respond', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requestId, action }),
            });

            const data = await response.json();
            console.log("Response data:", data);

            if (!response.ok) {
                throw new Error(data.error || 'Failed to respond to request');
            }

            // Refresh both friends list and pending requests with a small delay
            // to ensure the database has updated
            setTimeout(async () => {
                console.log("Refreshing lists...");
                await Promise.all([fetchFriends(), fetchPendingRequests()]);
            }, 500);

            toast({
                title: `Friend request ${action.toLowerCase()}ed`,
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (err) {
            console.error("Error in handleRequestResponse:", err);
            toast({
                title: "Error",
                description: err instanceof Error ? err.message : "Failed to respond to friend request",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleRemoveFriend = async (friendId: number) => {
        setRemovingFriendId(friendId);
        onOpen();
    };

    const confirmRemoveFriend = async () => {
        if (!removingFriendId) return;

        try {
            const response = await fetch('/api/friends/remove', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ friendId: removingFriendId }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to remove friend');
            }

            setFriends(prevFriends => prevFriends.filter(friend => friend.id !== removingFriendId));

            toast({
                title: "Friend removed successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (err) {
            toast({
                title: "Error",
                description: err instanceof Error ? err.message : "Failed to remove friend",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            onClose();
            setRemovingFriendId(null);
        }
    };

    if (status !== 'authenticated') {
        return null;
    }

    return (
        <Box>
            <Box mt="85px">
                <Container maxW="container.lg" py={8}>
                    <VStack spacing={6} align="stretch">
                        <Card>
                            <CardHeader>
                                <Heading size="md">Send Friend Request</Heading>
                            </CardHeader>
                            <CardBody>
                                <form onSubmit={handleSendRequest}>
                                    <FormControl>
                                        <Box display="flex" gap={4}>
                                            <Input
                                                value={newFriend}
                                                onChange={(e) => setNewFriend(e.target.value)}
                                                placeholder="Enter friend's username"
                                            />
                                            <Button
                                                colorScheme="blue"
                                                type="submit"
                                                isLoading={isLoading}
                                                loadingText="Sending..."
                                            >
                                                Send Request
                                            </Button>
                                        </Box>
                                    </FormControl>
                                </form>
                            </CardBody>
                        </Card>

                        <Tabs>
                            <TabList>
                                <Tab>My Friends</Tab>
                                <Tab>Pending Requests {pendingRequests.length > 0 && `(${pendingRequests.length})`}</Tab>
                            </TabList>

                            <TabPanels>
                                <TabPanel>
                                    <Card>
                                        <CardHeader>
                                            <Heading size="md">My Friends</Heading>
                                        </CardHeader>
                                        <CardBody>
                                            <Table variant="simple">
                                                <Thead>
                                                    <Tr>
                                                        <Th>Username</Th>
                                                        <Th>Name</Th>
                                                        <Th>Email</Th>
                                                        <Th>Actions</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {friends.length === 0 ? (
                                                        <Tr>
                                                            <Td colSpan={4} textAlign="center">
                                                                No friends added yet
                                                            </Td>
                                                        </Tr>
                                                    ) : (
                                                        friends.map((friend) => (
                                                            <Tr key={friend.id}>
                                                                <Td>
                                                                    <Link href={`/profile/${friend.userName}`} passHref legacyBehavior>
                                                                        <ChakraLink color="blue.500">
                                                                            {friend.userName}
                                                                        </ChakraLink>
                                                                    </Link>
                                                                </Td>
                                                                <Td>{friend.name}</Td>
                                                                <Td>{friend.email}</Td>
                                                                <Td>
                                                                    <Button
                                                                        colorScheme="red"
                                                                        size="sm"
                                                                        onClick={() => handleRemoveFriend(friend.id)}
                                                                    >
                                                                        Remove
                                                                    </Button>
                                                                </Td>
                                                            </Tr>
                                                        ))
                                                    )}
                                                </Tbody>
                                            </Table>
                                        </CardBody>
                                    </Card>
                                </TabPanel>

                                <TabPanel>
                                    <Card>
                                        <CardHeader>
                                            <Heading size="md">Pending Friend Requests</Heading>
                                        </CardHeader>
                                        <CardBody>
                                            <Table variant="simple">
                                                <Thead>
                                                    <Tr>
                                                        <Th>Username</Th>
                                                        <Th>Name</Th>
                                                        <Th>Email</Th>
                                                        <Th>Actions</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {pendingRequests.length === 0 ? (
                                                        <Tr>
                                                            <Td colSpan={4} textAlign="center">
                                                                No pending friend requests
                                                            </Td>
                                                        </Tr>
                                                    ) : (
                                                        pendingRequests.map((request) => (
                                                            <Tr key={request.id}>
                                                                <Td>
                                                                    <Link href={`/profile/${request.sender.userName}`} passHref legacyBehavior>
                                                                        <ChakraLink color="blue.500">
                                                                            {request.sender.userName}
                                                                        </ChakraLink>
                                                                    </Link>
                                                                </Td>
                                                                <Td>{request.sender.name}</Td>
                                                                <Td>{request.sender.email}</Td>
                                                                <Td>
                                                                    <Box display="flex" gap={2}>
                                                                        <Button
                                                                            colorScheme="green"
                                                                            size="sm"
                                                                            onClick={() => handleRequestResponse(request.id, "ACCEPT")}
                                                                        >
                                                                            Accept
                                                                        </Button>
                                                                        <Button
                                                                            colorScheme="red"
                                                                            size="sm"
                                                                            onClick={() => handleRequestResponse(request.id, "REJECT")}
                                                                        >
                                                                            Reject
                                                                        </Button>
                                                                    </Box>
                                                                </Td>
                                                            </Tr>
                                                        ))
                                                    )}
                                                </Tbody>
                                            </Table>
                                        </CardBody>
                                    </Card>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </VStack>
                </Container>
            </Box>

            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Remove Friend
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure you want to remove this friend?
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={confirmRemoveFriend} ml={3}>
                                Remove
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    );
};

export default FriendsPage;
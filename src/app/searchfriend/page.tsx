"use client";

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
  Link as ChakraLink
} from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Navbar from "../../components/navbar";
import { useSession } from "next-auth/react";

interface Friend {
  id: number;
  userName: string;
  name: string | null;
  email: string;
}

const FriendsPage = () => {
  const { data: session, status } = useSession();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [newFriend, setNewFriend] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [removingFriendId, setRemovingFriendId] = useState<number | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();

  // Fetch friends when component mounts
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch('/api/friends/list');
        if (!response.ok) {
          throw new Error('Failed to fetch friends');
        }
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

    if (status === 'authenticated') {
      fetchFriends();
    }
  }, [status, toast]);

  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/friends/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName: newFriend }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add friend');
      }

      setFriends(prevFriends => [...prevFriends, data]);
      setNewFriend("");
      
      toast({
        title: "Friend added successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to add friend",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
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
      <Navbar />
      <Box mt="85px">
        <Container maxW="container.lg" py={8}>
          <VStack spacing={6} align="stretch">
            <Card>
              <CardHeader>
                <Heading size="md">Add New Friend</Heading>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleAddFriend}>
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
                        loadingText="Adding..."
                      >
                        Add Friend
                      </Button>
                    </Box>
                  </FormControl>
                </form>
              </CardBody>
            </Card>

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
                            <Link href={`/profile/${friend.userName}`} passHref>
                              <ChakraLink
                                color="blue.500"
                                _hover={{ textDecoration: 'underline', color: 'blue.600' }}
                              >
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
'use client'

import {
    Box,
    VStack,
    Spinner,
    Center,
    Text,
    Heading,
    Container,
    Button,
    useColorModeValue,
    Icon,
    Fade
} from '@chakra-ui/react';
import CategoryBar from '@/components/CategoryBar';
import Post from '../../components/Post';
import { useEffect, useState } from 'react';
import ScrollToTop from '../../components/ScrollToTop';
import { FaPlus } from 'react-icons/fa';
import { MdRefresh } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react"


interface Category {
    id: number;
    name: string;
}

interface Author {
    id: number;
    name: string | null;
    userName: string | null;
}

interface Post {
    id: number;
    title: string;
    content: string | null;
    published: boolean;
    author: Author;
    image: string;
    Category: Category
}

const HomePage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(false);

    const { data: session, status } = useSession()

    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const headerBg = useColorModeValue('white', 'gray.800');

    const router = useRouter()

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        const fetchUserInfo = async () => {
            setCategoriesLoading(true);
            try {
                const response = await fetch(`/api/user/userInfo?reqEmail=${encodeURIComponent(session.user.email)}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Failed to fetch user info", errorData);
                    return;
                }
                const userInfo = await response.json()
                setCategories([...userInfo?.Categories])
            }
            catch (error) {
                console.error(error)
            }
            finally {
                setCategoriesLoading(false);
            }
        }

        if (status === "authenticated" && session) {
            fetchUserInfo()
        }
    }, [status, session])

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/posts');

            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }

            const data = await response.json();
            setPosts(Array.isArray(data) ? data : []);
            setFilteredPosts(Array.isArray(data) ? data : [])

        } catch (err) {
            console.error('Failed to fetch posts:', err);
            setError('Failed to load posts. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchPosts();
        setIsRefreshing(false);
    };

    if (error) {
        return (
            <>

                <Box as="main" pt="100px" bg={bgColor} minH="100vh">
                    <Center>
                        <VStack spacing={4}>
                            <Text color="red.500" fontSize="lg">{error}</Text>
                            <Button
                                colorScheme="blue"
                                onClick={fetchPosts}
                                leftIcon={<Icon as={MdRefresh} />}
                            >
                                Try Again
                            </Button>
                        </VStack>
                    </Center>
                </Box>
            </>
        );
    }

    return (
        <>
            {/* <Navbar /> */}
            <Box as="main" pt="100px" bg={bgColor} minH="100vh">
                <Container maxW="1200px" py={8}>
                    {/* Header Section */}
                    <Box
                        bg={headerBg}
                        p={6}
                        borderRadius="lg"
                        shadow="sm"
                        mb={8}
                        position="relative"
                    >
                        <Fade in={!loading}>
                            <VStack spacing={4} align="stretch">
                                <Heading size="lg" textAlign="center">BeAery 🕊️</Heading>
                                <Text textAlign="center" color="gray.600">
                                    Stay updated with the latest posts from your community
                                </Text>
                                <Center gap={4}>
                                    <Button
                                        leftIcon={<Icon as={FaPlus} />}
                                        colorScheme="blue"
                                        size="md"
                                        onClick={() => { router.push('/createpost') }}
                                    >
                                        New Post
                                    </Button>
                                    <Button
                                        leftIcon={<Icon as={MdRefresh} />}
                                        variant="outline"
                                        size="md"
                                        onClick={handleRefresh}
                                        isLoading={isRefreshing}
                                        loadingText="Refreshing"
                                    >
                                        Refresh Feed
                                    </Button>
                                </Center>
                            </VStack>
                        </Fade>
                    </Box>

                    {!categoriesLoading ? <CategoryBar categories={categories} posts={posts} setFilteredPosts={setFilteredPosts} /> :
                        <Center h="200px">
                            <VStack spacing={2}>
                                <Spinner size="lg" speed="0.65s" color="blue.500" />
                                <Text fontSize="md" color="gray.500">
                                    Loading your groups...
                                </Text>
                            </VStack>
                        </Center>
                    }

                    {/* Posts Section */}
                    <VStack spacing={6} width="100%" align="stretch">
                        {loading ? (
                            <Center h="400px">
                                <VStack spacing={4}>
                                    <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
                                    <Text color="gray.500">Loading your feed...</Text>
                                </VStack>
                            </Center>
                        ) : filteredPosts.length > 0 ? (
                            <Fade in={!loading}>
                                <VStack spacing={6}>
                                    {filteredPosts.map((post) => (
                                        <Post
                                            key={post.id}
                                            title={post.title}
                                            content={post.content}
                                            author={post.author}
                                            image={post.image}
                                        />
                                    ))}
                                </VStack>
                            </Fade>
                        ) : (
                            <Center h="200px">
                                <VStack spacing={4}>
                                    <Text fontSize="lg" color="gray.500">No posts found</Text>
                                    <Button
                                        colorScheme="blue"
                                        variant="outline"
                                        onClick={handleRefresh}
                                    >
                                        Refresh Feed
                                    </Button>
                                </VStack>
                            </Center>
                        )}
                    </VStack>
                </Container>
            </Box>
            <ScrollToTop />
        </>
    );
};

export default HomePage;
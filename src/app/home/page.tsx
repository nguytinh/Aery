'use client'

import { Box, VStack, Spinner, Center, Text } from '@chakra-ui/react';
import Navbar from '../../components/navbar';
import Post from '../../components/Post';
import { useEffect, useState } from 'react';

interface Author {
  id: number;
  name: string | null;
  userName: string | null;
}

interface Post {
  id: number;
  title: string;
  content: string | null;
  likes: number;
  published: boolean;
  author: Author;
}

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/posts');
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      setPosts(Array.isArray(data) ? data : []);
      
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setError('Failed to load posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <>
        <Navbar />
        <Box as="main" pt="100px">
          <Center>
            <Text color="red.500">{error}</Text>
          </Center>
        </Box>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Box as="main" pt="100px">
        <VStack spacing={6} mx="auto" maxW="600px" py={10} px={4}>
          {loading ? (
            <Center h="200px">
              <Spinner size="xl" />
            </Center>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <Post
                key={post.id}
                title={post.title}
                content={post.content}
                author={post.author}
                likes={post.likes}
                image={post.image} 
              />
            ))
          ) : (
            <Text>No posts found</Text>
          )}
        </VStack>
      </Box>
    </>
  );
};

export default HomePage;
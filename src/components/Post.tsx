// components/Post.tsx
import { Box, Text, Flex, Avatar, IconButton, Image } from '@chakra-ui/react';
import { FaHeart } from 'react-icons/fa';

interface PostProps {
  title: string;
  content: string | null;
  image: string | null;
  author: {
    name: string | null;
    userName: string | null;
  };
  likes: number;
}

const Post: React.FC<PostProps> = ({ title, content, image, author, likes }) => {
  return (
    <Box 
      borderWidth="1px" 
      borderRadius="lg" 
      p={4} 
      mb={4} 
      width="100%" 
      maxW="600px"
      bg="white"
      shadow="sm"
    >
      <Flex alignItems="center" mb={4}>
        <Avatar size="sm" name={author.name || undefined} mr={2} />
        <Text fontWeight="bold">{author.userName || 'Anonymous'}</Text>
      </Flex>
      
      {/* Image placed before title */}
      {image && (
        <Box mb={4} borderRadius="md" overflow="hidden">
          <Image 
            src={image} 
            alt={title}
            width="100%"
            height="400px"
            objectFit="cover"
            fallback={<Box height="400px" bg="gray.100" />}
          />
        </Box>
      )}
      
      <Text fontSize="xl" fontWeight="bold" mb={2}>{title}</Text>
      {content && <Text mb={4}>{content}</Text>}
      
      <Flex alignItems="center">
        <IconButton
          aria-label="Like post"
          icon={<FaHeart />}
          variant="ghost"
          colorScheme="red"
          mr={2}
        />
        <Text>{likes} likes</Text>
      </Flex>
    </Box>
  );
};

export default Post;
'use client'
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Box, Flex, Heading, FormControl, FormLabel, Input, Button, FormErrorMessage, Center, Spinner, Text, VStack, Select } from '@chakra-ui/react';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';

const postSchema = z.object({
  postName: z.string().min(3),
  description: z.string(),
  imageUrl: z.string(),
  categoryId: z.string().min(1, "Please select a category")
});

type postFormData = z.infer<typeof postSchema>;
type Category = {
  id: number;
  name: string;
};

const CreatePost: React.FC = () => {
  const { data: session, status } = useSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<postFormData>({
    resolver: zodResolver(postSchema)
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        toast.error('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  const handleCreatePost = async (data: postFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/posts/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          categoryId: parseInt(data.categoryId)
        }),
      });

      const responseText = await response.text();
      
      if (responseText) {
        const responseData = JSON.parse(responseText);
        if (!response.ok) {
          throw new Error(responseData?.error || "Failed to create post");
        }
        // Post was created successfully
        reset();
        toast.success('Created Post! Your streak has been updated.');
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create post");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <Center h="400px">
        <VStack spacing={4}>
          <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
          <Text color="gray.500">Loading...</Text>
        </VStack>
      </Center>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div>
        <Box bg="white" p={8} rounded="md" shadow="lg" width="full" maxW="md">
          <p>Please Sign in to make a post!</p>
        </Box>
      </div>
    );
  }

  return (
    <div>
      <Flex align="center" justify="center" minH="100vh" bg="gray.50">
        <Box bg="white" p={8} rounded="md" shadow="lg" width="full" maxW="md">
          <Heading as="h1" size="lg" textAlign="center" mb={6}>Create Your Post Below:</Heading>
          <form onSubmit={handleSubmit(handleCreatePost)}>
            <FormControl isInvalid={!!errors.postName} mb={4}>
              <FormLabel>Post Name</FormLabel>
              <Input
                type='text'
                {...register("postName", { required: "Post Name is required" })}
              />
              {errors.postName && (
                <FormErrorMessage>{errors.postName.message}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.description} mb={4}>
              <FormLabel>Post Description</FormLabel>
              <Input
                type='text'
                {...register("description")}
              />
            </FormControl>

            <FormControl isInvalid={!!errors.imageUrl} mb={4}>
              <FormLabel>Image URL</FormLabel>
              <Input
                {...register("imageUrl")}
                placeholder="https://imageurl.domain"
                type='text'
              />
            </FormControl>

            <FormControl isInvalid={!!errors.categoryId} mb={4}>
              <FormLabel>Category</FormLabel>
              <Select
                {...register("categoryId")}
                placeholder="Select category"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
              {errors.categoryId && (
                <FormErrorMessage>{errors.categoryId.message}</FormErrorMessage>
              )}
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              mt={4}
              isLoading={isLoading}
            >
              Create Post
            </Button>
          </form>
        </Box>
      </Flex>
    </div>
  );
};

export default CreatePost;
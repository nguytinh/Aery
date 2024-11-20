'use client'

import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Box, Flex, Heading, FormControl, FormLabel, Input, Button, FormErrorMessage, Center, Spinner, Text, VStack } from '@chakra-ui/react';
import { toast } from 'react-toastify';


const postSchema = z.object({
  postName: z.string().min(3),
  description: z.string(),
  imageUrl: z.string()
});

type postFormData = z.infer<typeof postSchema>;

const CreatePost: React.FC = () => {
  const { data: session, status } = useSession()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<postFormData>({ resolver: zodResolver(postSchema) });

  const handleCreatePost = async (data: postFormData) => {
    // debugger
    const response = await fetch("/api/posts/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to create post:", errorData);
      toast.error(errorData?.error || "Failed to create post");
      return;
    } else {
      reset()
      toast.success('Created Post!');

    }
  }

  if (status === "loading") {
    return (
      <Center h="400px">
        <VStack spacing={4}>
          <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
          <Text color="gray.500">Loading...</Text>
        </VStack>
      </Center>
    )
  }

  if (status == "unauthenticated") {
    return (
      <div>
        <Box bg="white" p={8} rounded="md" shadow="lg" width="full" maxW="md">
          <p>Please Sign in to make a post!</p>
        </Box>

      </div>
    )
  }

  //post needs a category
  return (
    <div>
      <Flex align="center" justify="center" minH="100vh" bg="gray.50">

        <Box bg="white" p={8} rounded="md" shadow="lg" width="full" maxW="md">
          <Heading as="h1" size="lg" textAlign="center" mb={6}>Create Your Post Below:</Heading>
          <form onSubmit={handleSubmit(handleCreatePost)}>
            <FormControl isInvalid={!!errors.postName}>
              <FormLabel>Post Name</FormLabel>
              <Input type='text'
                {...register("postName", { required: "Post Name is required" })}
              />
              {errors.postName && (
                <FormErrorMessage>{errors.postName.message}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.description}>
              <FormLabel>Post Description</FormLabel>
              <Input type='text'
                {...register("description")}
              />
            </FormControl>

            <FormControl isInvalid={!!errors.imageUrl}>
              <FormLabel>Image URL</FormLabel>
              <Input {...register("imageUrl")}
                placeholder="https://imageurl.domain"
                type='text'
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              mt={4}
            >
              Create Post
            </Button>
          </form>
        </Box>
      </Flex>
    </div>
  )
}

export default CreatePost
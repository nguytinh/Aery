'use client'

import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form";
import Navbar from '../../components/navbar';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Box, Flex, Heading, FormControl, FormLabel, Input, Button } from '@chakra-ui/react';
import { toast } from 'react-toastify';


const postSchema = z.object({
  postName: z.string(),
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

  if (status != "authenticated") {
    return (
      <div>
        <Navbar />
        <Box bg="white" p={8} rounded="md" shadow="lg" width="full" maxW="md">
          <p>Please Sign in to make a post!</p>
        </Box>

      </div>
    )
  }

  //post needs a category
  return (
    <div>
      <Navbar />
      <Flex align="center" justify="center" minH="100vh" bg="gray.50">

        <Box bg="white" p={8} rounded="md" shadow="lg" width="full" maxW="md">
          <Heading as="h1" size="lg" textAlign="center" mb={6}>Create Your Post Below:</Heading>
          <form onSubmit={handleSubmit(handleCreatePost)}>
            <FormControl>
              <FormLabel>Post Name</FormLabel>
              <Input type='text'
                {...register("postName")}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Post Description</FormLabel>
              <Input type='text'
                {...register("description")}
              />
            </FormControl>

            <FormControl>
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
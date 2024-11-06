// import Image from "next/image";
import { PrismaClient, Prisma } from "@prisma/client";
import {
  Box,
  Heading,
  Text,
  Grid,
  Image as ChakraImage,
  Center,
  VStack,
  HStack,
} from "@chakra-ui/react";

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  type UserWithPosts = Prisma.UserGetPayload<{
    include: { posts: true };
  }>;

  const prisma = new PrismaClient();
  const username = (await params).username;
  console.log(username);

  const user: UserWithPosts | null = await prisma.user.findUnique({
    where: {
      userName: username,
    },
    include: { posts: true },
  });

  console.log("user", user);
  return (
    <Box maxW="2xl" mx="auto" p={6} bg="white" shadow="md" rounded="lg">
      {!user && (
        <Center>
          <Text>Sorry, could not find this user!</Text>
        </Center>
      )}
      {user && (
        <>
          <VStack align="center">
            <ChakraImage
              boxSize="128px"
              borderRadius="full"
              objectFit="cover"
              src="https://xsgames.co/randomusers/avatar.php?g=pixel"
              alt="Profile"
            />
            <Heading as="h1" size="xl">
              {user.userName}
            </Heading>
            <HStack>
              <Box textAlign="center">
                <Text fontSize="xl" fontWeight="bold">
                  {user.posts.length}
                </Text>
                <Text color="gray.600">Posts</Text>
              </Box>
              <Box textAlign="center">
                <Text fontSize="xl" fontWeight="bold">
                  {user.followers}
                </Text>
                <Text color="gray.600">Followers</Text>
              </Box>
              <Box textAlign="center">
                <Text fontSize="xl" fontWeight="bold">
                  {user.following}
                </Text>
                <Text color="gray.600">Following</Text>
              </Box>
            </HStack>
            <Box textAlign="center">
              <Heading as="h2" size="lg">
                {user.name}
              </Heading>
              <Text color="gray.700">{user.bio}</Text>
            </Box>
          </VStack>

          <Box mt={10}>
            <Heading as="h2" size="lg" mb={6} textAlign="center">
              Posts
            </Heading>
            <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={4}>
              {user.posts.map((post) => (
                <Box
                  key={post.id} // Assuming `post` has a unique `id`
                  w="100%"
                  h="48"
                  bg="gray.100"
                  rounded="lg"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text>{post.title}</Text>
                </Box>
              ))}
            </Grid>
          </Box>
        </>
      )}
    </Box>
  );
}

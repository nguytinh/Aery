'use client'

import React from "react";
import { Box, Flex, Button } from "@chakra-ui/react";
  
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

interface CategoryBarProps {
  categories: Category[];
  posts: Post[];
  setFilteredPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  posts,
  setFilteredPosts
}) => {
  const placeHolderEmojis: Record<string, string> = {
    fitness: "🏋️",
    school: "🏫",
    water: "💧",
    studying: "📚",
    shower: "🚿",
  };

  const filterPosts = (filter: string) => {
    if (filter === "No Category") {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(() =>
        posts.filter((post) => post.Category?.name === filter)
      );
    }
  };

  return (
    <Box py={2} px={4} position="sticky" top={0} zIndex={1}>
      <Flex gap={4} justify="center" align="center">
        {categories.map((category) => (
          <Button
            key={category.id}
            colorScheme="blue"
            size="md"
            onClick={() => filterPosts(category.name)}
          >
            {placeHolderEmojis[category.name.toLowerCase()] || "❌"} {category.name}
          </Button>
        ))}
      </Flex>
    </Box>
  );
};

export default CategoryBar;
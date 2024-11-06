"use client";

import { Box, Input, VStack, Heading, IconButton } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useState } from "react";
import Navbar from "../../components/navbar"; // Ensure correct path

// Sample items - will eventually come from the database
const items = [
  "joaquin",
  "jesus",
  "tinh",
  "ethan",
  "ryan",
  "austin",
  "Mr.Beast",
  "Mr. Fox",
  "jesus1",
  "tinh1",
  "ethan1",
  "ryan1",
  "austin1",
  "Mr.Beast1",
  "Mr. Fox1",
];

const Friendpage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filter items based on the search term
  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar /> {/* Add Navbar component at the top */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minH="50vh" // Adjust height of the main search box section
        p={4}
      >
        {/* Added Heading/Text above the search bar */}
        <Heading as="h1" size="lg" mb={4}>
          Discover Your Friends!
        </Heading>

        <Box pos="relative" w="full" maxW="md">
          <Box pos="relative" w="full">
            <Input
              placeholder="Search your friend..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsDropdownOpen(true)}
              onBlur={() => setIsDropdownOpen(false)}
              pr="10" // Padding for search icon
            />
            <IconButton
              aria-label="Search"
              icon={<SearchIcon />}
              pos="absolute"
              right="2"
              top="50%" // Position the icon within the search input
              transform="translateY(-50%)"
              size="sm"
            />
          </Box>

          {isDropdownOpen && filteredItems.length > 0 && (
            <VStack
              pos="absolute"
              top="100%"
              mt="1"
              w="full"
              bg="white"
              boxShadow="md"
              borderRadius="md"
              overflowY="auto" // Enable vertical scrolling for the dropdown
              maxH="200px" // Set maximum height for the dropdown
              zIndex="dropdown"
              align="stretch"
            >
              {filteredItems.map((item, index) => (
                <Box key={index} p="2" _hover={{ bg: "gray.100" }}>
                  {item}
                </Box>
              ))}
              {filteredItems.length === 0 && (
                <Box p="2" color="gray.500">
                  No results found
                </Box>
              )}
            </VStack>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Friendpage;

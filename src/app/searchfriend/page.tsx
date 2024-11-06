import { Box, Input, VStack, IconButton } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useState } from "react";

// Sample items - will eventually come from the database
const items = ["username1", "username2", "username3", "username4", "username5"];

const Demo = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filter items based on the search term
  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minH="100vh"
    >
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
            top="50%"
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
            overflow="hidden"
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
  );
};

export default Demo;
'use client'

import { IconButton } from '@chakra-ui/react';
import { ChevronUpIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled up to given distance
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);

    // Clean up function
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <IconButton
          onClick={scrollToTop}
          icon={<ChevronUpIcon />}
          aria-label="Scroll to top"
          size="lg"
          bg="black"
          color="white"
          position="fixed"
          bottom="4"
          right="4"
          borderRadius="full"
          boxShadow="md"
          opacity="0.9"
          _hover={{
            opacity: 1,
            transform: 'translateY(-2px)',
          }}
          transition="all 0.2s"
          zIndex={999}
        />
      )}
    </>
  );
};

export default ScrollToTop;
'use client'
// Navbar.tsx
import { Box, Flex, Image, Link, HStack } from '@chakra-ui/react';
import { useRouter, usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useSession } from "next-auth/react"
import { useEffect } from 'react';

const Navbar: React.FC = () => {
    const { status } = useSession()
    const router = useRouter();
    const pathname = usePathname();

    const handleNavigation = (path: string) => {
        if (pathname === path) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            router.push(path);
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };
    useEffect(() => {
        console.log(status)
    }, [status])

    if (status === 'authenticated') {
        return (
            <Box as="nav" bg="white" py={4} shadow="md" position="fixed" width="100%" zIndex="100">
                <Flex maxW="1200px" mx="auto" align="center" px={4} justify="center">
                    <HStack spacing={8}>
                        <Link
                            onClick={() => handleNavigation('/home')}
                            color="gray.700"
                            fontWeight="semibold"
                            cursor="pointer"
                            _hover={{
                                color: "blue.300",
                                textDecoration: "none"
                            }}
                        >
                            Home
                        </Link>

                        <Link
                            onClick={() => handleNavigation('/searchfriend')}
                            color="gray.700"
                            fontWeight="semibold"
                            cursor="pointer"
                            _hover={{
                                color: "blue.300",
                                textDecoration: "none"
                            }}
                        >
                            Friends
                        </Link>

                        <Link
                            onClick={() => handleNavigation('/')}
                            cursor="pointer"
                        >
                            <Image
                                src="/assets/AeryLogo.jpg"
                                alt="Logo"
                                boxSize="65px"
                                mx={8}
                            />
                        </Link>

                        <Link
                            onClick={() => handleNavigation('/profile/tinhnguy')}
                            color="gray.700"
                            fontWeight="semibold"
                            cursor="pointer"
                            _hover={{
                                color: "blue.300",
                                textDecoration: "none"
                            }}
                        >
                            Profile
                        </Link>

                        <Link
                            onClick={() => signOut({ redirect: true, redirectTo: '/' })}
                            color="gray.700"
                            fontWeight="semibold"
                            cursor="pointer"
                            _hover={{
                                color: "blue.300",
                                textDecoration: "none"
                            }}
                        >
                            Logout
                        </Link>
                    </HStack>
                </Flex>
            </Box >
        )
    }
    return (<></>)
};


export default Navbar;
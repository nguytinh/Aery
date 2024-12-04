'use client'
import { Box, Flex, Image, HStack, Button } from '@chakra-ui/react';
// import Link from 'next/link';
import { Link } from './common/link';
// import { useRouter, usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';

const Navbar: React.FC = () => {
    const { status, data: session } = useSession();
    // const router = useRouter();
    // const pathname = usePathname();

    // const handleNavigation = (path: string) => {
    //     if (pathname === path) {
    //         window.scrollTo({
    //             top: 0,
    //             behavior: 'smooth'
    //         });
    //     } else {
    //         router.push(path);
    //         window.scrollTo({
    //             top: 0,
    //             behavior: 'smooth'
    //         });
    //     }
    // };

    // Debug logging
    useEffect(() => {
        console.log('Auth Status:', status);
        console.log('Session Data:', session);
    }, [status, session]);

    // Don't render anything if not authenticated or session data isn't loaded
    if (status !== 'authenticated' || !session) {
        return null;
    }

    // Protect against undefined username
    const username = session.username;
    if (!username) {
        console.error('Username is undefined in session:', session);
        // You could redirect to login or show an error state
        signOut({ callbackUrl: '/' });
        return null;
    }

    return (
        <Box as="nav" bg="white" py={4} shadow="md" position="static" width="100%" zIndex="100">
            <Flex maxW="1200px" mx="auto" align="center" px={4} justify="center">
                <HStack spacing={8}>
                    <Link
                        href='/home'
                        // onClick={() => handleNavigation('/home')}
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
                        href='/searchfriend'
                        // onClick={() => handleNavigation('/searchfriend')}
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
                        href='/'
                        // onClick={() => handleNavigation('/')}
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
                        href={`/profile/${username}`}
                        // onClick={() => {
                        //     if (username) {
                        //         handleNavigation(`/profile/${username}`)
                        //     }
                        // }}
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

                    <Button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        color="gray.700"
                        backgroundColor="transparent"
                        fontWeight="semibold"
                        cursor="pointer"
                        _hover={{
                            color: "blue.300",
                            textDecoration: "none"
                        }}
                    >
                        Logout
                    </Button>
                </HStack>
            </Flex>
        </Box>
    );
};

export default Navbar;
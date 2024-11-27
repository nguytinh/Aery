"use client";
import {
    Box,
    Button,
    Center,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Text,
    Textarea,
    VStack,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Avatar,
    Stack,
    FormErrorMessage,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";

export default function CreateProfile() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        userName: "",
        aboutMe: "",
        email: "",
        password: ""
    });
    const [profileImage, setProfileImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [usernameError, setUsernameError] = useState("");

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setFormData({ ...formData, email: localStorage.getItem("email"), password: localStorage.getItem("password") });
        }
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const validateUsername = (username) => {
        if (username.includes(' ')) {
            setUsernameError("Username cannot contain spaces");
            return false;
        }
        setUsernameError("");
        return true;
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        if (id === 'userName') {
            validateUsername(value);
        }
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate username before submission
        if (!validateUsername(formData.userName)) {
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const submitData = new FormData();
            if (profileImage) {
                submitData.append("profileImage", profileImage);
            }
            Object.keys(formData).forEach(key => {
                submitData.append(key, formData[key]);
            });

            const response = await fetch('/api/user/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to create profile');
            }

            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 5000);

            if (typeof window !== 'undefined') {
                localStorage.removeItem('email');
                localStorage.removeItem('password');
            }

            await signIn('credentials', {
                redirect: true,
                redirectTo: '/',
                email: formData.email,
                password: formData.password,
            });

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Center minH="100vh" bg="white">
            <Box
                w="full"
                maxW="md"
                p={8}
                borderRadius="xl"
                boxShadow="2xl"
                bg="white"
                border="1px"
                borderColor="gray.100"
            >
                <VStack spacing={6} align="flex-start">
                    <Heading
                        as="h2"
                        size="xl"
                        color="black"
                        fontWeight="bold"
                        letterSpacing="tight"
                    >
                        Create Profile
                    </Heading>

                    {/* Profile Picture Upload Section */}
                    <Center w="full">
                        <Box position="relative" textAlign="center">
                            <Box
                                as="label"
                                htmlFor="profile-photo"
                                cursor="pointer"
                                position="relative"
                                display="inline-block"
                            >
                                <Avatar
                                    size="2xl"
                                    bg="gray.100"
                                    src={previewUrl}
                                    icon={<AddIcon color="gray.400" boxSize={8} />}
                                />
                                {!previewUrl && (
                                    <Box
                                        position="absolute"
                                        top="0"
                                        left="0"
                                        right="0"
                                        bottom="0"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        background="blackAlpha.400"
                                        borderRadius="full"
                                        opacity="0"
                                        transition="opacity 0.2s"
                                        _hover={{ opacity: 1 }}
                                    >
                                        <AddIcon color="white" boxSize={8} />
                                    </Box>
                                )}
                                {previewUrl && (
                                    <Box
                                        position="absolute"
                                        top="0"
                                        left="0"
                                        right="0"
                                        bottom="0"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        background="blackAlpha.600"
                                        borderRadius="full"
                                        opacity="0"
                                        transition="opacity 0.2s"
                                        _hover={{ opacity: 1 }}
                                    >
                                        <Text color="white" fontSize="sm" fontWeight="medium">
                                            Change Photo
                                        </Text>
                                    </Box>
                                )}
                                <Input
                                    id="profile-photo"
                                    type="file"
                                    accept="image/*"
                                    display="none"
                                    onChange={handleImageChange}
                                />
                            </Box>
                            <Text
                                fontSize="sm"
                                color="gray.500"
                                mt={4}
                                textAlign="center"
                            >
                                {previewUrl ? 'Change Picture' : 'Add Picture'}
                            </Text>
                        </Box>
                    </Center>

                    {showAlert && (
                        <Alert
                            status="success"
                            variant="subtle"
                            borderRadius="lg"
                            bg="black"
                            color="white"
                            w="full"
                        >
                            <AlertIcon color="white" />
                            <Box>
                                <AlertTitle fontWeight="bold">Profile Created!</AlertTitle>
                                <AlertDescription>Your profile has been saved successfully.</AlertDescription>
                            </Box>
                        </Alert>
                    )}

                    {error && (
                        <Alert status="error" borderRadius="lg">
                            <AlertIcon />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                        <Stack spacing={4} w="full">
                            <FormControl id="firstName" isRequired>
                                <FormLabel color="black" fontSize="sm" fontWeight="medium">
                                    First Name
                                </FormLabel>
                                <Input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    size="lg"
                                    borderColor="gray.200"
                                    _hover={{ borderColor: "gray.300" }}
                                    _focus={{ borderColor: "black", boxShadow: "none" }}
                                    bg="white"
                                />
                            </FormControl>

                            <FormControl id="lastName" isRequired>
                                <FormLabel color="black" fontSize="sm" fontWeight="medium">
                                    Last Name
                                </FormLabel>
                                <Input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    size="lg"
                                    borderColor="gray.200"
                                    _hover={{ borderColor: "gray.300" }}
                                    _focus={{ borderColor: "black", boxShadow: "none" }}
                                    bg="white"
                                />
                            </FormControl>

                            <FormControl id="userName" isRequired isInvalid={!!usernameError}>
                                <FormLabel color="black" fontSize="sm" fontWeight="medium">
                                    Username
                                </FormLabel>
                                <Input
                                    type="text"
                                    value={formData.userName}
                                    onChange={handleChange}
                                    size="lg"
                                    borderColor="gray.200"
                                    _hover={{ borderColor: "gray.300" }}
                                    _focus={{ borderColor: "black", boxShadow: "none" }}
                                    bg="white"
                                />
                                <FormErrorMessage>{usernameError}</FormErrorMessage>
                            </FormControl>

                            <FormControl id="aboutMe">
                                <FormLabel color="black" fontSize="sm" fontWeight="medium">
                                    About Me
                                </FormLabel>
                                <Textarea
                                    value={formData.aboutMe}
                                    onChange={handleChange}
                                    size="lg"
                                    borderColor="gray.200"
                                    _hover={{ borderColor: "gray.300" }}
                                    _focus={{ borderColor: "black", boxShadow: "none" }}
                                    bg="white"
                                    minH="150px"
                                    resize="vertical"
                                />
                            </FormControl>

                            <Button
                                type="submit"
                                width="full"
                                mt={6}
                                bg="black"
                                color="white"
                                size="lg"
                                _hover={{ bg: "gray.800" }}
                                _active={{ bg: "gray.900" }}
                                letterSpacing="wide"
                                isLoading={isLoading}
                                isDisabled={!!usernameError}
                            >
                                Save Profile
                            </Button>
                        </Stack>
                    </form>
                </VStack>
            </Box>
        </Center>
    );
}
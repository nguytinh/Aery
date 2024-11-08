'use client'

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    Text,
    Heading,
    Link,
} from "@chakra-ui/react";
import NextLink from "next/link";

// Define Zod schema
const signUpSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
    apiError: z.string().optional(),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function Login() {
    const { register, handleSubmit, setError, formState: { errors } } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
    });

    const handleSignIn = async (data: SignUpFormData) => {
        const response = await fetch("/api/user/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            response.json().then((data) => {
                setError('apiError', { type: 'manual', message: data.error });
            });
        } else {
            await signIn('credentials', {
                redirect: true,
                redirectTo: '/',
                email: data.email,
                password: data.password,
            });
        }
    };

    return (
        <Flex align="center" justify="center" minH="100vh" bg="gray.50">
            <Box bg="white" p={8} rounded="md" shadow="lg" width="full" maxW="md">
                <Heading as="h1" size="lg" textAlign="center" mb={6}>Sign In</Heading>
                <form onSubmit={handleSubmit(handleSignIn)}>
                    <FormControl isInvalid={!!errors.email} mb={4}>
                        <FormLabel>Email</FormLabel>
                        <Input
                            type="email"
                            {...register("email")}
                            placeholder="Enter your email"
                            focusBorderColor="black"
                        />
                        <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                    </FormControl>
                    
                    <FormControl isInvalid={!!errors.password} mb={4}>
                        <FormLabel>Password</FormLabel>
                        <Input
                            type="password"
                            {...register("password")}
                            placeholder="Enter your password"
                            focusBorderColor="black"
                        />
                        <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
                    </FormControl>

                    {errors.apiError && <Text color="red.500" fontSize="sm" mt={1}>{errors.apiError.message}</Text>}

                    <Link as={NextLink} href="/forgotpass" color="blue.500" fontSize="sm" display="block" textAlign="right" mt={2}>
                        Forgot Password?
                    </Link>

                    <Button
                        type="submit"
                        bg="black"
                        width="full"
                        mt={4}
                        color="white"
                    >
                        Sign In
                    </Button>

                    <Text textAlign="center" mt={4}>
                        Don’t have an account?{" "}
                        <Link as={NextLink} href="/signup" color="blue.500">
                            Sign Up
                        </Link>
                    </Text>
                </form>
            </Box>
        </Flex>
    );
}

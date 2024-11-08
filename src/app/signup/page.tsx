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
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function Signup() {
    const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
    });

    const handleSignUp = async (data: SignUpFormData) => {
        const response = await fetch("/api/user/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            console.error("Failed to sign up:", response);
            return;
        } else {
            await signIn('credentials', {
                redirect: true,
                redirectTo: '/',
                email: data.email,
                password: data.password,
            });
        }
        const user = await response.json();
        console.log("Signed up user:", user);
    };

    return (
        <Flex align="center" justify="center" minH="100vh" bg="gray.50">
            <Box bg="white" p={8} rounded="md" shadow="lg" width="full" maxW="md">
                <Heading as="h1" size="lg" textAlign="center" mb={6}>Sign up for an account below:</Heading>
                <form onSubmit={handleSubmit(handleSignUp)}>
                    <FormControl isInvalid={!!errors.email} mb={4}>
                        <FormLabel>Email</FormLabel>
                        <Input
                            type="email"
                            {...register("email")}
                            placeholder="Enter your email"
                            focusBorderColor="blue.400"
                        />
                        <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                    </FormControl>
                    
                    <FormControl isInvalid={!!errors.password} mb={4}>
                        <FormLabel>Password</FormLabel>
                        <Input
                            type="password"
                            {...register("password")}
                            placeholder="Enter your password"
                            focusBorderColor="blue.400"
                        />
                        <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
                    </FormControl>

                    <Button
                        type="submit"
                        colorScheme="blue"
                        width="full"
                        mt={4}
                    >
                        Sign Up
                    </Button>

                    <Text textAlign="center" mt={4}>
                        Already have an account?{" "}
                        <Link as={NextLink} href="/login" color="blue.500">
                            Log In
                        </Link>
                    </Text>
                </form>
            </Box>
        </Flex>
    );
}

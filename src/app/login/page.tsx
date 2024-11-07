'use client'

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";

/**
 * Created by Jesus Avalos
 * This page utilizes NextAuth.js to have the user sign up.
 */

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
            // Automatically sign in the user after successful sign-up
            await signIn('credentials', {
                redirect: true, // Prevents automatic redirect
                redirectTo: '/',
                email: data.email,
                password: data.password,
            });
            // Redirect or show success message here

        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-2xl font-semibold text-center mb-6">Sign in:</h1>
                <form onSubmit={handleSubmit(handleSignIn)} className="space-y-4">
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium text-gray-700">Email:</label>
                        <input
                            type="email"
                            {...register("email")}
                            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium text-gray-700">Password:</label>
                        <input
                            type="password"
                            {...register("password")}
                            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>
                    {errors.apiError && <p className="text-red-500 text-xs mt-1">{errors.apiError.message}</p>}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}

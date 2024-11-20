"use client"

import { ChakraProvider } from "@chakra-ui/react"
import { SessionProvider } from "next-auth/react"

export function Provider({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <ChakraProvider>
                {children}
            </ChakraProvider>
        </SessionProvider>
    )
}

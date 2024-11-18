"use client"

import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import { SessionProvider } from "next-auth/react"

export function Provider({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <ChakraProvider value={defaultSystem}>
                {children}
            </ChakraProvider>
        </SessionProvider>
    )
}

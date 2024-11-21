import NextAuth, { DefaultSession, User } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { signInSchema } from "./lib/zod"

declare module "next-auth" {
  interface Session extends DefaultSession {
    username?: string;
  }
}

interface ExtendedUser extends User {
  userName: string; // Add custom property
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email", placeholder: "john@gmail.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
          const { email, password } = await signInSchema.parseAsync(credentials)
          
          const resp = await fetch('http://localhost:3000/api/user/signin', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: {
              'Content-Type': 'application/json'
            }
          })

          if (!resp.ok) {
            throw new Error('Failed to sign in.')
          }

        const user = await resp.json()
        return user
    }}),
  ],
  callbacks: {
    async jwt({ token, user}) {
        // Extend user to contain username 
        if (user) {
            token.username = (user as ExtendedUser).userName 
        } else {
        }
        return token
    },
    async session({ session, token}) {
        return { ...session, username: token.username }
      }
    }
  })
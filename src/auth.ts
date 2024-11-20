import NextAuth, { DefaultSession, User } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { signInSchema } from "./lib/zod"

declare module "next-auth" {
  interface Session extends DefaultSession {
    username?: string;
  }
}

interface ExtendedUser extends User {
  username: string;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email", placeholder: "john@gmail.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
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

          const userData = await resp.json()
          console.log('User data from API:', userData) // Debug log

          // Make sure we're returning the correct structure
          return {
            id: userData.id,
            email: userData.email,
            username: userData.username || userData.userName, // Handle both cases
          } as ExtendedUser
        } catch (error) {
          console.error('Authorization error:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log('JWT Callback - Token:', token)
      console.log('JWT Callback - User:', user)
      
      if (user) {
        // Make sure we're setting the username in the token
        token.username = (user as ExtendedUser).username
      }
      
      console.log('JWT Callback - Final Token:', token)
      return token
    },
    async session({ session, token }) {
      console.log('Session Callback - Initial Session:', session)
      console.log('Session Callback - Token:', token)
      
      // Make sure we're adding username to the session
      const updatedSession = {
        ...session,
        username: token.username,
      }
      
      console.log('Session Callback - Final Session:', updatedSession)
      return updatedSession
    }
  },
  debug: true, // Enable debugging
})
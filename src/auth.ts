import NextAuth, {User} from "next-auth"
// import { PrismaAdapter } from "@auth/prisma-adapter"
// import { prisma } from "@/app/db"
import Credentials from "next-auth/providers/credentials"
import { signInSchema } from "./lib/zod"
// Your own logic for dealing with plaintext password strings; be careful!
// import { saltAndHashPassword } from "@/utils/password"
// import { signInSchema } from "./lib/zod"
 
// Get's the user from the database
// async function getUserFromDb(email: string, hash: string) {
//   return await prisma.user.findFirst({
//     where: {
//       email,
//       password: hash,
//     },
//   })
// }
interface ExtendedUser extends User {
  username: string; // Add custom property
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {label: "Email", type: "email", placeholder: "john@gmail.com"},
        password: {label: "Password", type: "password"},
      },
      authorize: async (credentials) => {

        let user = null
 
        // logic to salt and hash password
        const { email, password } = await signInSchema.parseAsync(credentials)
        
        // logic to verify if the user exists
        const resp = await fetch('http://localhost:3000/api/user/signin', {
            method: 'POST',
            body: JSON.stringify({email, password}),
            headers: {
                'Content-Type': 'application/json'
            }
            })
        if (!resp.ok) {
            throw new Error('Failed to sign in.')
        }
        user = await resp.json()
        return user
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
        // Extend user to contain username 
        if (user) {
            token.username = (user as ExtendedUser).username 
        }
        return token
    },
    async session({ session, token}) {
        return { ...session, username: token.username }
      }
  }
})
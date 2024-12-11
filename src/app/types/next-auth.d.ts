// types/next-auth.d.ts

import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
    interface Session extends DefaultSession {
        username?: string
        token?: unknown
    }

    interface User {
        username?: string
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        username?: string
    }
}
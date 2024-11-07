import './globals.css'
import { Provider } from "../components/ui/provider"
import UserAvatar from '@/components/auth/avatar'

export default function RootLayout(props: { children: React.ReactNode }) {
    const { children } = props
    return (
        <html suppressHydrationWarning>
            <body className='flex flex-col gap-2'>
                <UserAvatar />
                <Provider>{children}</Provider>
            </body>
        </html>
    )
}
import './globals.css'
import { Provider } from "../components/ui/provider"
import Navbar from '@/components/navbar'

export default async function RootLayout(props: { children: React.ReactNode }) {
    const { children } = props
    return (
        <html suppressHydrationWarning>
            <body className='flex flex-col gap-2'>
                {/* <UserAvatar /> */}
                <Provider>
                    <Navbar />
                    {children}
                </Provider>
            </body>
        </html>
    )
}
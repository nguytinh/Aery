import './globals.css'
import { Provider } from "../components/ui/provider"
import { SessionProvider } from "next-auth/react"
import Navbar from '@/components/navbar'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default async function RootLayout(props: { children: React.ReactNode }) {
    const { children } = props
    return (
        <html suppressHydrationWarning>
            <body className='flex flex-col gap-2'>
                {/* <UserAvatar /> */}
                <SessionProvider>
                    <Provider>
                        <Navbar />
                        {children}
                        <ToastContainer />
                    </Provider>
                </SessionProvider>
            </body>
        </html>
    )
}

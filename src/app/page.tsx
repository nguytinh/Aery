import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function Page() {
    const session = await auth()
    if (session && session.user) {
        redirect('/home');
    } else {
        redirect('/login');
    }
}
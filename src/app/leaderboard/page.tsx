'use client'
import { fetcher } from '@/lib/swr';
import useSWR from 'swr'

export default function Leaderboard() {

    const { data, error, isLoading } = useSWR('/api/leaderboard/friends', fetcher)

    if (error) {
        return <p>Failed to fetch leaderboard</p>;
    } else if (isLoading) {
        return <p>Loading...</p>;
    } return (
        <div>
            <h1 className='text-xl'>Leaderboard</h1>
            <h1 className='text-xl'>Friends</h1>
            <pre>{JSON.stringify(data)}</pre>
        </div>
    )
}
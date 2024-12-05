'use client'
import { fetcher } from '@/lib/swr';
import { Select } from '@chakra-ui/react';
import { Streak } from '@prisma/client';
import { useEffect, useState } from 'react';
import useSWR from 'swr'

interface StreakExtended extends Streak {
    categoryName: string;
}

interface Leaderboard {
    username: string;
    streak: StreakExtended;
}

interface CategoryData {
    id: number;
    name: string;
}

export default function Leaderboard() {

    const [filteredData, setFilteredData] = useState<Leaderboard[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const { data, error, isLoading } = useSWR<Leaderboard[]>('/api/leaderboard/friends', fetcher)
    const [categories, setCategories] = useState<CategoryData[]>([]);

    useEffect(() => {
        if (!isLoading && !error && data && !selectedCategory) {
            const ids = new Set<number>();
            const categories: CategoryData[] = [];
            for (const cur of data) {
                const streak = cur.streak;
                if (ids.has(streak.categoryId)) {
                    continue;
                }
                ids.add(streak.categoryId);
                categories.push({ id: streak.categoryId, name: streak.categoryName });
            }
            console.log("categories", categories)
            setCategories(categories);
        }
        if ((!isLoading) && (!error) && data && selectedCategory) {
            const streaks = data.filter((streak) => streak.streak.categoryId === selectedCategory);
            console.log("streaks", streaks)
            setFilteredData(streaks);
        } else if (data) {
            setFilteredData(data);
        }
    }, [data, selectedCategory, isLoading]);

    if (error) {
        return <p>Failed to fetch leaderboard</p>;
    } else if (isLoading) {
        return <></>;
    }

    const getRankBorderColor = (rank: number) => {
        // Compare the previous current streak with the current streak, if the same return the same rank
        if (rank > 1) {
            if (filteredData[rank - 1].streak.currentStreak === filteredData[rank - 2].streak.currentStreak) {
                return getRankBorderColor(rank - 1);
            }
        }
        switch (rank) {
            case 1:
                return '#FFD700'; // Gold
            case 2:
                return '#C0C0C0'; // Silver
            case 3:
                return '#CD7F32'; // Bronze
            default:
                return 'transparent';
        }
    };

    return (
        <div className='flex w-full flex-col items-center'>
            <h1 className='text-2xl font-bold mt-5'>Leaderboard</h1>
            {/* <select onChange={(e) => { setSelectedCategory(parseInt(e.target.value)) }}>
                {categories?.map((category, index) => (
                    <option key={index} value={category.id}>{category.name}</option>
                ))}
            </select> */}
            <div className='flex flex-col w-full px-4 md:px-10 mt-5'>
                <div className='flex flex-col gap-4'>
                    <Select
                        width="fit-content"
                        onChange={(e) => { setSelectedCategory(parseInt(e.target.value)) }} placeholder="Select Category" >
                        {categories?.map((category, index) => (
                            <option key={index} value={category.id}>{category.name}</option>
                        ))}
                    </Select>
                    {filteredData.map((cur, index) => (
                        <div
                            className='flex items-center p-4 bg-white shadow-md rounded-lg w-full md:w-[70%] self-center border-l-4'
                            style={{ borderLeftColor: getRankBorderColor(index + 1) }}
                            key={index}
                        >
                            {/* Rank */}
                            <div className='flex items-center justify-center w-12 h-12 rounded-full font-bold text-black text-lg'
                                style={{ backgroundColor: getRankBorderColor(index + 1) }}>
                                {index + 1}
                            </div>

                            {/* User Details */}
                            <div className='ml-4 flex-1'>
                                <h1 className='text-xl font-semibold'>{cur.username}</h1>
                                <p className='text-gray-600 text-sm'>{cur.streak.categoryName}</p>
                            </div>

                            {/* Streak Details */}
                            <div className='text-center'>
                                <p className='text-xl font-bold'>{cur.streak.currentStreak}</p>
                                <p className='text-gray-600 text-sm'>Streak</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

import { ClientUser } from "@/app/interfaces/primsa";
import UserProfile from "./UserProfile";
import { prisma } from "@/app/db";

interface PageProps {
    params: Promise<{ username: string }>;
}

// Returns the difference in days between two dates.
function dateDiffInDays(a: Date, b: Date) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

// Returns if difference in days exceeds the threshold.
function isStreakBroken(lastPostDate: Date | null, threshold: number = 2) {
    if (!lastPostDate) return true;
    return dateDiffInDays(lastPostDate, new Date()) > threshold;
}

export default async function Page({ params }: PageProps) {
    const resolvedParams = await params;
    try {
        const user = await prisma.user.findUnique({
            where: {
                userName: resolvedParams.username,
            },
            select: {
                id: true,
                userName: true,
                bio: true,
                posts: true,
                friends: {
                    select: {
                        id: true,
                    },
                },
                email: true,
                name: true,
                Streaks: {
                    select: {
                        id: true,
                        lastPostDate: true,
                        currentStreak: true,
                        category: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        for (const streak of user.Streaks) {
            if (isStreakBroken(streak.lastPostDate)) {
                // get streak to check
                // Make a request to db to update the streak.
                await prisma.streak.update({
                    where: { id: streak.id },
                    data: { currentStreak: 0 }
                });
                streak.currentStreak = 0;
            }
        }

        if (!user) {
            return <UserProfile user={null} />;
        }

        return <UserProfile user={user as ClientUser} />;
    } catch (error) {
        console.error("Error fetching user:", error);
        return <UserProfile user={null} />;
    }
}
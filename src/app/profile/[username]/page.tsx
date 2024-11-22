import { ClientUser } from "@/app/interfaces/primsa";
import UserProfile from "./UserProfile";
import { prisma } from "@/app/db";

interface PageProps {
    params: Promise<{ username: string }>;
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

        console.log(user)
        if (!user) {
            return <UserProfile user={null} />;
        }

        return <UserProfile user={user as ClientUser} />;
    } catch (error) {
        console.error("Error fetching user:", error);
        return <UserProfile user={null} />;
    }
}
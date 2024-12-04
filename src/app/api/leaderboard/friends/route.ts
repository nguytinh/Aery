import { prisma } from "@/app/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
    // Get current user session.
    const session = await auth();
    console.log('session', session)
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // const { skip } = await res.json(); // Skip count for pagination.

    // Get all of user friends and their streaks.
    const user = await prisma.user.findFirst({
        where: { userName: session.username },
        include: {
            friends: {
                select: {
                    id: true,
                    userName: true,
                    name: true,
                    email: true,
                    Streaks: true
                    //Streaks: {take: 1, orderBy: {currentStreak: 'desc'}}
                },
            },
            Streaks: true
        }
    });

    // Get list of all streaks and sort them by highest streak.
    const streaks = user.friends.flatMap((friend) => friend.Streaks.flatMap((streak) => streak));
    streaks.push(...user.Streaks);

    streaks.sort((a, b) => b.currentStreak - a.currentStreak);

    return NextResponse.json(streaks);
}
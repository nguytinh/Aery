import { prisma } from "@/app/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

// Returns the difference in days between two dates.
export function dateDiffInDays(a: Date, b: Date) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

// Returns if difference in days exceeds the threshold.
export function isStreakBroken(lastPostDate: Date | null, threshold: number = 2) {
    if (!lastPostDate) return true;
    return dateDiffInDays(lastPostDate, new Date()) > threshold;
}

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

    // Get all categories
    const categories = await prisma.category.findMany();

    // Convert categories to object for easy access.
    const categoryMap = new Map<number, string>();
    for (const category of categories){
        categoryMap.set(category.id, category.name);
    }
    
    // Get list of all streaks and sort them by highest streak.
    // At the same time, check if the streak is broken.
    const streaks = []
    for (const friend of user.friends){
        for (const streak of friend.Streaks){
            if (isStreakBroken(streak.lastPostDate)) {
                // get streak to check
                // Make a request to db to update the streak.
                await prisma.streak.update({
                    where: {id: streak.id},
                    data: {currentStreak: 0}
                });

                streaks.push({username: friend.userName, streak: {...streak, currentStreak: 0, categoryName: categoryMap.get(streak.categoryId)}});
            } else {
                streaks.push({username: friend.userName, streak: {...streak, categoryName: categoryMap.get(streak.categoryId)}});
            }
        }
    }
    for (const streak of user.Streaks){
        if (isStreakBroken(streak.lastPostDate)) {
            // get streak to check
            // Make a request to db to update the streak.
            await prisma.streak.update({
                where: {id: streak.id},
                data: {currentStreak: 0}
            });
        streaks.push({username: session.username, streak: {...streak, currentStreak: 0, categoryName: categoryMap.get(streak.categoryId)}});
        } else {
            streaks.push({username: session.username, streak: {...streak, categoryName: categoryMap.get(streak.categoryId)}});
        }

    }

    streaks.sort((a, b) => b.streak.currentStreak - a.streak.currentStreak);

    return NextResponse.json(streaks);
}
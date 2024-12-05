import { prisma } from "@/app/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(req, res, params) {
    // parse params
    let { category } = params;

    try {
        category = parseInt(category);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    // Get current user session.
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // const { skip } = await res.json(); // Skip count for pagination.

    // Get all of user friends and their streaks.
    // Get all streaks that matches the category
    const user = await prisma.user.findFirst({
        where: { userName: session.username },
        include: {
            friends: {
                select: {
                    id: true,
                    userName: true,
                    name: true,
                    email: true,
                    Streaks: {where: {categoryId: parseInt(category)}}
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
    const streaks = user.friends.flatMap((friend) => 
         {return friend.Streaks.flatMap((streak) => 
            {return {username: friend.userName, streak: {...streak, categoryName: categoryMap.get(streak.categoryId)}}})});

    for (const streak of user.Streaks){
        streaks.push({username: session.username, streak: {...streak, categoryName: categoryMap.get(streak.categoryId)}});
    }

    streaks.sort((a, b) => b.streak.currentStreak - a.streak.currentStreak);

    return NextResponse.json(streaks);
}
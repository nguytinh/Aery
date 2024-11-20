// app/api/friends/add/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/db";
import { auth } from "@/auth";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.username) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { userName } = await req.json();

        // Find the friend to add
        const friendToAdd = await prisma.user.findUnique({
            where: { userName }
        });

        if (!friendToAdd) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Find current user
        const currentUser = await prisma.user.findFirst({
            where: { userName: session.username }
        });

        if (!currentUser) {
            return NextResponse.json(
                { error: "Current user not found" },
                { status: 404 }
            );
        }

        // Check if already friends
        const alreadyFriends = await prisma.user.findFirst({
            where: {
                id: currentUser.id,
                friends: {
                    some: {
                        id: friendToAdd.id
                    }
                }
            }
        });

        if (alreadyFriends) {
            return NextResponse.json(
                { error: "Already friends with this user" },
                { status: 400 }
            );
        }

        // Add friend connection
        await prisma.user.update({
            where: { id: currentUser.id },
            data: {
                friends: {
                    connect: { id: friendToAdd.id }
                }
            }
        });

        // Connect the other way too for bidirectional friendship
        await prisma.user.update({
            where: { id: friendToAdd.id },
            data: {
                friends: {
                    connect: { id: currentUser.id }
                }
            }
        });

        // Return the added friend's data
        return NextResponse.json({
            id: friendToAdd.id,
            userName: friendToAdd.userName,
            name: friendToAdd.name,
            email: friendToAdd.email
        });
    } catch (error) {
        console.error("Error adding friend:", error);
        return NextResponse.json(
            { error: "Failed to add friend" },
            { status: 500 }
        );
    }
}
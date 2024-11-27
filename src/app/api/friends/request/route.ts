// app/api/friends/request/route.ts
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

        // Find the current user and the user to send request to
        const [currentUser, receiverUser] = await Promise.all([
            prisma.user.findFirst({
                where: { userName: session.username }
            }),
            prisma.user.findUnique({
                where: { userName }
            })
        ]);

        if (!currentUser || !receiverUser) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Check if request already exists
        const existingRequest = await prisma.friendRequest.findUnique({
            where: {
                senderId_receiverId: {
                    senderId: currentUser.id,
                    receiverId: receiverUser.id
                }
            }
        });

        if (existingRequest) {
            return NextResponse.json(
                { error: "Friend request already sent" },
                { status: 400 }
            );
        }

        // Create friend request
        const friendRequest = await prisma.friendRequest.create({
            data: {
                senderId: currentUser.id,
                receiverId: receiverUser.id,
            }
        });

        return NextResponse.json(friendRequest);
    } catch (error) {
        console.error("Error sending friend request:", error);
        return NextResponse.json(
            { error: "Failed to send friend request" },
            { status: 500 }
        );
    }
}
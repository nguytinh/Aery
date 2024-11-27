// app/api/friends/respond/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/db";
import { auth } from "@/auth";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.username) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { requestId, action } = await req.json();

        const friendRequest = await prisma.friendRequest.findUnique({
            where: { id: requestId },
            include: {
                sender: true,
                receiver: true,
            }
        });

        if (!friendRequest) {
            return NextResponse.json(
                { error: "Friend request not found" },
                { status: 404 }
            );
        }

        if (action === "ACCEPT") {
            // Add both users as friends
            await Promise.all([
                prisma.user.update({
                    where: { id: friendRequest.senderId },
                    data: {
                        friends: {
                            connect: { id: friendRequest.receiverId }
                        }
                    }
                }),
                prisma.user.update({
                    where: { id: friendRequest.receiverId },
                    data: {
                        friends: {
                            connect: { id: friendRequest.senderId }
                        }
                    }
                })
            ]);
        }

        // Update request status
        await prisma.friendRequest.update({
            where: { id: requestId },
            data: { status: action }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error responding to friend request:", error);
        return NextResponse.json(
            { error: "Failed to respond to friend request" },
            { status: 500 }
        );
    }
}
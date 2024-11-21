// app/api/friends/remove/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/db";
import { auth } from "@/auth";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.username) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { friendId } = await req.json();

        // Get current user
        const currentUser = await prisma.user.findFirst({
            where: { userName: session.username }
        });

        if (!currentUser) {
            return NextResponse.json(
                { error: "Current user not found" },
                { status: 404 }
            );
        }

        // Remove the friend connection both ways
        await prisma.user.update({
            where: { id: currentUser.id },
            data: {
                friends: {
                    disconnect: { id: friendId }
                }
            }
        });

        await prisma.user.update({
            where: { id: friendId },
            data: {
                friends: {
                    disconnect: { id: currentUser.id }
                }
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error removing friend:", error);
        return NextResponse.json(
            { error: "Failed to remove friend" },
            { status: 500 }
        );
    }
}
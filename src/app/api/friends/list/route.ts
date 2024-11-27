// app/api/friends/list/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/db";
import { auth } from "@/auth";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.username) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findFirst({
            where: { userName: session.username },
            include: {
                friends: {
                    select: {
                        id: true,
                        userName: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user.friends);
    } catch (error) {
        console.error("Error fetching friends:", error);
        return NextResponse.json(
            { error: "Failed to fetch friends" },
            { status: 500 }
        );
    }
}
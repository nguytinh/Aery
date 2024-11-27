// app/api/friends/pending/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/db";
import { auth } from "@/auth";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.username) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const currentUser = await prisma.user.findFirst({
            where: { userName: session.username },
            include: {
                receivedRequests: {
                    where: { status: "PENDING" },
                    include: {
                        sender: {
                            select: {
                                id: true,
                                userName: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });

        if (!currentUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(currentUser.receivedRequests);
    } catch (error) {
        console.error("Error fetching pending requests:", error);
        return NextResponse.json(
            { error: "Failed to fetch pending requests" },
            { status: 500 }
        );
    }
}
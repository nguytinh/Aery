import { prisma } from "@/app/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const {email} = await req.json()
    console.log('hitting server')
    if (!email) {
        return NextResponse.json('Invalid input.', { status: 400, statusText: 'Missing email.' });
    }
    const user = await prisma.user.findFirst({ where: { email } });
    return NextResponse.json({isUser: (user !== null)});
}
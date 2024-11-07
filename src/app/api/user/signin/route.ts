import { prisma } from "@/app/db"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from 'bcryptjs'

// Will check if user matches user is db
export async function POST(req: NextRequest) {
    const { email, password } = await req.json()
    if (!email || !password) {
        return NextResponse.json('Invalid input.', { status: 400 })
    }

    const user = await prisma.user.findFirst({ where: { email } })
    if (!user) {
        return NextResponse.json('User not found.', { status: 400 })
    }
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        return NextResponse.json('Invalid password.', { status: 400 })
    }

    return NextResponse.json(user)
    
}
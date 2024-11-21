import { prisma } from "@/app/db"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json()
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Invalid input.' }, 
                { status: 400 }
            )
        }

        const user = await prisma.user.findFirst({ 
            where: { email },
            select: {
                id: true,
                email: true,
                userName: true,
                password: true,
            }
        })

        if (!user) {
            return NextResponse.json(
                { error: 'User not found.' }, 
                { status: 400 }
            )
        }

        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            return NextResponse.json(
                { error: 'Invalid password.' }, 
                { status: 400 }
            )
        }

        return NextResponse.json(user)
    } catch (error) {
        console.error('Signin error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
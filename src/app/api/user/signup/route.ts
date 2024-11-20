import { prisma } from "@/app/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    console.log('Sign up API hit.');

    const { email, password, firstName, lastName, userName, aboutMe} = await req.json();
    if (!email || !password  || !aboutMe || !firstName || !lastName || !userName) {
        return NextResponse.json('Invalid input.', { status: 400, statusText: 'Invalid input.' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({ where: { email } });
    if (existingUser) {
        return NextResponse.json('User already exists.', { status: 400, statusText: 'User already exists.' });
    }

    // Hash the password with bcrypt
    const salt = await bcrypt.genSalt(10); // Generate a salt
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password with the salt

    // Create the user in the database
    await prisma.user.create({
        data: {
            name: firstName + ' ' + lastName,
            email,
            userName,
            password: hashedPassword, // Store hashed password
            bio: aboutMe,
        },
    });

    return NextResponse.json({email});
}

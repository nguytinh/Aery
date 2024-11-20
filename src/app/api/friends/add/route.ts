// app/api/friends/add/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from "@/auth";

const prisma = new PrismaClient();

interface AddFriendRequest {
  userName: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: AddFriendRequest = await request.json();
    const { userName } = body;
    
    if (!userName) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get current user from session
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user?.email },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Current user not found' },
        { status: 404 }
      );
    }

    // Find the friend by username
    const friendToAdd = await prisma.user.findUnique({
      where: { userName },
      select: {
        id: true,
        userName: true,
        name: true,
        email: true
      }
    });

    if (!friendToAdd) {
      return NextResponse.json(
        { error: 'User not found' },
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
        { error: 'Already friends with this user' },
        { status: 400 }
      );
    }

    // Add the friend relationship
    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id
      },
      data: {
        friends: {
          connect: {
            id: friendToAdd.id
          }
        }
      }
    });

    return NextResponse.json(friendToAdd);
  } catch (error) {
    console.error('Error adding friend:', error);
    return NextResponse.json(
      { error: 'Failed to add friend' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
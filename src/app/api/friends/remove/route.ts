// app/api/friends/remove/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from "@/auth";

const prisma = new PrismaClient();

interface RemoveFriendRequest {
  friendId: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: RemoveFriendRequest = await request.json();
    const { friendId } = body;
    
    if (!friendId) {
      return NextResponse.json(
        { error: 'Friend ID is required' },
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

    // Check if friend exists in user's friends list
    const friendExists = await prisma.user.findFirst({
      where: {
        id: currentUser.id,
        friends: {
          some: {
            id: friendId
          }
        }
      }
    });

    if (!friendExists) {
      return NextResponse.json(
        { error: 'Friend not found in your friends list' },
        { status: 404 }
      );
    }

    // Remove the friend relationship
    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id
      },
      data: {
        friends: {
          disconnect: {
            id: friendId
          }
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing friend:', error);
    return NextResponse.json(
      { error: 'Failed to remove friend' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
// src/app/api/posts/route.ts
import { prisma } from '../../../lib/prisma';
import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
        image: true,     // Added image field
        author: {
          select: {
            id: true,
            name: true,
            userName: true,
          }
        }
      },
      where: {
        published: true
      },
      orderBy: {
        id: 'desc'
      }
    });

    return NextResponse.json(posts);

  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      console.error('Validation error:', error.message);
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      );
    }

    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
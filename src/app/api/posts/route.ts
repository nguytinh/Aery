// src/app/api/posts/route.ts
import { prisma } from '../../../lib/prisma';
import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { auth } from '@/auth'


export async function POST(request: Request) {
  try {
  
    const session = await auth()

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;

   
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    
    const data = await request.json();
    const { postName, description, imageUrl } = data;

    // Create the new post linked to the authenticated user
    const newPost = await prisma.post.create({
      data: {
        title: postName,
        description,
        published: true,
        imageUrl,
        author: { connect: { id: user.id } }, 
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            userName: true,
          },
        },
      },
    });

    return NextResponse.json(newPost, { status: 201 }); // 201 = Created
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      console.error('Validation error:', error.message);
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      );
    }

    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}



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
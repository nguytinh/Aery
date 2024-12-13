// src/app/api/posts/route.ts
import { prisma } from '../../../lib/prisma';
import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { auth } from '@/auth'
import { dateDiffInDays, isStreakBroken } from '../leaderboard/friends/route';

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
      include: {
        Categories: true // Include categories to check if user already has this category
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const data = await request.json();
    const { postName, description, imageUrl, categoryId } = data;

    // Check if user already has this category
    const hasCategory = user.Categories.some(cat => cat.id === categoryId);

    // Start a transaction to handle all database operations
    const [newPost] = await prisma.$transaction(async (prisma) => {
      // If user doesn't have the category, add it
      if (!hasCategory && categoryId) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            Categories: {
              connect: { id: categoryId }
            }
          }
        });
      }

      // Create the post with category
      const post = await prisma.post.create({
        data: {
          title: postName,
          content: description,
          published: true,
          image: imageUrl,
          author: { connect: { id: user.id } },
          Category: categoryId ? { connect: { id: categoryId } } : undefined,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              userName: true,
            },
          },
          Category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Handle streak
      if (categoryId) {
        const existingStreak = await prisma.streak.findUnique({
          where: {
            userId_categoryId: {
              userId: user.id,
              categoryId: categoryId,
            },
          },
        });

        if (existingStreak && (dateDiffInDays(existingStreak.lastPostDate, new Date()) === 1)) {
          await prisma.streak.update({
            where: {
              userId_categoryId: {
                userId: user.id,
                categoryId: categoryId,
              },
            },
            data: {
                lastPostDate: new Date(),
              currentStreak: existingStreak.currentStreak + 1,
            },
          });
        } else {
          await prisma.streak.create({
            data: {
              userId: user.id,
              categoryId: categoryId,
              currentStreak: 1,
              lastPostDate: new Date(),
            },
          });
        }
      }

      return [post];
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
        image: true,
        author: {
          select: {
            id: true,
            name: true,
            userName: true,
          }
        },
        Category: {
          select: {
            id: true,
            name: true,
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
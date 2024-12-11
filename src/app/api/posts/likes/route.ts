import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(request: Request) {
    try {
        const session = await auth();
        console.log('Session in API route:', session); // Debug log
        
        if (!session?.user?.id) {
            console.log('No session or user ID found'); // Debug log
            return NextResponse.json(
                { error: 'Unauthorized - Please log in to like posts' },
                { status: 401 }
            );
        }

        const { postId } = await request.json();
        const userId = parseInt(session.user.id);

        console.log('Processing like for:', { userId, postId }); // Debug log

        // Parse postId to ensure it's a number
        const parsedPostId = parseInt(postId.toString());

        if (isNaN(parsedPostId)) {
            return NextResponse.json(
                { error: 'Invalid post ID' },
                { status: 400 }
            );
        }


        const existingLike = await prisma.like.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId: parsedPostId
                }
            }
        });

        console.log('Existing like:', existingLike); // Debug log

        if (existingLike) {
            // Toggle existing like
            const updatedLike = await prisma.like.update({
                where: {
                    userId_postId: {
                        userId,
                        postId: parsedPostId
                    }
                },
                data: {
                    liked: !existingLike.liked
                }
            });

            return NextResponse.json({
                success: true,
                liked: updatedLike.liked
            });
        } else {
            // Create new like
            const newLike = await prisma.like.create({
                data: {
                    userId,
                    postId: parsedPostId,
                    liked: true
                }
            });

            return NextResponse.json({
                success: true,
                liked: newLike.liked
            });
        }
    } catch (error) {
        console.error('Error in like route:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
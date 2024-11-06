// src/app/api/test-connection/route.ts
import { prisma } from '../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await prisma.$connect();
    
    // Try a simple query
    const userCount = await prisma.user.count();
    const postCount = await prisma.post.count();

    return NextResponse.json({
      success: true,
      connection: 'OK',
      counts: {
        users: userCount,
        posts: postCount
      }
    });

  } catch (error) {
    console.error('Connection error:', error);
    return NextResponse.json({
      success: false,
      error: 'Connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
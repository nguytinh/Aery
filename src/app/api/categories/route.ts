// src/app/api/categories/route.ts
import { prisma } from '../../../lib/prisma';
import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
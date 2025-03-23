import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Mark this route as dynamic
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Disable static generation for this route
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    return NextResponse.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}
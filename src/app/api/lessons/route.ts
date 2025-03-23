import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

// Disable static generation for this route
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export async function GET() {
  try {
    const lessons = await prisma.lesson.findMany({
      include: {
        student: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    });
    
    return NextResponse.json(lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.title || !data.startTime || !data.endTime || !data.studentId) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          required: ['title', 'startTime', 'endTime', 'studentId']
        },
        { status: 400 }
      );
    }

    // Validate student exists
    const student = await prisma.student.findUnique({
      where: { id: data.studentId },
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    const lesson = await prisma.lesson.create({
      data: {
        title: data.title,
        description: data.description,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        studentId: data.studentId,
      },
      include: {
        student: true,
      },
    });

    return NextResponse.json(lesson, { status: 201 });
  } catch (error) {
    console.error('Error creating lesson:', error);
    return NextResponse.json(
      { error: 'Failed to create lesson' },
      { status: 500 }
    );
  }
} 
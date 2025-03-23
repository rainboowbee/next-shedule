import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
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
    
    return new NextResponse(JSON.stringify(lessons), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch lessons' }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.title || !data.startTime || !data.endTime || !data.studentId) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'Missing required fields',
          required: ['title', 'startTime', 'endTime', 'studentId']
        }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Validate student exists
    const student = await prisma.student.findUnique({
      where: { id: data.studentId },
    });

    if (!student) {
      return new NextResponse(
        JSON.stringify({ error: 'Student not found' }),
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        }
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

    return new NextResponse(JSON.stringify(lesson), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error creating lesson:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to create lesson' }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
} 
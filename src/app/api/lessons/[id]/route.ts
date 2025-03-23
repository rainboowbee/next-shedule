import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// This is needed for Next.js to know which paths to pre-render
export async function generateStaticParams() {
  return [];
}

// Получение урока по ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return NextResponse.json(
      { error: 'Lesson ID is required' },
      { status: 400 }
    );
  }

  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: params.id },
      include: { student: true },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(lesson);
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lesson' },
      { status: 500 }
    );
  }
}

// Обновление урока
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return NextResponse.json(
      { error: 'Lesson ID is required' },
      { status: 400 }
    );
  }

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

    const lesson = await prisma.lesson.update({
      where: { id: params.id },
      data: {
        title: data.title,
        description: data.description,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        studentId: data.studentId,
      },
      include: { student: true },
    });

    return NextResponse.json(lesson);
  } catch (error) {
    console.error('Error updating lesson:', error);
    return NextResponse.json(
      { error: 'Failed to update lesson' },
      { status: 500 }
    );
  }
}

// Удаление урока
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return NextResponse.json(
      { error: 'Lesson ID is required' },
      { status: 400 }
    );
  }

  try {
    // Validate lesson exists
    const existingLesson = await prisma.lesson.findUnique({
      where: { id: params.id },
    });

    if (!existingLesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    await prisma.lesson.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    return NextResponse.json(
      { error: 'Failed to delete lesson' },
      { status: 500 }
    );
  }
}

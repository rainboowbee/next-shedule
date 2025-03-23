'use client';

import { useState, useEffect } from 'react';
import { Lesson, Student } from '@prisma/client';
import LessonList from '@/components/LessonList';
import LessonForm from '@/components/LessonForm';

type LessonWithStudent = Lesson & {
  student: Student;
};

export default function LessonsPage() {
  const [lessons, setLessons] = useState<LessonWithStudent[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<LessonWithStudent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lessonsResponse, studentsResponse] = await Promise.all([
          fetch('/api/lessons'),
          fetch('/api/students'),
        ]);

        if (!lessonsResponse.ok || !studentsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const [lessonsData, studentsData] = await Promise.all([
          lessonsResponse.json(),
          studentsResponse.json(),
        ]);

        setLessons(lessonsData);
        setStudents(studentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateLesson = async (data: any) => {
    try {
      const response = await fetch('/api/lessons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create lesson');
      }

      const newLesson = await response.json();
      setLessons([...lessons, newLesson]);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error creating lesson:', error);
    }
  };

  const handleUpdateLesson = async (data: any) => {
    if (!editingLesson) return;

    try {
      const response = await fetch(`/api/lessons/${editingLesson.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update lesson');
      }

      const updatedLesson = await response.json();
      setLessons(lessons.map((l) => (l.id === updatedLesson.id ? updatedLesson : l)));
      setEditingLesson(null);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error updating lesson:', error);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    try {
      const response = await fetch(`/api/lessons/${lessonId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete lesson');
      }

      setLessons(lessons.filter((l) => l.id !== lessonId));
    } catch (error) {
      console.error('Error deleting lesson:', error);
    }
  };

  const handleEditLesson = (lesson: LessonWithStudent) => {
    setEditingLesson(lesson);
    setIsFormOpen(true);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600 dark:text-gray-400">Загрузка...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Расписание занятий
        </h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
        >
          Добавить занятие
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              {editingLesson ? 'Редактировать занятие' : 'Создать занятие'}
            </h2>
            <LessonForm
              lesson={editingLesson || undefined}
              students={students}
              onSubmit={editingLesson ? handleUpdateLesson : handleCreateLesson}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingLesson(null);
              }}
            />
          </div>
        </div>
      )}

      {lessons.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-400 py-8">
          Нет запланированных занятий
        </div>
      ) : (
        <LessonList
          lessons={lessons}
          onEdit={handleEditLesson}
          onDelete={handleDeleteLesson}
        />
      )}
    </div>
  );
} 
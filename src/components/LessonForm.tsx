import type { Lesson, Student } from '@prisma/client';
import { useForm } from 'react-hook-form';

type LessonWithStudent = Lesson & {
  student: Student;
};

interface LessonFormProps {
  lesson?: LessonWithStudent;
  students: Student[];
  onSubmit: (data: LessonFormData) => void;
  onCancel: () => void;
}

interface LessonFormData {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  studentId: string;
}

export default function LessonForm({ lesson, students, onSubmit, onCancel }: LessonFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<LessonFormData>({
    defaultValues: lesson
      ? {
          title: lesson.title,
          description: lesson.description || '',
          startTime: new Date(lesson.startTime).toISOString().slice(0, 16),
          endTime: new Date(lesson.endTime).toISOString().slice(0, 16),
          studentId: lesson.studentId,
        }
      : undefined,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Название
        </label>
        <input
          type="text"
          id="title"
          {...register('title', { required: 'Обязательное поле' })}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Описание
        </label>
        <textarea
          id="description"
          {...register('description')}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Время начала
          </label>
          <input
            type="datetime-local"
            id="startTime"
            {...register('startTime', { required: 'Обязательное поле' })}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
          />
          {errors.startTime && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.startTime.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Время окончания
          </label>
          <input
            type="datetime-local"
            id="endTime"
            {...register('endTime', { required: 'Обязательное поле' })}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
          />
          {errors.endTime && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.endTime.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Студент
        </label>
        <select
          id="studentId"
          {...register('studentId', { required: 'Обязательное поле' })}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
        >
          <option value="">Выберите студента</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name}
            </option>
          ))}
        </select>
        {errors.studentId && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.studentId.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Отмена
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
        >
          {lesson ? 'Сохранить' : 'Создать'}
        </button>
      </div>
    </form>
  );
} 
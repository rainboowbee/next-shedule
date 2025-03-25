import type { Lesson, Student } from '@prisma/client';
import { format, toZonedTime } from 'date-fns-tz';
import { ru } from 'date-fns/locale';

type LessonWithStudent = Lesson & {
  student: Student;
};

interface LessonListProps {
  lessons: LessonWithStudent[];
  onEdit: (lesson: LessonWithStudent) => void;
  onDelete: (id: string) => void;
}

export default function LessonList({ lessons, onEdit, onDelete }: LessonListProps) {
  // Функция для конвертации времени в МСК
  const toMoscowTime = (date: Date | string) => {
    const moscowTimeZone = 'Europe/Moscow';
    return toZonedTime(new Date(date), moscowTimeZone);
  };

  // Группируем занятия по дням недели
  const groupedLessons = lessons.reduce((acc, lesson) => {
    const lessonDate = toMoscowTime(lesson.startTime);
    const dayKey = format(lessonDate, 'yyyy-MM-dd', { timeZone: 'Europe/Moscow' });
    const dayOfWeek = format(lessonDate, 'EEEE', { locale: ru, timeZone: 'Europe/Moscow' });
    
    if (!acc[dayKey]) {
      acc[dayKey] = {
        date: lessonDate,
        dayOfWeek,
        lessons: []
      };
    }
    acc[dayKey].lessons.push(lesson);
    return acc;
  }, {} as Record<string, { date: Date; dayOfWeek: string; lessons: LessonWithStudent[] }>);

  // Сортируем дни по дате
  const sortedDays = Object.entries(groupedLessons)
    .sort(([, a], [, b]) => a.date.getTime() - b.date.getTime());

  return (
    <div className="space-y-8">
      {sortedDays.map(([dayKey, { date, dayOfWeek, lessons }]) => (
        <div key={dayKey} className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 capitalize">
            {dayOfWeek}, {format(date, 'd MMMM', { locale: ru, timeZone: 'Europe/Moscow' })}
          </h2>
          <div className="space-y-4">
            {lessons
              .sort((a, b) => toMoscowTime(a.startTime).getTime() - toMoscowTime(b.startTime).getTime())
              .map((lesson) => (
                <div
                  key={lesson.id}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {lesson.title}
                      </h3>
                      {lesson.description && (
                        <p className="mt-1 text-gray-600 dark:text-gray-300">
                          {lesson.description}
                        </p>
                      )}
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {format(toMoscowTime(lesson.startTime), 'HH:mm', { timeZone: 'Europe/Moscow' })} -{' '}
                          {format(toMoscowTime(lesson.endTime), 'HH:mm', { timeZone: 'Europe/Moscow' })}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                          Студент:{' '}
                          <span
                            className="font-medium px-2 py-1 rounded inline-block text-gray-900 dark:text-white"
                            style={{ 
                              backgroundColor: lesson.student.color + '40'
                            }}
                          >
                            {lesson.student.name}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(lesson)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      >
                        Редактировать
                      </button>
                      <button
                        onClick={() => onDelete(lesson.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
} 
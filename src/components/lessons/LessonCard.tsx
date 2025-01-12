import Link from "next/link";
import { type Lesson, type UserProgress } from "@prisma/client";

interface LessonCardProps {
  lesson: Lesson & {
    exercises: { id: string }[];
    progress: UserProgress[];
  };
}

export default function LessonCard({ lesson }: LessonCardProps) {
  const totalExercises = lesson.exercises.length;
  const completedExercises = lesson.progress.filter(p => p.completed).length;
  const isCompleted = completedExercises === totalExercises;

  return (
    <Link
      href={`/lesson/${lesson.id}`}
      className={`block p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow ${
        isCompleted ? "bg-green-50" : "bg-white"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">{lesson.title}</h3>
        {isCompleted && (
          <span className="text-green-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </span>
        )}
      </div>
      <p className="text-gray-600 mb-4">{lesson.description}</p>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">
          {completedExercises} de {totalExercises} exercícios completos
        </span>
        <span className="text-blue-600 font-medium">Começar →</span>
      </div>
    </Link>
  );
} 
import Link from "next/link";
import { type Lesson, type UserProgress } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

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
    <Card className={`shadow-lg hover:shadow-xl transition-shadow ${
      isCompleted ? "bg-secondary/10" : "bg-white"
    }`}>
      <CardHeader>
        <div className="flex items-center gap-4">
          <CardTitle className="text-2xl">{lesson.title}</CardTitle>
          {isCompleted && (
            <span className="text-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
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
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-lg text-slate-600">{lesson.description}</p>
        
        <div className="space-y-4">
          {/* Barra de Progresso */}
          <div className="w-full bg-slate-100 rounded-full h-4">
            <div
              className={`h-full rounded-full ${
                isCompleted ? "bg-secondary" : "bg-primary"
              }`}
              style={{ width: `${(completedExercises / totalExercises) * 100}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-lg text-slate-600">
              {completedExercises} de {totalExercises} exercícios completos
            </span>
            <Link href={`/lesson/${lesson.id}`}>
              <Button size="lg" className="text-lg px-6">
                {isCompleted ? "Revisar" : "Continuar"} →
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 
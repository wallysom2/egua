import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { db } from "~/server/db";
import LessonCard from "~/components/lessons/LessonCard";
import ProgressChart from "~/components/lessons/ProgressChart";
import { UserMenu } from "~/components/UserMenu";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const lessons = await db.lesson.findMany({
    orderBy: { order: "asc" },
    include: {
      exercises: true,
      progress: {
        where: {
          userId: session.user.id
        }
      }
    }
  });

  const completedLessons = lessons.filter(lesson => 
    lesson.exercises.every(exercise => 
      lesson.progress.some(p => p.exerciseId === exercise.id && p.completed)
    )
  ).length;

  const progressPercentage = (completedLessons / lessons.length) * 100;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Bem-vindo ao Égua Learning!</h1>
        <UserMenu user={session.user} />
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Seu Progresso</h2>
        <ProgressChart percentage={progressPercentage} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            progress={lesson.progress}
          />
        ))}
      </div>
    </div>
  );
} 
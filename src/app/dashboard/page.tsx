import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { db } from "~/server/db";
import LessonCard from "~/components/lessons/LessonCard";
import ProgressChart from "~/components/lessons/ProgressChart";
import { UserMenu } from "~/components/UserMenu";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

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
    <main className="min-h-screen bg-background">
      {/* Header com navegação */}
      <nav className="container mx-auto px-6 py-6 bg-white shadow-sm">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">Égua Learning</h1>
          <UserMenu user={session.user} />
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        {/* Seção de Boas-vindas e Progresso */}
        <div className="mb-12">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl">
                Olá, {session.user.name}! 👋
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <p className="text-xl text-slate-600">
                  Continue sua jornada de aprendizado
                </p>
                <div className="p-6 bg-primary/5 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Seu Progresso</h3>
                  <ProgressChart percentage={progressPercentage} />
                  <p className="text-lg mt-4 text-center">
                    Você completou <span className="font-bold text-primary">{completedLessons}</span> de{" "}
                    <span className="font-bold text-primary">{lessons.length}</span> lições
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Lições */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Suas Lições</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                progress={lesson.progress}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
} 
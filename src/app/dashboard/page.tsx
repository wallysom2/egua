import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { db } from "~/server/db";
import LessonCard from "~/components/lessons/LessonCard";
import { UserMenu } from "~/components/UserMenu";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
// Se estiver usando shadcn/ui, importe o Progress:
import { Progress } from "~/components/ui/progress"; 

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
          userId: session.user.id,
        },
      },
    },
  });

  const completedLessons = lessons.filter((lesson) =>
    lesson.exercises.every((exercise) =>
      lesson.progress.some((p) => p.exerciseId === exercise.id && p.completed)
    )
  ).length;

  // Cálculo do progresso em percentual
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
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex-1">
                <CardTitle className="text-2xl md:text-3xl mb-2">
                  Olá, {session.user.name}! 👋
                </CardTitle>
              </div>

              {/* Indicação de progresso - 20% do espaço */}
              <div className="w-[20%] min-w-[140px] flex flex-col items-center">
                <div className="flex items-center gap-2 mb-2">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                  <span className="text-lg font-medium">
                    {completedLessons}/{lessons.length}
                  </span>
                </div>
                <Progress 
                  value={progressPercentage} 
                  className="h-2 bg-slate-200" 
                />
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Lista de Lições */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Suas Lições</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {lessons.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

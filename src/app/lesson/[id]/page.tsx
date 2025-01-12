import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { db } from "~/server/db";
import { notFound } from "next/navigation";
import CodeEditor from "~/components/lessons/CodeEditor";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ThemeToggle } from "~/components/ThemeToggle";

interface PageProps {
  params: { id: string };
}

export default async function LessonPage({ params }: PageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const id = params?.id;
  if (!id) {
    notFound();
  }

  const lesson = await db.lesson.findUnique({
    where: { id },
    include: {
      exercises: {
        orderBy: {
          createdAt: 'asc'
        }
      },
      progress: {
        where: {
          userId: session.user.id,
        },
      },
    },
  });

  if (!lesson) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background dark:bg-[#0A0F1C] font-roboto">
      {/* Header com navegação */}
      <nav className="w-full px-14 py-6 bg-card shadow-sm border-b dark:border-[#1E293B]/30 dark:bg-[#111827]/70 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-poppins font-bold tracking-tight">
            <span className="bg-gradient-to-r from-[#3B82F6] via-[#6366F1] to-[#8B5CF6] dark:from-[#60A5FA] dark:via-[#818CF8] dark:to-[#A78BFA] bg-clip-text text-transparent">
              {lesson.title}
            </span>
          </h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/dashboard">
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg dark:bg-[#1E293B] dark:border-[#1E293B] dark:text-[#F1F5F9] dark:hover:bg-[#1E293B]/90"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Voltar ao Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Conteúdo da Lição */}
          <Card className="bg-card border shadow-lg hover:shadow-xl transition-shadow dark:bg-[#111827]/50 dark:border-[#1E293B]/30 dark:hover:shadow-primary/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-poppins dark:text-[#F1F5F9]">Conteúdo da Lição</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-lg max-w-none dark:prose-invert">
                {lesson.content.split("\n").map((line, i) => (
                  <p key={i} className="text-lg leading-relaxed mb-6 text-slate-600 dark:text-[#94A3B8]">
                    {line}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Editor de Código e Exercícios */}
          <div className="space-y-8">
            {lesson.exercises.map((exercise, index) => (
              <Card key={exercise.id} className="bg-card border shadow-lg hover:shadow-xl transition-shadow dark:bg-[#111827]/50 dark:border-[#1E293B]/30 dark:hover:shadow-primary/5 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-poppins dark:text-[#F1F5F9]">
                    Exercício {index + 1}: {exercise.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-lg text-slate-600 dark:text-[#94A3B8]">{exercise.description}</p>
                  
                  <CodeEditor
                    exerciseId={exercise.id}
                    lessonId={lesson.id}
                    expectedOutput={exercise.expectedOutput}
                    expectedCode={exercise.expectedCode}
                    initialCode=""
                    isCompleted={lesson.progress.some(
                      (p) => p.exerciseId === exercise.id && p.completed
                    )}
                    description={exercise.description}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
} 
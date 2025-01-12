import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { db } from "~/server/db";
import { notFound } from "next/navigation";
import CodeEditor from "~/components/lessons/CodeEditor";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

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
    <main className="min-h-screen bg-background">
      {/* Header com navegação */}
      <nav className="container mx-auto px-6 py-6 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary">{lesson.title}</h1>
          <Link href="/dashboard">
            <Button variant="outline" size="lg" className="text-lg">
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
      </nav>
      
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Conteúdo da Lição */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Conteúdo da Lição</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-lg max-w-none">
                {lesson.content.split("\n").map((line, i) => (
                  <p key={i} className="text-lg leading-relaxed mb-6">
                    {line}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Editor de Código e Exercícios */}
          <div className="space-y-8">
            {lesson.exercises.map((exercise, index) => (
              <Card key={exercise.id} className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">
                    Exercício {index + 1}: {exercise.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-lg text-slate-600">{exercise.description}</p>
                  
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
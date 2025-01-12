import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { db } from "~/server/db";
import { notFound } from "next/navigation";
import CodeEditor from "~/components/lessons/CodeEditor";
import Link from "next/link";

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{lesson.title}</h1>
        <Link
          href="/dashboard"
          className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
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
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Conteúdo da Lição */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="prose max-w-none">
            {lesson.content.split("\n").map((line, i) => (
              <p key={i} className="mb-4">
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* Editor de Código e Exercício */}
        <div className="space-y-6">
          {lesson.exercises.map((exercise) => (
            <div key={exercise.id} className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">{exercise.title}</h3>
              <p className="text-gray-600 mb-6">{exercise.description}</p>
              
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import CodeEditor from "~/components/lessons/CodeEditor";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ThemeToggle } from "~/components/ThemeToggle";
import { Badge } from "~/components/ui/badge";
import { Progress } from "~/components/ui/progress";
import { useLessonStore } from "~/stores/lesson-store";
import ReactMarkdown from "react-markdown";

export default function LessonPage() {
  const router = useRouter();
  const lesson = useLessonStore((state) => state.currentLesson);

  useEffect(() => {
    if (!lesson) {
      router.push("/dashboard");
    }
  }, [lesson, router]);

  if (!lesson) {
    return null;
  }

  // Calcular progresso da lição
  const completedExercises = lesson.progress.filter((p) => p.completed).length;
  const totalExercises = lesson.exercises.length;
  const progressPercentage = (completedExercises / totalExercises) * 100;

  // Verificar se todos os exercícios foram completados
  const isLessonCompleted = completedExercises === totalExercises;

  return (
    <main className="min-h-screen bg-background dark:bg-dark-background font-roboto">
      {/* Header com navegação e progresso */}
      <nav className="w-full px-14 py-6 bg-card/80 shadow-lg border-b dark:border-[#1E293B]/30 dark:bg-dark-card/70 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex flex-col gap-4 max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-poppins font-bold tracking-tight">
                  {lesson.title}
              </h1>
              <div className="flex items-center gap-4">
                <Progress value={progressPercentage} className="w-48 h-2" />
                <span className="text-sm text-muted-foreground">
                  {completedExercises} de {totalExercises} exercícios completos
                </span>
                {isLessonCompleted && (
                  <Badge variant="success" className="text-sm">
                    Lição Concluída
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link href="/dashboard">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg dark:bg-dark-secondary dark:border-[#1E293B] dark:text-[#F2F2F2] dark:hover:bg-dark-secondary/90 gap-2 h-12"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Voltar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto px-6 py-12 max-w-[1400px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Conteúdo */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Card className="bg-card/50 border shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-dark-card/50 dark:border-[#1E293B]/30 dark:hover:shadow-primary/5 backdrop-blur-sm">
              <CardHeader className="space-y-2">
                <CardTitle className="text-3xl font-poppins text-slate-800 dark:text-slate-100 flex items-center gap-3">
                  <span className="h-8 w-1 bg-gradient-to-b from-[#3B82F6] to-[#8B5CF6] rounded-full" />
                  Material da Lição
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <ReactMarkdown 
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[#3B82F6] via-[#6366F1] to-[#8B5CF6] dark:from-[#60A5FA] dark:via-[#818CF8] dark:to-[#A78BFA] bg-clip-text text-transparent">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-2xl font-semibold mb-4 text-slate-800 dark:text-[#F2F2F2]">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-xl font-medium mb-3 text-slate-700 dark:text-[#F2F2F2]">
                          {children}
                        </h3>
                      ),
                      p: ({ children, ...props }) => {
                        return (
                          <p className="text-lg leading-relaxed mb-6 text-slate-700 dark:text-[#F2F2F2]" {...props}>
                            {children}
                          </p>
                        );
                      },
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside space-y-2 mb-6">
                          {children}
                        </ul>
                      ),
                      li: ({ children }) => (
                        <li className="text-lg text-slate-700 dark:text-[#F2F2F2]">
                          {children}
                        </li>
                      ),
                      code: ({ children, className }) => {
                        const match = /language-(\w+)/.exec(className ?? '');
                        const language = match ? match[1] : 'egua';

                        // Se não tiver linguagem especificada, é um código inline
                        if (!className?.includes('language-')) {
                          return (
                            <code className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-sm">
                              {children}
                            </code>
                          );
                        }

                        return (
                          <div className="relative mb-6 not-prose">
                            <div className="absolute top-0 right-0 px-4 py-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-bl-lg font-mono">
                              {language}
                            </div>
                            <pre className="overflow-x-auto p-6 bg-slate-100 dark:bg-slate-800 rounded-lg">
                              <code className="text-lg text-slate-800 dark:text-slate-200 font-mono block">
                                {children}
                              </code>
                            </pre>
                          </div>
                        );
                      },
                      strong: ({ children }) => (
                        <strong className="font-semibold text-slate-900 dark:text-[#F2F2F2]">
                          {children}
                        </strong>
                      ),
                    }}
                  >
                    {lesson.content}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Exercícios */}
          <div className="space-y-8">
            {lesson.exercises.map((exercise, index) => {
              const isCompleted = lesson.progress.some(
                (p) => p.exerciseId === exercise.id && p.completed
              );
              const isPrevCompleted = index === 0 || (
                lesson.exercises[index - 1] && lesson.progress.some(
                  (p) => p.exerciseId === lesson.exercises[index - 1]!.id && p.completed
                )
              );

              return (
                <Card 
                  key={exercise.id} 
                  className={`bg-card/50 border shadow-lg transition-all duration-300 
                    ${!isPrevCompleted ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'}
                    dark:bg-dark-card/50 dark:border-[#1E293B]/30 dark:hover:shadow-primary/5 backdrop-blur-sm`}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div className="space-y-1.5">
                      <CardTitle className="text-2xl font-poppins dark:text-[#F2F2F2] flex items-center gap-4">
                        <span className="flex items-center gap-2">
                          <span className="h-6 w-6 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center text-white font-medium">
                            {index + 1}
                          </span>
                          {exercise.title}
                        </span>
                        {isCompleted && (
                          <Badge variant="success" className="ml-2">Completo</Badge>
                        )}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {isPrevCompleted ? (
                      <>
                        <p className="text-lg text-slate-600 dark:text-[#F2F2F2]">{exercise.description}</p>
                        <CodeEditor
                          exerciseId={exercise.id}
                          lessonId={lesson.id}
                          expectedOutput={exercise.expectedOutput}
                          expectedCode={exercise.expectedCode}
                          initialCode=""
                          isCompleted={isCompleted}
                          description={exercise.description}
                        />
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <div className="flex flex-col items-center gap-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 text-slate-400 dark:text-slate-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                          <p className="text-lg text-slate-500 dark:text-slate-400">
                            Complete o exercício anterior para desbloquear este exercício.
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
} 
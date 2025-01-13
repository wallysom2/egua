"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import CodeEditor from "~/components/lessons/CodeEditor";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ThemeToggle } from "~/components/ThemeToggle";
import { Progress } from "~/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Badge } from "~/components/ui/badge";
import { useLessonStore } from "~/stores/lesson-store";

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
    <main className="min-h-screen bg-background dark:bg-[#0A0F1C] font-roboto">
      {/* Header com navegação e progresso */}
      <nav className="w-full px-14 py-6 bg-card shadow-sm border-b dark:border-[#1E293B]/30 dark:bg-[#111827]/70 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex flex-col gap-4">
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
          
          {/* Barra de Progresso */}
          <div className="flex items-center gap-4">
            <Progress value={progressPercentage} className="h-3" />
            <span className="text-sm font-medium">
              {completedExercises}/{totalExercises} Exercícios
            </span>
            {isLessonCompleted && (
              <Badge variant="success" className="ml-2">
                Lição Completa!
              </Badge>
            )}
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto px-6 py-12">
        <Tabs defaultValue="content" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="content">Conteúdo</TabsTrigger>
            <TabsTrigger value="exercises">Exercícios</TabsTrigger>
            <TabsTrigger value="achievements">Conquistas</TabsTrigger>
          </TabsList>

          {/* Aba de Conteúdo */}
          <TabsContent value="content">
            <Card className="bg-card border shadow-lg hover:shadow-xl transition-shadow dark:bg-[#111827]/50 dark:border-[#1E293B]/30 dark:hover:shadow-primary/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-poppins dark:text-[#F1F5F9]">Material da Lição</CardTitle>
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
          </TabsContent>

          {/* Aba de Exercícios */}
          <TabsContent value="exercises" className="space-y-8">
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
                  className={`bg-card border shadow-lg transition-all duration-300 
                    ${!isPrevCompleted ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'}
                    dark:bg-[#111827]/50 dark:border-[#1E293B]/30 dark:hover:shadow-primary/5 backdrop-blur-sm`}
                >
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-2xl font-poppins dark:text-[#F1F5F9] flex items-center gap-4">
                      Exercício {index + 1}: {exercise.title}
                      {isCompleted && (
                        <Badge variant="success">Completo</Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {isPrevCompleted ? (
                      <>
                        <p className="text-lg text-slate-600 dark:text-[#94A3B8]">{exercise.description}</p>
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
                        <p className="text-lg text-slate-500 dark:text-slate-400">
                          Complete o exercício anterior para desbloquear este exercício.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* Aba de Conquistas */}
          <TabsContent value="achievements">
            <Card className="bg-card border shadow-lg dark:bg-[#111827]/50 dark:border-[#1E293B]/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-poppins dark:text-[#F1F5F9]">Suas Conquistas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Conquista de Conclusão */}
                  <div className={`p-6 rounded-lg border-2 ${isLessonCompleted ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20' : 'border-slate-200 bg-slate-50/50 dark:bg-slate-900/20'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${isLessonCompleted ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">Mestre da Lição</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Complete todos os exercícios</p>
                      </div>
                    </div>
                  </div>

                  {/* Conquista de Sequência */}
                  <div className={`p-6 rounded-lg border-2 ${completedExercises >= 3 ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20' : 'border-slate-200 bg-slate-50/50 dark:bg-slate-900/20'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${completedExercises >= 3 ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">Em Sequência</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Complete 3 exercícios seguidos</p>
                      </div>
                    </div>
                  </div>

                  {/* Conquista de Velocidade */}
                  <div className={`p-6 rounded-lg border-2 border-slate-200 bg-slate-50/50 dark:bg-slate-900/20`}>
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-slate-300">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">Velocista</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Complete a lição em menos de 30 minutos</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
} 
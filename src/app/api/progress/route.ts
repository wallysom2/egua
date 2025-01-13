import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { z } from "zod";

const progressSchema = z.object({
  exerciseId: z.string(),
  lessonId: z.string(),
  code: z.string().optional(),
  completed: z.boolean(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const body = await req.json() as z.infer<typeof progressSchema>;
    const result = progressSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: result.error.errors },
        { status: 400 }
      );
    }

    const { exerciseId, lessonId, code, completed } = result.data;

    // Verificar se o exercício e a lição existem
    const [exercise, lesson] = await Promise.all([
      db.exercise.findUnique({
        where: { id: exerciseId }
      }),
      db.lesson.findUnique({
        where: { id: lessonId }
      })
    ]);

    if (!exercise || !lesson) {
      return NextResponse.json(
        { error: "Exercício ou lição não encontrados" },
        { status: 404 }
      );
    }

    // Verificar se o exercício pertence à lição
    if (exercise.lessonId !== lessonId) {
      return NextResponse.json(
        { error: "O exercício não pertence a esta lição" },
        { status: 400 }
      );
    }

    const progress = await db.userProgress.upsert({
      where: {
        userId_lessonId_exerciseId: {
          userId: session.user.id,
          lessonId,
          exerciseId,
        },
      },
      update: {
        completed,
        code: code ?? "",
      },
      create: {
        userId: session.user.id,
        lessonId,
        exerciseId,
        completed,
        code: code ?? "",
      },
    });

    return NextResponse.json({ progress }, { status: 200 });
  } catch (error) {
    console.error("[PROGRESS_ERROR]", error);
    return NextResponse.json(
      { error: "Erro ao salvar progresso" },
      { status: 500 }
    );
  }
} 
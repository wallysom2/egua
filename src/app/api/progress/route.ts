import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { exerciseId, lessonId, code, completed } = body;

    if (!exerciseId || !lessonId || completed === undefined) {
      return NextResponse.json(
        { error: "Dados inválidos" },
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
        code,
      },
      create: {
        userId: session.user.id,
        lessonId,
        exerciseId,
        completed,
        code,
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
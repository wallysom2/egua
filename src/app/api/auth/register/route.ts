import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { registerSchema, type RegisterInput } from "~/lib/validations/auth";

export async function POST(req: Request) {
  try {
    const json = (await req.json()) as RegisterInput;
    const body = registerSchema.parse(json);

    const existingUser = await db.user.findUnique({
      where: { email: body.email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Este email já está em uso" },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(body.password, 12);

    const user = await db.user.create({
      data: {
        name: body.name,
        email: body.email.toLowerCase(),
        password: hashedPassword,
        role: "user",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json(
      { user },
      { status: 201 }
    );
  } catch (error) {
    console.error("[REGISTER_ERROR]", {
      message: error instanceof Error ? error.message : "Erro desconhecido",
      stack: error instanceof Error ? error.stack : undefined,
      details: error
    });

    const errorMessage = error instanceof Error 
      ? `Erro ao criar conta: ${error.message}`
      : "Algo deu errado ao criar sua conta.";

    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === "development" ? error : undefined
      },
      { status: 500 }
    );
  }
} 
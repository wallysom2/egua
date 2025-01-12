import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { code, exerciseDescription, expectedOutput, actualOutput } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Como professor de programação, analise o seguinte código em Égua:
      
      Descrição do exercício: ${exerciseDescription}
      Saída esperada: ${expectedOutput}
      Saída atual: ${actualOutput}
      
      Código do aluno:
      ${code}
      
      Por favor, forneça um feedback construtivo e humanizado que:
      1. Identifique o que o aluno fez corretamente
      2. Aponte gentilmente os erros, se houverem
      3. Dê dicas específicas de como melhorar
      4. Encoraje o aluno a continuar tentando
      
      Mantenha o tom amigável e motivador. Limite a resposta a 3-4 frases.
    `;

    const result = await model.generateContent(prompt);
    const feedback = result.response.text();

    return NextResponse.json({ feedback }, { status: 200 });
  } catch (error) {
    console.error("[FEEDBACK_ERROR]", error);
    return NextResponse.json(
      { error: "Erro ao gerar feedback" },
      { status: 500 }
    );
  }
} 
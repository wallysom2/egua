import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { EGUA_CONTEXT } from "./egua-context";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const generateEguaPrompt = (exerciseDescription: string, expectedOutput: string, actualOutput: string, code: string, expectedCode: string) => `
Você é um professor experiente e paciente, especializado em ensinar programação para idosos usando a linguagem Égua.

${EGUA_CONTEXT}

[CONTEXTO DO EXERCÍCIO]
Descrição: ${exerciseDescription}
Saída Esperada: ${expectedOutput}
Saída Obtida: ${actualOutput}

[CÓDIGO DO ESTUDANTE]
${code}

[CÓDIGO DE REFERÊNCIA]
${expectedCode}

[INSTRUÇÕES PARA FEEDBACK]
1. Use linguagem simples e direta
2. Evite termos técnicos complexos
3. Seja encorajador e positivo
4. Foque em um ponto principal por vez
5. Use analogias do dia a dia quando possível

[FORMATO DA RESPOSTA]
Forneça uma resposta em 3 partes curtas:

1. 🎯 O que está faltando:
   - Explique de forma simples o principal ajuste necessário

2. ✨ Dica amigável:
   - Dê uma sugestão prática de como corrigir

3. 👏 Incentivo:
   - Adicione uma mensagem positiva sobre o progresso

[EXEMPLO DE RESPOSTA]
🎯 Está faltando colocar as aspas ("") ao redor do texto "Olá, Mundo!"

✨ Tente escrever assim: escreva("Olá, Mundo!")

👏 Você está no caminho certo! A estrutura do comando está correta, só faltou esse pequeno detalhe.`;

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { code, exerciseDescription, expectedOutput, actualOutput, expectedCode } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = generateEguaPrompt(
      exerciseDescription, 
      expectedOutput, 
      actualOutput, 
      code,
      expectedCode || "// Código de referência não fornecido"
    );
    
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
import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { EGUA_CONTEXT } from "./egua-context";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const generateEguaPrompt = (exerciseDescription: string, expectedOutput: string, actualOutput: string, code: string, expectedCode: string) => `
Você é um professor experiente de programação especializado em ensinar a linguagem Égua.

${EGUA_CONTEXT}

[CONTEXTO DO EXERCÍCIO]
Descrição: ${exerciseDescription}
Saída Esperada: ${expectedOutput}
Saída Obtida: ${actualOutput}

[CÓDIGO SUBMETIDO PELO ESTUDANTE]
${code}

[CÓDIGO DE REFERÊNCIA]
// Esta é a implementação correta do exercício
${expectedCode}

[INSTRUÇÕES DE ANÁLISE]
1. Compare o código do estudante ${code} com o código de referência ${expectedCode}:
   - Identifique as diferenças na implementação
   - Compare as diferentes abordagens (se houverem)
   - Analise se há formas mais eficientes de resolver

2. Forneça uma solução personalizada:
   - Use o código de referência como base
   - Mantenha as partes que o estudante fez corretamente
   - Adicione comentários explicativos nas correções

3. Explique as correções:
   - Por que a mudança foi necessária
   - Como a correção aproxima da solução esperada

[FORMATO DA RESPOSTA]
Forneça uma resposta curta e direta mas amigável de no máximo 3 linhas:
Identifique o principal problema no código do estudante e Mostre o que está errado no código do estudante

[CRITÉRIOS DE AVALIAÇÃO]
1. A resposta deve:
   - Ser extremamente concisa (máximo 3 linhas)
   - Identificar os erros principais
   - Mostrar a correção
   - Manter linguagem simples e direta`;

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
"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface CodeEditorProps {
  exerciseId: string;
  lessonId: string;
  expectedOutput: string;
  expectedCode: string;
  initialCode: string;
  isCompleted: boolean;
  description: string;
}

export default function CodeEditor({
  exerciseId,
  lessonId,
  expectedOutput,
  expectedCode,
  initialCode,
  isCompleted,
  description,
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState<string>("");
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);

  const runCode = async () => {
    setIsRunning(true);
    setError("");
    setFeedback("");
    
    try {
      // Simular a execução do código Égua
      let simulatedOutput = "";
      
      // Dividir o código em linhas e processar cada uma
      const lines = code.split("\n");
      const variables: Record<string, string> = {};

      for (const line of lines) {
        const trimmedLine = line.trim();
        
        // Ignorar linhas vazias e comentários
        if (!trimmedLine || trimmedLine.startsWith("#")) {
          continue;
        }

        // Processar declaração de variável
        if (trimmedLine.startsWith("var ")) {
          const match = trimmedLine.match(/var\s+(\w+)\s*=\s*"([^"]*)"/)
          if (match && match[1] && match[2]) {
            const [, name, value] = match;
            variables[name] = value;
          }
          continue;
        }

        // Processar atribuição de variável
        if (trimmedLine.includes("=") && !trimmedLine.startsWith("var")) {
          const match = trimmedLine.match(/(\w+)\s*=\s*"([^"]*)"/)
          if (match && match[1] && match[2]) {
            const [, name, value] = match;
            variables[name] = value;
          }
          continue;
        }

        // Processar comando escreva
        if (trimmedLine.startsWith("escreva")) {
          const match = trimmedLine.match(/escreva\("([^"]*)"\)/) || trimmedLine.match(/escreva\((\w+)\)/);
          if (match && match[1]) {
            const value = match[1];
            // Se for uma variável, usar seu valor
            simulatedOutput = variables[value] ?? value;
          }
        }
      }
      
      setOutput(simulatedOutput);

      // Obter feedback do Gemini
      setIsLoadingFeedback(true);
      const feedbackResponse = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          exerciseDescription: description,
          expectedOutput,
          actualOutput: simulatedOutput,
          expectedCode,
        }),
      });

      if (!feedbackResponse.ok) {
        throw new Error("Erro ao obter feedback");
      }

      const { feedback: geminiFeedback } = await feedbackResponse.json();
      setFeedback(geminiFeedback);

      // Verificar se o output corresponde ao esperado
      if (simulatedOutput === expectedOutput && !isCompleted) {
        await fetch("/api/progress", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            exerciseId,
            lessonId,
            code,
            completed: true,
          }),
        });

        // Recarregar a página para atualizar o status
        window.location.reload();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao executar o código");
    } finally {
      setIsRunning(false);
      setIsLoadingFeedback(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="relative">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-64 p-6 font-mono text-xl bg-slate-900 text-white rounded-lg border-2 border-slate-700 focus:border-primary focus:ring-2 focus:ring-primary/50"
          placeholder="Digite seu código aqui..."
          style={{ lineHeight: '2' }}
        />
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={runCode}
          disabled={isRunning}
          className={`px-8 py-4 text-xl rounded-lg font-medium ${
            isRunning
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary hover:bg-primary-hover text-white shadow-lg hover:shadow-xl transition-all"
          }`}
        >
          {isRunning ? "Executando..." : "Executar Código"}
        </button>

        {isCompleted && (
          <span className="text-xl text-secondary font-medium flex items-center bg-secondary/10 px-6 py-3 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 mr-3"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Exercício Completo!
          </span>
        )}
      </div>

      {error && (
        <div className="p-8 bg-red-50 text-red-700 rounded-lg border-2 border-red-200">
          <div className="flex items-start">
            <svg className="h-6 w-6 mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-xl leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {output && (
        <div className="p-8 bg-slate-50 rounded-lg border-2 border-slate-200">
          <h4 className="text-2xl font-medium mb-6">Saída do Programa:</h4>
          <pre className="font-mono text-xl bg-white p-6 rounded-md border border-slate-200 leading-relaxed">{output}</pre>
        </div>
      )}

      {isLoadingFeedback && (
        <div className="p-8 bg-blue-50 text-blue-700 rounded-lg border-2 border-blue-200 animate-pulse">
          <div className="flex items-center">
            <svg className="animate-spin h-8 w-8 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-xl">Gerando feedback personalizado...</p>
          </div>
        </div>
      )}

      {feedback && (
        <div className="p-8 bg-green-50 rounded-lg border-2 border-green-200">
          <h4 className="text-2xl font-medium mb-6 flex items-center text-green-800">
            <svg className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Feedback do Professor
          </h4>
          <div className="prose prose-xl max-w-none text-green-800 leading-relaxed">
            <ReactMarkdown>{feedback}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
} 
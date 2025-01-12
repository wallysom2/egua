"use client";

import { useState } from "react";

interface CodeEditorProps {
  exerciseId: string;
  lessonId: string;
  userId: string;
  expectedOutput: string;
  initialCode: string;
  isCompleted: boolean;
  description: string;
}

export default function CodeEditor({
  exerciseId,
  lessonId,
  userId,
  expectedOutput,
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
            userId,
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
    <div className="space-y-4">
      <div className="relative">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-48 p-4 font-mono text-sm bg-gray-900 text-white rounded-lg"
          placeholder="Digite seu código aqui..."
        />
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={runCode}
          disabled={isRunning}
          className={`px-4 py-2 rounded-lg font-medium ${
            isRunning
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isRunning ? "Executando..." : "Executar Código"}
        </button>

        {isCompleted && (
          <span className="text-green-600 font-medium flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
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
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {output && (
        <div className="p-4 bg-gray-100 rounded-lg">
          <h4 className="font-medium mb-2">Saída:</h4>
          <pre className="font-mono text-sm">{output}</pre>
        </div>
      )}

      {isLoadingFeedback && (
        <div className="p-4 bg-blue-50 text-blue-700 rounded-lg animate-pulse">
          Gerando feedback personalizado...
        </div>
      )}

      {feedback && (
        <div className="p-4 bg-green-50 text-green-700 rounded-lg">
          <h4 className="font-medium mb-2">Feedback do Professor Virtual:</h4>
          <p>{feedback}</p>
        </div>
      )}
    </div>
  );
} 
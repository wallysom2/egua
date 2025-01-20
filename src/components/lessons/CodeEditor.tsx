"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { HighlightWithinTextarea } from "react-highlight-within-textarea";

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
  const [isCorrect, setIsCorrect] = useState(false);

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
          const varRegex = /var\s+(\w+)\s*=\s*"([^"]*)"/;
          const match = varRegex.exec(trimmedLine);
          if (match?.[1] && match?.[2]) {
            const [, name, value] = match;
            variables[name] = value;
          }
          continue;
        }

        // Processar atribuição de variável
        if (trimmedLine.includes("=") && !trimmedLine.startsWith("var")) {
          const assignRegex = /(\w+)\s*=\s*"([^"]*)"/;
          const match = assignRegex.exec(trimmedLine);
          if (match?.[1] && match?.[2]) {
            const [, name, value] = match;
            variables[name] = value;
          }
          continue;
        }

        // Processar comando escreva
        if (trimmedLine.startsWith("escreva")) {
          const writeRegex = /escreva\("([^"]*)"\)/;
          const writeVarRegex = /escreva\((\w+)\)/;
          const match =
            writeRegex.exec(trimmedLine) ?? writeVarRegex.exec(trimmedLine);
          if (match?.[1]) {
            const value = match[1];
            // Se for uma variável, usar seu valor
            simulatedOutput = variables[value] ?? value;
          }
        }
      }

      setOutput(simulatedOutput);

      // Se o exercício já estiver completo, não precisa obter feedback nem enviar resposta
      if (isCompleted) {
        setIsRunning(false);
        return;
      }

      // Verificar se o output corresponde ao esperado
      if (simulatedOutput === expectedOutput && !isCompleted) {
        setIsCorrect(true);
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
        return; // Retorna sem obter feedback se a resposta estiver correta
      }

      // Só obtém feedback se a resposta estiver incorreta
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

      const feedbackData = (await feedbackResponse.json()) as {
        feedback: string;
      };
      setFeedback(feedbackData.feedback);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao executar o código");
    } finally {
      setIsRunning(false);
      setIsLoadingFeedback(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="relative min-h-64 w-full rounded-lg bg-[#1E293B] p-6 font-mono text-xl text-slate-200 outline-none dark:bg-[#1E293B]">
        <HighlightWithinTextarea
          value={code}
          onChange={(e) => setCode(e)}
          highlight={[
            {
              component: MarkString,
              highlight: /"([^"]+)"/g,
            },
            {
              component: MarkVar,
              highlight: "var",
            },
            {
              component: MarkPrint,
              highlight: "escreva",
            },
            {
              component: MarkComment,
              highlight: /(?:^|\s)(#\S+)/g,
            },
          ]}
          placeholder="Digite seu código aqui..."
          readOnly={isCompleted}
        />
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={runCode}
          disabled={isRunning || isCompleted}
          className={`rounded-lg px-8 py-4 text-xl font-medium ${
            isRunning || isCompleted
              ? "cursor-not-allowed bg-slate-400 dark:bg-slate-600"
              : "bg-[#4F46E5] text-white shadow-lg transition-all hover:bg-[#4338CA] hover:shadow-xl dark:bg-[#6366F1] dark:hover:bg-[#4F46E5]"
          }`}
        >
          {isRunning
            ? "Executando..."
            : isCompleted
              ? "Exercício Completo"
              : "Executar Código"}
        </button>

        {isCompleted && (
          <span className="flex items-center rounded-lg border border-emerald-200 bg-emerald-50 px-6 py-3 text-xl font-medium text-emerald-600 dark:border-emerald-800/30 dark:bg-emerald-900/20 dark:text-emerald-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-3 h-8 w-8"
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

      {error && !isCompleted && (
        <div className="rounded-lg border-2 border-red-200 bg-red-50 p-8 text-red-700 dark:border-red-800/30 dark:bg-red-900/20 dark:text-red-400">
          <div className="flex items-start">
            <svg
              className="mr-3 mt-1 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-xl leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {output && !isCompleted && (
        <div className="rounded-lg border-2 border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-900/50">
          <h4 className="mb-6 text-2xl font-medium text-slate-900 dark:text-slate-100">
            Saída do Programa:
          </h4>
          <pre className="rounded-md border border-slate-200 bg-white p-6 font-mono text-xl leading-relaxed text-slate-900 dark:border-slate-700 dark:bg-dark-secondary dark:text-slate-100">
            {output}
          </pre>
          {isCorrect && (
            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-700 dark:border-emerald-800/30 dark:bg-emerald-900/20 dark:text-emerald-400">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p className="text-lg font-medium">
                  Resposta Correta! Parabéns!
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {isLoadingFeedback && !isCompleted && (
        <div className="animate-pulse rounded-lg border-2 border-blue-200 bg-blue-50 p-8 text-blue-700 dark:border-blue-800/30 dark:bg-blue-900/20 dark:text-blue-400">
          <div className="flex items-center">
            <svg
              className="mr-3 h-8 w-8 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-xl">Gerando feedback personalizado...</p>
          </div>
        </div>
      )}

      {feedback && !isCompleted && (
        <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-8 dark:border-blue-800/30 dark:bg-blue-900/20">
          <h4 className="mb-6 flex items-center text-2xl font-medium text-blue-800 dark:text-blue-400">
            <svg
              className="mr-3 h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            Feedback do Professor
          </h4>
          <div className="prose prose-xl max-w-none leading-relaxed text-blue-800 dark:text-blue-300">
            <ReactMarkdown>{feedback}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

function MarkString(props: { children: React.ReactNode }) {
  return <span style={{ color: "yellow" }}>{props.children}</span>;
}
function MarkVar(props: { children: React.ReactNode }) {
  return <span style={{ color: "#fa69a8" }}>{props.children}</span>;
}
function MarkPrint(props: { children: React.ReactNode }) {
  return <span style={{ color: "rgb(3 248 252)" }}>{props.children}</span>;
}
function MarkComment(props: { children: React.ReactNode }) {
  return <span style={{ color: "#8f8d8e" }}>{props.children}</span>;
}
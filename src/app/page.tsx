import { auth } from "~/server/auth";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { HydrateClient } from "~/trpc/server";
import { UserMenu } from "~/components/UserMenu";
import { LoginButton } from "~/components/LoginButton";

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800">
        {/* Header com Login */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-end">
            {session ? (
              <UserMenu user={session.user} />
            ) : (
              <LoginButton />
            )}
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center space-y-8">
            {/* Logo e Título */}
            <div className="text-center space-y-4">
              <div className="w-32 h-32 bg-blue-100 dark:bg-slate-700 rounded-full mx-auto flex items-center justify-center">
                <span className="text-6xl">🦄</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-slate-800 dark:text-white">
                Aprenda a Programar com <span className="text-blue-600">Égua</span>
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Uma jornada simplificada para aprender programação, especialmente pensada para você
              </p>
            </div>

            {/* Cards de Benefícios */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-xl text-center">Fácil de Começar</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p>Interface amigável e tutoriais passo a passo em português</p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-xl text-center">Aprenda no seu Ritmo</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p>Exercícios adaptados e suporte personalizado</p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-xl text-center">Comunidade Ativa</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p>Conecte-se com outros aprendizes e mentores</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}

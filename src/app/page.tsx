import { auth } from "~/server/auth";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { HydrateClient } from "~/trpc/server";
import { UserMenu } from "~/components/UserMenu";
import { LoginButton } from "~/components/LoginButton";
import { Button } from "~/components/ui/button";

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      <main className="min-h-screen bg-background">
        {/* Header com Login */}
        <nav className="container mx-auto px-6 py-6 bg-white shadow-sm">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-primary">Égua</h1>
            <div className="scale-110">
              {session ? (
                <UserMenu user={session.user} />
              ) : (
                <LoginButton />
              )}
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col items-center justify-center space-y-12">
            {/* Logo e Título */}
            <div className="text-center space-y-6">
              <div className="w-40 h-40 bg-primary/10 rounded-full mx-auto flex items-center justify-center">
                <span className="text-7xl">🦄</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-800 leading-tight">
                Aprenda a Programar<br />com <span className="text-primary">Égua</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Uma jornada simplificada para aprender programação, especialmente pensada para você
              </p>
            </div>

            {/* Botão de Começar */}
            <Button 
              className="text-xl py-6 px-12 rounded-full shadow-lg hover:shadow-xl transition-all"
              size="lg"
            >
              Começar Agora →
            </Button>

            {/* Cards de Benefícios */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
              <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="text-4xl mb-4">👋</div>
                  <CardTitle className="text-2xl">Fácil de Começar</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg leading-relaxed">Interface amigável e tutoriais passo a passo em português</p>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="text-4xl mb-4">⏱️</div>
                  <CardTitle className="text-2xl">Aprenda no seu Ritmo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg leading-relaxed">Exercícios adaptados e suporte personalizado</p>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="text-4xl mb-4">👥</div>
                  <CardTitle className="text-2xl">Comunidade Ativa</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg leading-relaxed">Conecte-se com outros aprendizes e mentores</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}

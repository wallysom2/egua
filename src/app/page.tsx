import { auth } from "~/server/auth";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { HydrateClient } from "~/trpc/server";
import { UserMenu } from "~/components/UserMenu";
import { LoginButton } from "~/components/LoginButton";
import { ThemeToggle } from "~/components/ThemeToggle";

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      <main className="min-h-screen bg-background dark:bg-dark-background font-roboto">
        {/* Header com Login */}
          <nav className="w-full px-14 py-6 bg-card shadow-sm border-b dark:border-[#1E293B]/30 dark:bg-dark-card/70 backdrop-blur-sm">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-poppins font-bold tracking-tight">
              <span className="bg-gradient-to-r from-[#3B82F6] via-[#6366F1] to-[#8B5CF6] dark:from-[#60A5FA] dark:via-[#818CF8] dark:to-[#A78BFA] bg-clip-text text-transparent">
                Égua
              </span>
            </h1>
            <div className="flex items-center gap-2 scale-110">
              <ThemeToggle />
              {session ? (
                <UserMenu user={session.user} />
              ) : (
                <LoginButton />
              )}
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col items-center justify-center space-y-16">
            {/* Logo e Título */}
            <div className="text-center space-y-8">
              <h1 className="text-5xl md:text-6xl font-poppins font-bold text-foreground dark:text-[#F8FAFC] leading-tight tracking-tight">
                Aprenda a Programar<br />com{" "}
                <span className="font-poppins bg-gradient-to-r from-[#3B82F6] via-[#6366F1] to-[#8B5CF6] dark:from-[#60A5FA] dark:via-[#818CF8] dark:to-[#A78BFA] bg-clip-text text-transparent">
                  Égua
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground dark:text-[#94A3B8] max-w-3xl mx-auto leading-relaxed font-light tracking-wide">
                Uma jornada simplificada para aprender programação, especialmente pensada para você
              </p>
            </div>

            {/* Botão de Começar */}
            <LoginButton 
              className="
                text-2xl 
                py-7 
                px-14 
                rounded-2xl
                shadow-lg 
                hover:shadow-2xl 
                transition-all 
                bg-gradient-to-r 
                from-[#3B82F6] 
                via-[#6366F1] 
                to-[#8B5CF6] 
                dark:from-[#60A5FA] 
                dark:via-[#818CF8] 
                dark:to-[#A78BFA] 
                text-white 
                font-poppins
                font-semibold
                tracking-wide
                focus:outline-none 
                focus:ring-4 
                focus:ring-primary/20
                hover:scale-105
                dark:shadow-primary/10
              "
            >
              Começar Agora →
            </LoginButton>

            {/* Cards de Benefícios */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
              <Card className="bg-card border shadow-lg hover:shadow-xl transition-shadow dark:bg-dark-card/50 dark:border-[#1E293B]/30 dark:hover:shadow-primary/5 backdrop-blur-sm p-2">
                <CardHeader>
                  <div className="text-5xl mb-4">👋</div>
                  <CardTitle className="text-2xl font-poppins text-foreground dark:text-[#F1F5F9] tracking-tight font-bold">Fácil de Começar</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg leading-relaxed text-muted-foreground dark:text-[#94A3B8] font-light tracking-wide">Interface amigável e tutoriais passo a passo em português</p>
                </CardContent>
              </Card>

              <Card className="bg-card border shadow-lg hover:shadow-xl transition-shadow dark:bg-dark-card/50 dark:border-[#1E293B]/30 dark:hover:shadow-primary/5 backdrop-blur-sm p-2">
                <CardHeader>
                  <div className="text-5xl mb-4">⏱️</div>
                  <CardTitle className="text-2xl font-poppins text-foreground dark:text-[#F1F5F9] tracking-tight font-bold">Aprenda no seu Ritmo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg leading-relaxed text-muted-foreground dark:text-[#94A3B8] font-light tracking-wide">Exercícios adaptados e suporte personalizado</p>
                </CardContent>
              </Card>

              <Card className="bg-card border shadow-lg hover:shadow-xl transition-shadow dark:bg-dark-card/50 dark:border-[#1E293B]/30 dark:hover:shadow-primary/5 backdrop-blur-sm p-2">
                <CardHeader>
                  <div className="text-5xl mb-4">👥</div>
                  <CardTitle className="text-2xl font-poppins text-foreground dark:text-[#F1F5F9] tracking-tight font-bold">Comunidade Ativa</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg leading-relaxed text-muted-foreground dark:text-[#94A3B8] font-light tracking-wide">Conecte-se com outros aprendizes e mentores</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}

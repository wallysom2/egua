import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { headers } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";
import { ThemeProvider } from "~/components/ThemeProvider";
import { auth } from "~/server/auth";

export const metadata: Metadata = {
  title: "Égua - Aprenda a Programar",
  description: "Uma plataforma para aprender programação de forma simples e divertida",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  return (
    <html lang="pt-BR" className={GeistSans.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <TRPCReactProvider headers={headers()}>
          <SessionProvider session={session}>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </SessionProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}

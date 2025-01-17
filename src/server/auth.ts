import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import NextAuth, { type DefaultSession } from "next-auth";
import { type Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import { env } from "~/env";
import { db } from "~/server/db";
import { loginSchema } from "~/lib/validations/auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(db) as Adapter,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 horas
  },
  secret: env.AUTH_SECRET,
  pages: {
    signIn: "/",
    error: "/error",
    signOut: "/",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      console.log("[DEBUG] JWT Callback - Token:", JSON.stringify(token));
      console.log("[DEBUG] JWT Callback - User:", user ? JSON.stringify(user) : "No user");
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session: ({ session, token }) => {
      console.log("[DEBUG] Session Callback - Token:", JSON.stringify(token));
      console.log("[DEBUG] Session Callback - Session:", JSON.stringify(session));
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    redirect: ({ url, baseUrl }) => {
      console.log("[DEBUG] Redirect Callback - URL:", url);
      console.log("[DEBUG] Redirect Callback - Base URL:", baseUrl);
      
      // Se a URL for a página inicial e o usuário estiver autenticado, redireciona para o dashboard
      if (url === baseUrl || url === `${baseUrl}/`) {
        return `${baseUrl}/dashboard`;
      }
      // Se a URL já for uma URL interna válida, mantém ela
      else if (url.startsWith(baseUrl)) {
        return url;
      }
      // Para qualquer outra URL externa, redireciona para o dashboard
      return `${baseUrl}/dashboard`;
    },
  },
  providers: [
    GoogleProvider({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
      profile(profile: {
        sub: string;
        name: string;
        email: string;
        picture: string;
      }) {
        console.log("[DEBUG] Google Profile Callback - Raw Profile:", JSON.stringify(profile));
        const userProfile = {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "user",
        };
        console.log("[DEBUG] Google Profile Callback - Processed Profile:", JSON.stringify(userProfile));
        return userProfile;
      },
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Por favor, preencha todos os campos");
        }

        try {
          const { email, password } = await loginSchema.parseAsync(credentials);

          const user = await db.user.findUnique({
            where: { email: email.toLowerCase() },
          });

          if (!user?.password) {
            throw new Error("Email ou senha incorretos");
          }

          const isValidPassword = await compare(password, user.password);

          if (!isValidPassword) {
            throw new Error("Email ou senha incorretos");
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role ?? "user",
          };
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error("Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.");
        }
      },
    }),
  ],
  events: {
    async signIn({ user, account, profile }) {
      console.log("[DEBUG] SignIn Event - User:", JSON.stringify(user));
      console.log("[DEBUG] SignIn Event - Account:", JSON.stringify(account));
      console.log("[DEBUG] SignIn Event - Profile:", JSON.stringify(profile));
      console.log(`Usuário ${user.email} fez login com sucesso`);
    },
    async signOut() {
      console.log("[DEBUG] SignOut Event");
      console.log(`Usuário desconectado`);
    },
  },
}); 
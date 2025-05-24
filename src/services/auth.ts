import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react";
import type { LoginInput, RegisterInput } from "~/lib/validations/auth";

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export const AuthService = {
  async register(data: RegisterInput) {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email.toLowerCase(),
          password: data.password,
          confirmPassword: data.confirmPassword,
        }),
      });

      const json = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new AuthError(json.error ?? "Erro ao criar conta");
      }

      const result = await nextAuthSignIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        throw new AuthError(result.error);
      }

      if (result?.ok) {
        window.location.href = "/dashboard";
      }

      return result;
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError(
        error instanceof Error 
          ? error.message 
          : "Erro ao criar conta. Tente novamente mais tarde."
      );
    }
  },

  async login(data: LoginInput) {
    try {
      const result = await nextAuthSignIn("credentials", {
        email: data.email.toLowerCase(),
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        throw new AuthError(result.error);
      }

      if (result?.ok) {
        window.location.href = "/dashboard";
      }

      return result;
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError(
        error instanceof Error 
          ? error.message 
          : "Erro ao fazer login. Tente novamente mais tarde."
      );
    }
  },

  async loginWithGoogle() {
    try {
      await nextAuthSignIn("google", { 
        callbackUrl: "/dashboard",
        redirect: true 
      });
    } catch (error) {
      throw new AuthError(
        error instanceof Error 
          ? error.message 
          : "Erro ao fazer login com Google. Tente novamente mais tarde."
      );
    }
  },

  async logout() {
    try {
      await nextAuthSignOut({ 
        callbackUrl: "/",
        redirect: false 
      });
      window.location.href = "/";
    } catch (error) {
      throw new AuthError(
        error instanceof Error 
          ? error.message 
          : "Erro ao fazer logout. Tente novamente mais tarde."
      );
    }
  },
}; 
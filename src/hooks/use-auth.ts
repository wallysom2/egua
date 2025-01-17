import { useCallback } from "react";
import { useRouter } from "next/navigation";
import type { LoginInput, RegisterInput } from "~/lib/validations/auth";
import { AuthService } from "~/services/auth";
import { useAuthStore } from "~/stores/auth-store";
import { useSession } from "next-auth/react";

export function useAuth() {
  const router = useRouter();
  const { setLoading, setError, reset } = useAuthStore();
  const { data: session, status } = useSession();

  const register = useCallback(
    async (data: RegisterInput) => {
      try {
        setLoading(true);
        setError(null);
        await AuthService.register(data);
        router.refresh();
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Ocorreu um erro inesperado");
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [router, setError, setLoading]
  );

  const login = useCallback(
    async (data: LoginInput) => {
      try {
        setLoading(true);
        setError(null);
        await AuthService.login(data);
        
        if (status === "authenticated" && session?.user) {
          router.refresh();
          router.push("/dashboard");
        } else {
          setError("Falha na autenticação");
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Ocorreu um erro inesperado");
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [router, setError, setLoading, status, session]
  );

  const loginWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await AuthService.loginWithGoogle();
      if (status === "authenticated" && session?.user) {
        router.refresh();
        router.push("/dashboard");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Ocorreu um erro inesperado");
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setError, setLoading, status, session, router]);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await AuthService.logout();
      reset();
      router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Ocorreu um erro inesperado");
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, [reset, setError, setLoading, router]);

  return {
    register,
    login,
    loginWithGoogle,
    logout,
    session,
    status
  };
} 
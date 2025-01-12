"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoginInput, RegisterInput, loginSchema, registerSchema } from "~/lib/validations/auth";
import { useAuth } from "~/hooks/use-auth";
import { useAuthStore } from "~/stores/auth-store";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Icons } from "~/components/ui/icons";
import { Alert, AlertDescription } from "~/components/ui/alert";

type AuthMode = "login" | "register";

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { isLoading, error } = useAuthStore();
  const { register: registerUser, login, loginWithGoogle } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterInput>({
    resolver: zodResolver(mode === "login" ? loginSchema : registerSchema),
  });

  const onSubmit = async (data: LoginInput | RegisterInput) => {
    try {
      if (mode === "register") {
        await registerUser(data as RegisterInput);
        reset();
      } else {
        await login(data as LoginInput);
        reset();
      }
    } catch {
      // Erro já está sendo tratado pelo hook useAuth
    }
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    reset();
  };

  return (
    <div className="w-full max-w-md space-y-6 p-6">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold">
          {mode === "login" ? "Entrar" : "Criar conta"}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {mode === "register" && (
          <div className="space-y-2">
            <Label htmlFor="name" className="text-lg">Nome</Label>
            <Input
              id="name"
              type="text"
              placeholder="Seu nome"
              {...register("name")}
              disabled={isLoading}
              className="h-12 text-lg"
            />
            {errors.name && (
              <p className="text-base text-destructive">{errors.name.message}</p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-lg">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            {...register("email")}
            disabled={isLoading}
            className="h-12 text-lg"
          />
          {errors.email && (
            <p className="text-base text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-lg">Senha</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              disabled={isLoading}
              className="h-12 text-lg pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-12 w-12"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <Icons.eyeOff className="h-5 w-5" />
              ) : (
                <Icons.eye className="h-5 w-5" />
              )}
            </Button>
          </div>
          {errors.password && (
            <p className="text-base text-destructive">{errors.password.message}</p>
          )}
        </div>

        {mode === "register" && (
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-lg">Confirmar Senha</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                disabled={isLoading}
                className="h-12 text-lg pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-12 w-12"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <Icons.eyeOff className="h-5 w-5" />
                ) : (
                  <Icons.eye className="h-5 w-5" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-base text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription className="text-base">{error}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
          {isLoading && <Icons.spinner className="mr-2 h-5 w-5 animate-spin" />}
          {mode === "login" ? "Entrar" : "Criar conta"}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-sm uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            ou continue com
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        type="button"
        className="w-full h-12 text-lg"
        onClick={() => loginWithGoogle()}
        disabled={isLoading}
      >
        <Icons.google className="mr-2 h-5 w-5" />
        Google
      </Button>

      <Button
        variant="link"
        className="w-full text-lg"
        onClick={toggleMode}
        disabled={isLoading}
      >
        {mode === "login"
          ? "Não tem uma conta? Cadastre-se"
          : "Já tem uma conta? Entre"}
      </Button>
    </div>
  );
} 
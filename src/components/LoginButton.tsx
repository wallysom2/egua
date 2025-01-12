'use client';

import { Button } from "./ui/button";
import { FaGoogle } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "~/components/ui/dialog";
import { AuthForm } from "./auth/AuthForm";

interface LoginButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function LoginButton({ className, children }: LoginButtonProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className={className || `
            flex items-center gap-3
            h-12 px-8
            bg-[#4F46E5] hover:bg-[#4338CA]
            dark:bg-[#6366F1] dark:hover:bg-[#4F46E5]
            text-white font-poppins font-medium text-lg
            hover:scale-[1.02] transition-all duration-200
            shadow-lg hover:shadow-xl
            rounded-xl
          `}
          size="default"
        >
          {children || (
            <>
              <FaGoogle className="w-5 h-5" />
              <span>Entrar</span>
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 bg-transparent border-none">
        <DialogTitle className="sr-only">Autenticação</DialogTitle>
        <AuthForm />
      </DialogContent>
    </Dialog>
  );
} 
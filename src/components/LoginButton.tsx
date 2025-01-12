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

export function LoginButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white shadow-sm transition-all duration-200"
          size="default"
        >
          <FaGoogle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Entrar</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="sr-only">Autenticação</DialogTitle>
        <AuthForm />
      </DialogContent>
    </Dialog>
  );
} 
'use client';

import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
import { FaGoogle } from "react-icons/fa";

export function LoginButton() {
  return (
    <Button
      className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white shadow-sm transition-all duration-200"
      size="default"
      onClick={() => signIn('google', { callbackUrl: '/' })}
    >
      <FaGoogle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
      <span>Entrar com Google</span>
    </Button>
  );
} 
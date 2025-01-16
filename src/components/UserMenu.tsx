"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { User } from "lucide-react";

interface UserMenuProps {
  user: {
    name?: string | null;
    image?: string | null;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="relative h-12 w-12 rounded-full ring-2 ring-[#3B82F6]/20 hover:ring-[#6366F1]/40 transition-all duration-200"
            aria-label="Abrir menu do usuário"
            aria-haspopup="true"
          >
            {user?.image ? (
              <Image
                src={user.image}
                alt={`Foto de perfil de ${user.name ?? "usuário"}`}
                className="rounded-full object-cover"
                fill
                sizes="48px"
                priority
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-[#3B82F6]/10 dark:bg-[#60A5FA]/10 rounded-full" aria-hidden="true">
                <User className="w-6 h-6 text-[#3B82F6] dark:text-[#60A5FA]" />
              </div>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 bg-card dark:bg-dark-card/50 dark:border-[#1E293B]/30 backdrop-blur-sm" role="menu">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-base font-medium leading-none font-poppins dark:text-[#F2F2F2]">
                {user?.name ? `Olá, ${user.name}` : 'Olá, usuário'}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="dark:border-[#1E293B]/30" />
          <DropdownMenuItem 
            onClick={() => setShowLogoutDialog(true)}
            className="text-red-700 dark:text-red-400 cursor-pointer text-base py-3 hover:bg-[#3B82F6]/5 dark:hover:bg-[#60A5FA]/5"
            role="menuitem"
            aria-label="Sair da sua conta"
          >
            <span className="flex items-center gap-2">
              Sair da conta
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="max-w-md bg-card dark:bg-dark-card/50 dark:border-[#1E293B]/30 backdrop-blur-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-poppins dark:text-[#F2F2F2]">Confirmar Saída</AlertDialogTitle>
            <AlertDialogDescription className="text-base leading-relaxed">
              Tem certeza que deseja sair da sua conta? 
              <br />
              Você precisará fazer login novamente para acessar sua conta.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel 
              onClick={() => setShowLogoutDialog(false)}
              className="text-base py-3 px-5 hover:bg-[#3B82F6]/5 dark:hover:bg-[#60A5FA]/5 dark:border-[#1E293B]/30"
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="text-base py-3 px-5 bg-gradient-to-r from-[#3B82F6] via-[#6366F1] to-[#8B5CF6] hover:opacity-90 dark:from-[#60A5FA] dark:via-[#818CF8] dark:to-[#A78BFA]"
            >
              Sim, quero sair
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 
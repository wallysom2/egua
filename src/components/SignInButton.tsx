"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { AuthForm } from "./auth/AuthForm";

interface SignInButtonProps {
  children: React.ReactNode;
}

export function SignInButton({ children }: SignInButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div onClick={() => setOpen(true)}>
        {children}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <AuthForm />
        </DialogContent>
      </Dialog>
    </>
  );
} 
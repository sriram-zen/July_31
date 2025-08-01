"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

interface AdminLoginDialogProps {
  children: React.ReactNode;
}

export function AdminLoginDialog({ children }: AdminLoginDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Admin Login</DialogTitle>
          <DialogDescription>
            Admin login functionality will be available here.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Placeholder for future login form */}
          <p>Login form goes here...</p>
        </div>
        <DialogClose asChild>
          <Button type="button" variant="secondary" className="text-primary-brand">
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

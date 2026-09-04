import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

export const AlertDialog = Dialog;
export const AlertDialogTrigger = DialogTrigger;

export function AlertDialogContent({ className, ...props }: ComponentProps<typeof DialogContent>) {
  return <DialogContent className={cn("max-w-md", className)} {...props} />;
}

export function AlertDialogHeader({ className, ...props }: ComponentProps<"div">) {
  return <DialogHeader className={className} {...props} />;
}

export function AlertDialogFooter({ className, ...props }: ComponentProps<"div">) {
  return <DialogFooter className={className} {...props} />;
}

export function AlertDialogTitle({ className, ...props }: ComponentProps<typeof DialogTitle>) {
  return <DialogTitle className={className} {...props} />;
}

export function AlertDialogDescription({
  className,
  ...props
}: ComponentProps<typeof DialogDescription>) {
  return <DialogDescription className={className} {...props} />;
}

export function AlertDialogAction({ className, ...props }: ComponentProps<typeof DialogClose>) {
  return <DialogClose className={cn(buttonVariants(), className)} {...props} />;
}

export function AlertDialogCancel({ className, ...props }: ComponentProps<typeof DialogClose>) {
  return (
    <DialogClose className={cn(buttonVariants({ variant: "outline" }), className)} {...props} />
  );
}

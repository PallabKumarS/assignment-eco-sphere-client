import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode } from "react";
type TModalProps = {
  title: string;
  trigger: ReactNode;
  content: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};
export function Modal({
  title,
  trigger,
  content,
  open,
  onOpenChange,
}: TModalProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[calc(100vh-4rem)] overflow-y-auto min-w-[290px] w-3/4 backdrop-blur-sm ">
        <DialogHeader>
          <DialogTitle className="text-primary">{title}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        {content}
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

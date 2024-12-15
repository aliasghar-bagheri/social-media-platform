import { ReactNode } from "react";
import { Button } from "../ui/button";
import { X } from "lucide-react";

type DialogProps = {
  children: ReactNode;
  onClose: () => void;
};

const Dialog = ({ children, onClose }: DialogProps) => {
  return (
    <div
      onClick={onClose}
      className="fixed left-0 top-0 flex h-screen w-full items-center justify-center bg-dark-4/80 px-5 backdrop-blur">
      <Button
        onClick={onClose}
        variant="ghost"
        className="absolute right-5 top-5 md:right-10 md:top-10">
        <X />
      </Button>
      {children}
    </div>
  );
};

export default Dialog;

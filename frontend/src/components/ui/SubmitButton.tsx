import { forwardRef, HTMLAttributes } from "react";
import { Button } from "./button";
import Spinner from "./Spinner";

interface SubmitButtonProps extends HTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean;
  isLoading?: boolean;
}

const SubmitButton = forwardRef<HTMLButtonElement, SubmitButtonProps>(
  ({ isLoading, fullWidth, className = "", children, ...props }, ref) => {
    return (
      <Button
        type="submit"
        className={`${fullWidth ? "w-full" : "w-auto"} ${className}`}
        ref={ref}
        {...props}>
        {isLoading && <Spinner className="mr-2" />} {children}
      </Button>
    );
  },
);

SubmitButton.displayName = "SubmitButton";

export default SubmitButton;

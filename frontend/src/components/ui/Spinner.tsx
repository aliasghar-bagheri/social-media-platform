import { forwardRef, HTMLAttributes } from "react";

const Spinner = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => {
    return (
      <span className={` ${className}`} ref={ref} {...props}>
        <img src="/assets/icons/loader.svg" width={23} height={23} alt="spinner" />
      </span>
    );
  },
);

Spinner.displayName = "Spinner";

export default Spinner;

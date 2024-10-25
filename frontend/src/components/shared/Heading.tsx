import { cn } from "@/lib/utils";
import { forwardRef, ReactNode, useMemo } from "react";

type IconDirection = "left" | "top" | "right" | "bottom";

type HeadingVariant = "h1-bold" | "h1-semibold" | "h2-bold" | "h3-bold";

type HeadingProps = {
  children: ReactNode;
  customStyles?: string;
  variant?: HeadingVariant;
  icon?: ReactNode;
  iconDirection?: IconDirection;
};

type Ref = HTMLHeadingElement;

const Heading = forwardRef<Ref, HeadingProps>(
  (
    { children, customStyles, variant = "h1-bold", icon, iconDirection = "left" },
    ref,
  ) => {
    const containerClassNames = useMemo(
      () =>
        cn("flex w-full items-center gap-3 text-center", {
          "flex-col items-start": iconDirection === "top",
          "flex-row-reverse justify-end": iconDirection === "right",
          "flex-col-reverse items-start": iconDirection === "bottom",
        }),
      [iconDirection],
    );

    const headingClassNames = useMemo(
      () =>
        cn(customStyles, {
          "h1-bold": variant === "h1-bold",
          "h1-semibold": variant === "h1-semibold",
          "h2-bold": variant === "h2-bold",
          "h3-bold": variant === "h3-bold",
        }),
      [customStyles, variant],
    );

    const HeadingTag = variant.startsWith("h1")
      ? "h1"
      : variant.startsWith("h2")
        ? "h2"
        : "h3";

    return (
      <div className={containerClassNames}>
        {icon}
        <HeadingTag ref={ref} className={headingClassNames}>
          {children}
        </HeadingTag>
      </div>
    );
  },
);

export default Heading;

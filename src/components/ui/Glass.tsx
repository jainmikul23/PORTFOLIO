import React from "react";
import clsx from "clsx";
import styles from "./Glass.module.css";

export interface GlassProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "panel" | "pill" | "sheet";
  noise?: boolean;
  interactive?: boolean;
  glow?: "none" | "brass" | "sage" | "vermilion";
  children: React.ReactNode;
}

export const Glass: React.FC<GlassProps> = ({
  variant = "panel",
  noise = true,
  interactive = false,
  glow = "none",
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={clsx(
        styles.base,
        styles[variant],
        noise && styles.noise,
        interactive && styles.interactive,
        glow !== "none" && styles[`glow_${glow}`],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};


import React from "react";
import clsx from "clsx";
import styles from "./Chip.module.css";

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "brass" | "sage" | "vermilion";
  size?: "sm" | "md";
  dot?: boolean;
  children: React.ReactNode;
}

export const Chip: React.FC<ChipProps> = ({
  variant = "default",
  size = "md",
  dot = false,
  className,
  children,
  ...props
}) => {
  return (
    <span className={clsx(styles.chip, styles[variant], styles[size], className)} {...props}>
      {dot && <span className={styles.dot} aria-hidden="true" />}
      {children}
    </span>
  );
};

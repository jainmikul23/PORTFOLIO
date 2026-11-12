import React from "react";
import clsx from "clsx";
import styles from "./SectionHeading.module.css";

export interface SectionHeadingProps {
  label: string;
  title: string;
  accentWord?: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  label,
  title,
  accentWord,
  subtitle,
  align = "left",
  className,
}) => {
  return (
    <div className={clsx(styles.wrapper, styles[align], className)}>
      <span className={clsx("label-caps", styles.label)}>{label}</span>
      <h2 className={clsx("font-display", styles.title)}>
        {title} {accentWord && <em className={styles.accent}>{accentWord}</em>}
      </h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
};

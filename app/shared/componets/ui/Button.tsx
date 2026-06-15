import React from "react";
import styles from "./Button.module.scss";

type Variant = "green" | "grey" | "black";
type Size = "L" | "M";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export default function Button({
  variant = "green",
  size = "L",
  className = "",
  children,
  ...rest
}: Props) {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}

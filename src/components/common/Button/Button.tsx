import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "success";
type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`button ${className}`}
      data-variant={variant}
      data-size={size}
      data-full-width={fullWidth}
      data-loading={isLoading}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <span className="button__loader">⏳</span>}
      {!isLoading && leftIcon && (
        <span className="button__icon button__icon--left">{leftIcon}</span>
      )}
      <span className="button__text">{children}</span>
      {!isLoading && rightIcon && (
        <span className="button__icon button__icon--right">{rightIcon}</span>
      )}
    </button>
  );
}

export default Button;

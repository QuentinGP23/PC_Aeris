import {
  useState,
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { Eye, EyeSlash, MagnifyingGlass, X } from "@phosphor-icons/react";

type InputType =
  | "text"
  | "email"
  | "password"
  | "search"
  | "number"
  | "tel"
  | "url"
  | "date"
  | "time"
  | "datetime-local";
type InputSize = "sm" | "md" | "lg";
type InputVariant = "default" | "filled" | "outline" | "underline";

interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  type?: InputType;
  size?: InputSize;
  variant?: InputVariant;
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  clearable?: boolean;
  onClear?: () => void;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      size = "md",
      variant = "default",
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      clearable = false,
      onClear,
      fullWidth = false,
      disabled,
      className = "",
      value,
      onChange,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const isPassword = type === "password";
    const isSearch = type === "search";
    const hasValue = value !== undefined && value !== "";

    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    // Auto-determine autocomplete if not provided
    const getAutoComplete = () => {
      if (props.autoComplete) return props.autoComplete;
      if (isPassword) return "current-password";
      if (type === "email") return "email";
      if (type === "tel") return "tel";
      if (props.name === "pseudo" || props.name === "username")
        return "username";
      if (props.name === "firstName") return "given-name";
      if (props.name === "lastName") return "family-name";
      return undefined;
    };

    const handleClear = () => {
      onClear?.();
      if (onChange) {
        const event = {
          target: { value: "" },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }
    };

    return (
      <div
        className={`input ${className}`}
        data-size={size}
        data-variant={variant}
        data-full-width={fullWidth}
        data-disabled={disabled}
        data-error={!!error}
        data-focused={isFocused}
        data-has-value={hasValue}
      >
        {label && (
          <label className="input__label" htmlFor={props.id || props.name}>
            {label}
          </label>
        )}

        <div className="input__wrapper">
          {leftIcon && (
            <span className="input__icon input__icon--left">{leftIcon}</span>
          )}

          {isSearch && !leftIcon && (
            <span className="input__icon input__icon--left">
              <MagnifyingGlass size={18} />
            </span>
          )}

          <input
            ref={ref}
            type={inputType}
            className="input__field"
            disabled={disabled}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            autoComplete={getAutoComplete()}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              className="input__toggle"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
            </button>
          )}

          {clearable && hasValue && !isPassword && (
            <button
              type="button"
              className="input__clear"
              onClick={handleClear}
              tabIndex={-1}
            >
              <X size={16} />
            </button>
          )}

          {rightIcon && !isPassword && !clearable && (
            <span className="input__icon input__icon--right">{rightIcon}</span>
          )}
        </div>

        {error && <span className="input__error">{error}</span>}
        {hint && !error && <span className="input__hint">{hint}</span>}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;

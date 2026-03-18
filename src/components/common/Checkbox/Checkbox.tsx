import "./Checkbox.scss";
import { forwardRef, type InputHTMLAttributes } from "react";
import { Check } from "@phosphor-icons/react";

type CheckboxSize = "sm" | "md" | "lg";
type CheckboxVariant = "default" | "filled" | "outline";

interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "type"
> {
  label?: string;
  size?: CheckboxSize;
  variant?: CheckboxVariant;
  error?: string;
  hint?: string;
  indeterminate?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      size = "md",
      variant = "default",
      error,
      hint,
      indeterminate = false,
      disabled,
      className = "",
      checked,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        className={`checkbox ${className}`}
        data-size={size}
        data-variant={variant}
        data-disabled={disabled}
        data-error={!!error}
        data-checked={checked}
        data-indeterminate={indeterminate}
      >
        <label className="checkbox__wrapper">
          <input
            ref={ref}
            type="checkbox"
            className="checkbox__input"
            disabled={disabled}
            checked={checked}
            {...props}
          />
          <span className="checkbox__box">
            {checked && <Check size={14} weight="bold" />}
            {indeterminate && !checked && (
              <span className="checkbox__indeterminate" />
            )}
          </span>
          {label && <span className="checkbox__label">{label}</span>}
        </label>

        {error && <span className="checkbox__error">{error}</span>}
        {hint && !error && <span className="checkbox__hint">{hint}</span>}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";

export default Checkbox;

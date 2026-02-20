import { forwardRef, type SelectHTMLAttributes, type ReactNode } from "react";
import { CaretDown } from "@phosphor-icons/react";

type SelectSize = "sm" | "md" | "lg";
type SelectVariant = "default" | "filled" | "outline" | "underline";

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface OptionGroup {
  label: string;
  options: Option[];
}

interface SelectProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "size"
> {
  options: (Option | OptionGroup)[];
  size?: SelectSize;
  variant?: SelectVariant;
  label?: string;
  error?: string;
  hint?: string;
  placeholder?: string;
  leftIcon?: ReactNode;
  fullWidth?: boolean;
}

function isOptionGroup(option: Option | OptionGroup): option is OptionGroup {
  return "options" in option;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      options,
      size = "md",
      variant = "default",
      label,
      error,
      hint,
      placeholder,
      leftIcon,
      fullWidth = false,
      disabled,
      className = "",
      value,
      ...props
    },
    ref,
  ) => {
    const hasValue = value !== undefined && value !== "";

    return (
      <div
        className={`select ${className}`}
        data-size={size}
        data-variant={variant}
        data-full-width={fullWidth}
        data-disabled={disabled}
        data-error={!!error}
        data-has-value={hasValue}
      >
        {label && (
          <label className="select__label" htmlFor={props.id || props.name}>
            {label}
          </label>
        )}

        <div className="select__wrapper">
          {leftIcon && (
            <span className="select__icon select__icon--left">{leftIcon}</span>
          )}

          <select
            ref={ref}
            className="select__field"
            disabled={disabled}
            value={value}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}

            {options.map((option, index) => {
              if (isOptionGroup(option)) {
                return (
                  <optgroup key={index} label={option.label}>
                    {option.options.map((opt) => (
                      <option
                        key={opt.value}
                        value={opt.value}
                        disabled={opt.disabled}
                      >
                        {opt.label}
                      </option>
                    ))}
                  </optgroup>
                );
              }
              return (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </option>
              );
            })}
          </select>

          <span className="select__arrow">
            <CaretDown size={18} />
          </span>
        </div>

        {error && <span className="select__error">{error}</span>}
        {hint && !error && <span className="select__hint">{hint}</span>}
      </div>
    );
  },
);

Select.displayName = "Select";

export default Select;

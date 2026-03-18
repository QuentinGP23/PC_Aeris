import "./Form.scss";
import type { FormHTMLAttributes, ReactNode } from "react";

type FormLayout = "vertical" | "horizontal" | "inline";
type FormSize = "sm" | "md" | "lg";

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
  layout?: FormLayout;
  size?: FormSize;
  fullWidth?: boolean;
  disabled?: boolean;
}

function Form({
  children,
  layout = "vertical",
  size = "md",
  fullWidth = false,
  disabled = false,
  className = "",
  onSubmit,
  ...props
}: FormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  return (
    <form
      className={`form ${className}`}
      data-layout={layout}
      data-size={size}
      data-full-width={fullWidth}
      data-disabled={disabled}
      onSubmit={handleSubmit}
      {...props}
    >
      <fieldset disabled={disabled} className="form__fieldset">
        {children}
      </fieldset>
    </form>
  );
}

// Form.Group - Pour grouper label + input + error
interface FormGroupProps {
  children: ReactNode;
  className?: string;
}

function FormGroup({ children, className = "" }: FormGroupProps) {
  return <div className={`form__group ${className}`}>{children}</div>;
}

// Form.Row - Pour aligner plusieurs champs horizontalement
interface FormRowProps {
  children: ReactNode;
  columns?: number;
  gap?: "sm" | "md" | "lg";
  className?: string;
}

function FormRow({
  children,
  columns,
  gap = "md",
  className = "",
}: FormRowProps) {
  return (
    <div
      className={`form__row ${className}`}
      data-columns={columns}
      data-gap={gap}
    >
      {children}
    </div>
  );
}

// Form.Actions - Pour les boutons d'action
interface FormActionsProps {
  children: ReactNode;
  align?: "left" | "center" | "right" | "between" | "around";
  className?: string;
}

function FormActions({
  children,
  align = "right",
  className = "",
}: FormActionsProps) {
  return (
    <div className={`form__actions ${className}`} data-align={align}>
      {children}
    </div>
  );
}

// Form.Divider - Séparateur visuel
interface FormDividerProps {
  label?: string;
  className?: string;
}

function FormDivider({ label, className = "" }: FormDividerProps) {
  return (
    <div className={`form__divider ${className}`}>
      {label && <span className="form__divider-label">{label}</span>}
    </div>
  );
}

// Form.Error - Message d'erreur global
interface FormErrorProps {
  message: string;
  className?: string;
}

function FormError({ message, className = "" }: FormErrorProps) {
  return (
    <div className={`form__error ${className}`} role="alert">
      {message}
    </div>
  );
}

// Attach sub-components
Form.Group = FormGroup;
Form.Row = FormRow;
Form.Actions = FormActions;
Form.Divider = FormDivider;
Form.Error = FormError;

export default Form;

import { useState } from 'react'
import Input from '../Input'
import Button from '../Button'
import './Form.scss'

interface Option {
  value: string
  label: string
}

interface Field {
  name: string
  type?: 'text' | 'email' | 'password' | 'search' | 'number' | 'tel' | 'select'
  label?: string
  placeholder?: string
  options?: Option[]
}

interface FormButton {
  label: string
  onClick?: () => void
}

interface FormProps {
  fields: Field[]
  primaryButton: FormButton
  secondaryButton?: FormButton
  fullWidthButtons?: boolean
  onSubmit?: (values: Record<string, string>) => void
}

function Form({
  fields,
  primaryButton,
  secondaryButton,
  fullWidthButtons = false,
  onSubmit
}: FormProps) {
  const [values, setValues] = useState<Record<string, string>>({})

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(values)
  }

  const handlePrimaryClick = () => {
    primaryButton.onClick?.()
    onSubmit?.(values)
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form__fields">
        {fields.map((field) => (
          <Input
            key={field.name}
            type={field.type}
            name={field.name}
            label={field.label}
            placeholder={field.placeholder}
            options={field.options}
            value={values[field.name] || ''}
            onChange={(value) => handleChange(field.name, value)}
          />
        ))}
      </div>

      <div className="form__buttons">
        {secondaryButton && (
          <Button variant="secondary" fullWidth={fullWidthButtons} onClick={secondaryButton.onClick}>
            {secondaryButton.label}
          </Button>
        )}
        <Button variant="main" fullWidth={fullWidthButtons} onClick={handlePrimaryClick}>
          {primaryButton.label}
        </Button>
      </div>
    </form>
  )
}

export default Form

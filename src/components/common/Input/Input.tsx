import { useState } from 'react'
import { Eye, EyeSlash, MagnifyingGlass } from '@phosphor-icons/react'
import './Input.scss'

interface Option {
  value: string
  label: string
}

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'search' | 'number' | 'tel' | 'select'
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  options?: Option[]
  label?: string
  name?: string
}

function Input({
  type = 'text',
  placeholder,
  value,
  onChange,
  options = [],
  label,
  name
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isSelectOpen, setIsSelectOpen] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange?.(e.target.value)
  }

  const togglePassword = () => {
    setShowPassword(!showPassword)
  }

  const handleSelectClick = () => {
    setIsSelectOpen(!isSelectOpen)
  }

  const handleSelectBlur = () => {
    setIsSelectOpen(false)
  }

  return (
    <div className={`input ${isSelectOpen ? 'input--select-open' : ''}`}>
      {label && <label className="input__label" htmlFor={name}>{label}</label>}

      {type === 'select' ? (
        <select
          className="input__field input__field--select"
          value={value}
          onChange={(e) => {
            handleChange(e)
            setIsSelectOpen(false)
          }}
          onClick={handleSelectClick}
          onBlur={handleSelectBlur}
          name={name}
          id={name}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === 'password' ? (
        <div className="input__password">
          <input
            className="input__field input__field--password"
            type={showPassword ? 'text' : 'password'}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            name={name}
            id={name}
          />
          <button
            type="button"
            className="input__toggle"
            onClick={togglePassword}
          >
            {showPassword ? <EyeSlash /> : <Eye />}
          </button>
        </div>
      ) : type === 'search' ? (
        <div className="input__search">
          <MagnifyingGlass className="input__icon" />
          <input
            className="input__field input__field--search"
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            name={name}
            id={name}
          />
        </div>
      ) : (
        <input
          className={`input__field input__field--${type}`}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          name={name}
          id={name}
        />
      )}
    </div>
  )
}

export default Input

import React from 'react'

export default function FormField({ label, name, formik, as = 'input', className = '', children, ...props }) {
  const touched = formik?.touched?.[name]
  const error = formik?.errors?.[name]
  const common = {
    id: name,
    name,
    value: formik?.values?.[name] ?? '',
    onChange: formik?.handleChange,
    onBlur: formik?.handleBlur,
    'aria-invalid': Boolean(touched && error),
    'aria-describedby': touched && error ? `${name}-error` : undefined,
    ...props
  }
  return (
    <label className={`form-field ${className}`} htmlFor={name}>
      <span>{label}</span>
      {as === 'textarea' ? <textarea {...common} /> : as === 'select' ? <select {...common}>{children}</select> : <input {...common} />}
      {touched && error ? <span id={`${name}-error`} className="text-[11px] font-bold leading-5 text-wine-700">{error}</span> : null}
    </label>
  )
}

import React from 'react'

interface Props extends React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> {}

export const FormFrame = ({ onSubmit, children, className }: Props) => (
  <form onSubmit={onSubmit} className={className} noValidate>
    {children}
  </form>
)

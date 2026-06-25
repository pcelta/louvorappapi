import type { ButtonHTMLAttributes } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost'
}

export default function Button({
  variant = 'primary',
  className = '',
  ...props
}: Props) {
  const base =
    'rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50'
  const styles =
    variant === 'primary'
      ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/20 hover:bg-teal-700'
      : 'text-slate-600 hover:text-slate-900'
  return <button className={`${base} ${styles} ${className}`} {...props} />
}
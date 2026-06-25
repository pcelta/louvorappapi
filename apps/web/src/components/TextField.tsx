import type { InputHTMLAttributes } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
}

export default function TextField({ label, error, id, ...props }: Props) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        className={`mt-1 w-full rounded-lg border px-3 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
          error
            ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
            : 'border-slate-300 focus:border-teal-500 focus:ring-teal-100'
        }`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}
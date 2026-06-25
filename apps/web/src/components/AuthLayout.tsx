import type { ReactNode } from 'react'

type Props = {
  title: string
  subtitle?: string
  children: ReactNode
}

export default function AuthLayout({ title, subtitle, children }: Props) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-teal-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal-600 text-lg font-bold text-white">
            L
          </span>
          <span className="text-lg font-semibold tracking-tight text-slate-800">
            LouvorApp
          </span>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  )
}
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import TextField from '../components/TextField'
import Button from '../components/Button'

type LocationState = { justRegistered?: boolean; email?: string }

export default function Login() {
  const location = useLocation()
  const state = location.state as LocationState | null
  const [email, setEmail] = useState(state?.email ?? '')
  const [password, setPassword] = useState('')

  function submit(event: FormEvent) {
    event.preventDefault()
  }

  return (
    <AuthLayout title="Entrar" subtitle="Acesse a sua conta">
      {state?.justRegistered && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-teal-200 bg-teal-50 p-4 text-sm text-teal-800">
          <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-teal-600 text-xs font-bold text-white">
            ✓
          </span>
          <p>Sua conta foi criada com sucesso! Faça login para continuar.</p>
        </div>
      )}

      <form className="space-y-5" onSubmit={submit}>
        <TextField
          id="email"
          label="Email"
          type="email"
          placeholder="voce@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          id="password"
          label="Senha"
          type="password"
          placeholder="Sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" className="w-full">
          Entrar
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Ainda não tem conta?{' '}
        <Link to="/register" className="font-medium text-teal-700 hover:underline">
          Cadastre sua igreja
        </Link>
      </p>
    </AuthLayout>
  )
}
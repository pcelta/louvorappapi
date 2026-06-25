import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import TextField from '../components/TextField'
import Button from '../components/Button'
import { isEmail, isE164 } from '../lib/validation'

export default function RegisterChurch() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [churchName, setChurchName] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  function goToAccount() {
    const next: Record<string, string> = {}
    if (!churchName.trim()) next.churchName = 'Informe o nome da igreja'
    setErrors(next)
    if (Object.keys(next).length === 0) setStep(2)
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    const next: Record<string, string> = {}
    if (!name) {
      next.name = 'Informe um nome';
    }

    if (!isEmail(email)) {
      next.email = 'Informe um email válido';
    }

    if (!isE164(phone)) {
      next.phone = 'Use o formato internacional, ex: +5511999999999';
    }

    if (password.length < 8) {
      next.password = 'A senha deve ter ao menos 8 caracteres';
    }

    setErrors(next)
    if (Object.keys(next).length > 0) {
      return;
    }

    navigate('/login', { state: { justRegistered: true, email } })
  }

  return (
    <AuthLayout
      title="Cadastre sua igreja"
      subtitle={
        step === 1 ? 'Passo 1 de 2 · Dados da igreja' : 'Passo 2 de 2 · Sua conta'
      }
    >
      <div className="mb-6 flex gap-2">
        <span
          className={`h-1.5 flex-1 rounded-full ${
            step >= 1 ? 'bg-teal-600' : 'bg-slate-200'
          }`}
        />
        <span
          className={`h-1.5 flex-1 rounded-full ${
            step >= 2 ? 'bg-teal-600' : 'bg-slate-200'
          }`}
        />
      </div>

      {step === 1 ? (
        <div className="space-y-5">
          <TextField
            id="churchName"
            label="Nome da igreja"
            placeholder="Igreja Batista Central"
            value={churchName}
            onChange={(e) => setChurchName(e.target.value)}
            error={errors.churchName}
            autoFocus
          />
          <Button className="w-full" onClick={goToAccount}>
            Continuar
          </Button>
          <p className="text-center text-sm text-slate-500">
            Já tem uma conta?{' '}
            <Link to="/login" className="font-medium text-teal-700 hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      ) : (
        <form className="space-y-5" onSubmit={submit}>
          <TextField
            id="name"
            label="Nome"
            type="tel"
            placeholder="Seu nome"
            value={phone}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />
          <TextField
            id="email"
            label="Email"
            type="email"
            placeholder="voce@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            autoFocus
          />
          <TextField
            id="phone"
            label="Telefone"
            type="tel"
            placeholder="+5511999999999"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={errors.phone}
          />
          <TextField
            id="password"
            label="Senha"
            type="password"
            placeholder="Mínimo de 8 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
          <div className="flex gap-3">
            <Button type="button" variant="ghost" onClick={() => setStep(1)}>
              Voltar
            </Button>
            <Button type="submit" className="flex-1">
              Criar conta
            </Button>
          </div>
        </form>
      )}
    </AuthLayout>
  )
}
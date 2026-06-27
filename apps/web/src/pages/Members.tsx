import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { PlusIcon, XMarkIcon, ClipboardIcon } from '@heroicons/react/24/outline'
import DashboardLayout, { buildPhotoUrl } from '../components/DashboardLayout'
import Button from '../components/Button'
import TextField from '../components/TextField'
import { listMembers, addMember } from '../lib/api'
import type { MemberListItem } from '../lib/api'
import { getToken } from '../lib/auth'
import { isEmail } from '../lib/validation'

function Avatar({ name, path }: { name: string; path?: string }) {
  const url = buildPhotoUrl(path)
  if (url) {
    return <img src={url} alt={name} className="h-10 w-10 rounded-full object-cover" />
  }
  return (
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-teal-100 text-sm font-semibold text-teal-700">
      {name.charAt(0).toUpperCase()}
    </span>
  )
}

function AddMemberModal({
  onClose,
  onAdded,
}: {
  onClose: () => void
  onAdded: () => void
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [inviteUrl, setInviteUrl] = useState('')
  const [copied, setCopied] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setSubmitError('')
    const next: Record<string, string> = {}
    if (!name.trim()) next.name = 'Informe o nome'
    if (!isEmail(email)) next.email = 'Informe um email válido'
    setErrors(next)
    if (Object.keys(next).length > 0) return

    const token = getToken()
    if (!token) return

    setSubmitting(true)
    try {
      const result = await addMember(token, name, email)
      setInviteUrl(`${window.location.origin}${result.invitation.path}`)
      onAdded()
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Não foi possível adicionar o membro',
      )
    } finally {
      setSubmitting(false)
    }
  }

  async function copyLink() {
    await navigator.clipboard.writeText(inviteUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50"
        aria-label="Fechar"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            {inviteUrl ? 'Convite gerado' : 'Adicionar membro'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Fechar"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {inviteUrl ? (
          <div className="mt-4 space-y-4">
            <p className="text-sm text-slate-600">
              Envie este link para <span className="font-medium">{name}</span> concluir
              o cadastro. O convite expira em 7 dias.
            </p>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2">
              <input
                readOnly
                value={inviteUrl}
                className="min-w-0 flex-1 bg-transparent px-2 text-sm text-slate-700 outline-none"
              />
              <button
                type="button"
                onClick={copyLink}
                className="flex shrink-0 items-center gap-1 rounded-md bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-teal-700"
              >
                <ClipboardIcon className="h-4 w-4" />
                {copied ? 'Copiado' : 'Copiar'}
              </button>
            </div>
            <Button className="w-full" onClick={onClose}>
              Concluir
            </Button>
          </div>
        ) : (
          <form className="mt-4 space-y-4" onSubmit={submit}>
            {submitError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {submitError}
              </div>
            )}
            <TextField
              id="name"
              label="Nome"
              placeholder="Nome do membro"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              autoFocus
            />
            <TextField
              id="email"
              label="Email"
              type="email"
              placeholder="membro@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Gerando convite...' : 'Adicionar e gerar convite'}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}

export default function Members() {
  const [members, setMembers] = useState<MemberListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  function load() {
    const token = getToken()
    if (!token) return
    setLoading(true)
    listMembers(token)
      .then(setMembers)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Erro ao carregar membros'),
      )
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  return (
    <DashboardLayout>
      {() => (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Membros</h1>
              <p className="mt-1 text-sm text-slate-500">
                Gerencie os membros da sua igreja
              </p>
            </div>
            <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
              <PlusIcon className="h-5 w-5" />
              Adicionar membro
            </Button>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {loading ? (
              <p className="p-6 text-sm text-slate-500">Carregando...</p>
            ) : error ? (
              <p className="p-6 text-sm text-red-600">{error}</p>
            ) : members.length === 0 ? (
              <p className="p-6 text-sm text-slate-500">Nenhum membro ainda.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {members.map((m) => (
                  <li
                    key={m.uid}
                    className="flex items-center gap-4 px-4 py-3 sm:px-6"
                  >
                    <Avatar name={m.user.name} path={m.user.photo_path} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-slate-900">
                        {m.user.name}
                      </p>
                      <p className="truncate text-sm text-slate-500">
                        {m.user.email}
                      </p>
                    </div>
                    <div className="hidden flex-wrap items-center justify-end gap-1.5 sm:flex">
                      {m.roles.map((role) => (
                        <span
                          key={role.slug}
                          className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                        >
                          {role.name}
                        </span>
                      ))}
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                        m.pending
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-teal-50 text-teal-700'
                      }`}
                    >
                      {m.pending ? 'Convite pendente' : 'Ativo'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {modalOpen && (
            <AddMemberModal onClose={() => setModalOpen(false)} onAdded={load} />
          )}
        </>
      )}
    </DashboardLayout>
  )
}
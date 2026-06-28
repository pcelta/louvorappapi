import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import DashboardLayout, { buildPhotoUrl } from '../components/DashboardLayout'
import Button from '../components/Button'
import TextField from '../components/TextField'
import { updateChurch } from '../lib/api'
import type { CurrentMember } from '../lib/api'
import { getToken } from '../lib/auth'

function SettingsForm({ church }: { church: CurrentMember['church'] }) {
  const [name, setName] = useState(church.name)
  const [logo, setLogo] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState('')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const currentLogo = buildPhotoUrl(church.logo_path)
  const showLogo =
    logoPreview ||
    (currentLogo &&
    (church.logo_path.startsWith('http') ||
      church.logo_path.startsWith('/uploads'))
      ? currentLogo
      : '')
  const preview = logoPreview || showLogo

  function onLogoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null
    setLogo(file)
    setLogoPreview(file ? URL.createObjectURL(file) : '')
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError('')
    if (!name.trim()) {
      setError('Informe o nome da igreja')
      return
    }

    const token = getToken()
    if (!token) return

    setSubmitting(true)
    try {
      await updateChurch(token, { name, logo })
      setSaved(true)
      // reload so the sidebar logo/name reflect the change everywhere
      setTimeout(() => window.location.reload(), 700)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar')
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-bold text-slate-900">Configurações</h1>
      <p className="mt-1 text-sm text-slate-500">Dados da igreja</p>

      <form className="mt-6 space-y-5" onSubmit={submit}>
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {saved && (
          <div className="rounded-lg border border-teal-200 bg-teal-50 p-3 text-sm text-teal-800">
            Configurações salvas!
          </div>
        )}

        <div>
          <p className="mb-2 block text-sm font-medium text-slate-700">
            Logo da igreja
          </p>
          <div className="flex items-center gap-4">
            <span className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl bg-teal-100 text-2xl font-bold text-teal-700">
              {preview ? (
                <img
                  src={preview}
                  alt={church.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                church.name.charAt(0).toUpperCase()
              )}
            </span>
            <label className="cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
              Escolher logo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onLogoChange}
              />
            </label>
          </div>
        </div>

        <TextField
          id="church-name"
          label="Nome da igreja"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? 'Salvando...' : 'Salvar'}
        </Button>
      </form>
    </div>
  )
}

export default function Settings() {
  return (
    <DashboardLayout>
      {(member) => <SettingsForm church={member.church} />}
    </DashboardLayout>
  )
}
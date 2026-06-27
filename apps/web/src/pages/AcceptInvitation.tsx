import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import TextField from '../components/TextField'
import Button from '../components/Button'
import SkillPicker from '../components/SkillPicker'
import { getInvitation, acceptInvitation, listSkills } from '../lib/api'
import type { InvitationInfo, Skill } from '../lib/api'
import { isE164 } from '../lib/validation'

export default function AcceptInvitation() {
  const { code = '' } = useParams()
  const navigate = useNavigate()

  const [invitation, setInvitation] = useState<InvitationInfo | null>(null)
  const [loadError, setLoadError] = useState('')
  const [loading, setLoading] = useState(true)

  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState('')
  const [skills, setSkills] = useState<Skill[]>([])
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getInvitation(code)
      .then((data) => {
        setInvitation(data)
        setSelectedSkills(data.member.skills.map((s) => s.slug))
      })
      .catch((err) =>
        setLoadError(err instanceof Error ? err.message : 'Convite inválido'),
      )
      .finally(() => setLoading(false))

    listSkills()
      .then(setSkills)
      .catch(() => setSkills([]))
  }, [code])

  function toggleSkill(slug: string) {
    setSelectedSkills((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    )
  }

  function onPhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null
    setPhoto(file)
    setPhotoPreview(file ? URL.createObjectURL(file) : '')
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    setSubmitError('')
    const next: Record<string, string> = {}
    if (password.length < 8) next.password = 'A senha deve ter ao menos 8 caracteres'
    if (!isE164(phone))
      next.phone = 'Use o formato internacional, ex: +5511999999999'
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setSubmitting(true)
    try {
      await acceptInvitation(code, { password, phone, photo, skills: selectedSkills })
      navigate('/login', {
        state: { justRegistered: true, email: invitation?.member.user.email },
      })
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Não foi possível aceitar o convite',
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <AuthLayout title="Convite">
        <p className="text-sm text-slate-500">Carregando...</p>
      </AuthLayout>
    )
  }

  if (loadError || !invitation) {
    return (
      <AuthLayout title="Convite inválido" subtitle={loadError}>
        <Link to="/login" className="font-medium text-teal-700 hover:underline">
          Ir para o login
        </Link>
      </AuthLayout>
    )
  }

  const expired = new Date(invitation.expires_at).getTime() < Date.now()

  if (invitation.accepted) {
    return (
      <AuthLayout
        title="Convite já aceito"
        subtitle="Este convite já foi utilizado."
      >
        <Link to="/login" className="font-medium text-teal-700 hover:underline">
          Ir para o login
        </Link>
      </AuthLayout>
    )
  }

  if (expired) {
    return (
      <AuthLayout
        title="Convite expirado"
        subtitle="Solicite um novo convite ao administrador da igreja."
      >
        <Link to="/login" className="font-medium text-teal-700 hover:underline">
          Ir para o login
        </Link>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title={`Junte-se a ${invitation.member.church.name}`}
      subtitle={`Convite para ${invitation.member.user.name}`}
    >
      <form className="space-y-5" onSubmit={submit}>
        {submitError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {submitError}
          </div>
        )}

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
          <p className="text-slate-500">Convidado como</p>
          <p className="font-medium text-slate-800">{invitation.member.user.name}</p>
          <p className="text-slate-600">{invitation.member.user.email}</p>
        </div>

        <div className="flex items-center gap-4">
          <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full bg-slate-100 text-slate-400">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Prévia"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-xs">Foto</span>
            )}
          </span>
          <label className="cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
            Escolher foto
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onPhotoChange}
            />
          </label>
        </div>

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

        {skills.length > 0 && (
          <div>
            <p className="mb-2 block text-sm font-medium text-slate-700">
              Habilidades
            </p>
            <SkillPicker
              skills={skills}
              selected={selectedSkills}
              onToggle={toggleSkill}
            />
          </div>
        )}

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? 'Concluindo...' : 'Concluir cadastro'}
        </Button>
      </form>
    </AuthLayout>
  )
}
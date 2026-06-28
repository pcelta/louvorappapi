import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import DashboardLayout, { buildPhotoUrl } from '../components/DashboardLayout'
import Button from '../components/Button'
import TextField from '../components/TextField'
import SkillPicker from '../components/SkillPicker'
import { updateProfile, listSkills } from '../lib/api'
import type { CurrentMember, Skill } from '../lib/api'
import { getToken } from '../lib/auth'
import { isEmail } from '../lib/validation'

function ProfileForm({ member }: { member: CurrentMember }) {
  const [name, setName] = useState(member.user.name)
  const [email, setEmail] = useState(member.user.email)
  const [password, setPassword] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState('')
  const [skills, setSkills] = useState<Skill[]>([])
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    member.skills.map((s) => s.slug),
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    listSkills()
      .then(setSkills)
      .catch(() => setSkills([]))
  }, [])

  const currentPhoto = buildPhotoUrl(member.user.photo_path)
  const preview = photoPreview || currentPhoto || ''

  function onPhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null
    setPhoto(file)
    setPhotoPreview(file ? URL.createObjectURL(file) : '')
  }

  function toggleSkill(slug: string) {
    setSelectedSkills((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    )
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError('')
    const next: Record<string, string> = {}
    if (!name.trim()) next.name = 'Informe um nome'
    if (!isEmail(email)) next.email = 'Informe um email válido'
    if (password && password.length < 8)
      next.password = 'A senha deve ter ao menos 8 caracteres'
    setErrors(next)
    if (Object.keys(next).length > 0) return

    const token = getToken()
    if (!token) return

    setSubmitting(true)
    try {
      await updateProfile(token, {
        name,
        email,
        password: password || undefined,
        photo,
        skills: selectedSkills,
      })
      // reload so the sidebar/topbar avatar and name reflect the change
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar')
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-bold text-slate-900">Meu perfil</h1>
      <p className="mt-1 text-sm text-slate-500">Edite as suas informações</p>

      <form className="mt-6 space-y-5" onSubmit={submit}>
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex items-center gap-4">
          <span className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full bg-teal-100 text-2xl font-bold text-teal-700">
            {preview ? (
              <img
                src={preview}
                alt={name}
                className="h-full w-full object-cover"
              />
            ) : (
              name.charAt(0).toUpperCase()
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
          id="name"
          label="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />
        <TextField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <TextField
          id="password"
          label="Nova senha"
          type="password"
          placeholder="Deixe em branco para manter a atual"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

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

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? 'Salvando...' : 'Salvar'}
        </Button>
      </form>
    </div>
  )
}

export default function Profile() {
  return (
    <DashboardLayout>{(member) => <ProfileForm member={member} />}</DashboardLayout>
  )
}
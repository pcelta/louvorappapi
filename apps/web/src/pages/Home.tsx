import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../lib/api'
import type { CurrentMember } from '../lib/api'
import { clearToken, getToken } from '../lib/auth'

function Logo({ name, path }: { name: string; path: string }) {
  const isImage = path?.startsWith('http')
  if (isImage) {
    return (
      <img
        src={path}
        alt={name}
        className="h-10 w-10 rounded-xl object-cover"
      />
    )
  }
  return (
    <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-600 text-lg font-bold text-white">
      {name.charAt(0).toUpperCase()}
    </span>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const [member, setMember] = useState<CurrentMember | null>(null)
  const [error, setError] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    getMe(token)
      .then(setMember)
      .catch((err) => {
        clearToken()
        setError(err instanceof Error ? err.message : 'Sessão inválida')
        navigate('/login', { replace: true })
      })
  }, [navigate])

  function logout() {
    clearToken()
    navigate('/login', { replace: true })
  }

  if (!member) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 text-slate-500">
        {error || 'Carregando...'}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <Logo name={member.church.name} path={member.church.logo_path} />
          <h1 className="text-lg font-semibold text-slate-800">
            Bem vindo(a) {member.user.name} a {member.church.name}
          </h1>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="grid h-10 w-10 place-items-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700 transition hover:bg-slate-300"
            aria-label="Menu do usuário"
          >
            {member.user.name.charAt(0).toUpperCase()}
          </button>

          {menuOpen && (
            <>
              <button
                type="button"
                className="fixed inset-0 z-10 cursor-default"
                aria-hidden="true"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 z-20 mt-2 w-40 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
                <button
                  type="button"
                  onClick={logout}
                  className="block w-full px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  Sair
                </button>
              </div>
            </>
          )}
        </div>
      </header>
    </div>
  )
}
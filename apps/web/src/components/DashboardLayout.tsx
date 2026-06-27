import { useEffect, useState } from 'react'
import type { ComponentType, ReactNode, SVGProps } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Squares2X2Icon,
  QueueListIcon,
  CalendarDaysIcon,
  MusicalNoteIcon,
  UsersIcon,
  Cog6ToothIcon,
  BellIcon,
  ChevronUpDownIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { getMe, API_URL } from '../lib/api'
import type { CurrentMember } from '../lib/api'
import { clearToken, getToken } from '../lib/auth'

type HeroIcon = ComponentType<SVGProps<SVGSVGElement>>

const navSections: {
  label: string
  items: { label: string; icon: HeroIcon; to?: string }[]
}[] = [
  {
    label: 'Painel',
    items: [
      { label: 'Visão geral', icon: Squares2X2Icon, to: '/home' },
      { label: 'Repertório', icon: QueueListIcon },
      { label: 'Escalas', icon: CalendarDaysIcon },
      { label: 'Músicas', icon: MusicalNoteIcon },
    ],
  },
  {
    label: 'Gestão',
    items: [
      { label: 'Membros', icon: UsersIcon, to: '/members' },
      { label: 'Configurações', icon: Cog6ToothIcon },
    ],
  },
]

export function buildPhotoUrl(path?: string): string | undefined {
  if (!path) {
    return undefined
  }
  return path.startsWith('http') ? path : `${API_URL}${path}`
}

function ChurchLogo({ name, path }: { name: string; path: string }) {
  const url = buildPhotoUrl(path)
  if (url && (path.startsWith('http') || path.startsWith('/uploads'))) {
    return <img src={url} alt={name} className="h-9 w-9 rounded-lg object-cover" />
  }
  return (
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-teal-500 text-sm font-bold text-white">
      {name.charAt(0).toUpperCase()}
    </span>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: (member: CurrentMember) => ReactNode
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const [member, setMember] = useState<CurrentMember | null>(null)
  const [error, setError] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

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

  const avatarUrl = buildPhotoUrl(member.user.photo_path)

  return (
    <div className="flex min-h-screen bg-slate-50">
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-900/50 md:hidden"
          aria-label="Fechar menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col bg-slate-900 p-4 transition-transform md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-2 py-2">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-teal-500 text-base font-bold text-white">
              L
            </span>
            <span className="text-lg font-semibold tracking-tight text-white">
              LouvorApp
            </span>
          </div>
          <button
            type="button"
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white md:hidden"
            aria-label="Fechar menu"
            onClick={() => setSidebarOpen(false)}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-800 p-3">
          <ChurchLogo name={member.church.name} path={member.church.logo_path} />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Igreja
            </p>
            <p className="truncate text-sm font-semibold text-white">
              {member.church.name}
            </p>
          </div>
          <ChevronUpDownIcon className="h-4 w-4 shrink-0 text-slate-400" />
        </div>

        <nav className="mt-6 flex-1 space-y-6">
          {navSections.map((section) => (
            <div key={section.label}>
              <p className="px-3 text-[11px] font-medium uppercase tracking-wide text-slate-500">
                {section.label}
              </p>
              <ul className="mt-2 space-y-1">
                {section.items.map((item) => {
                  const active = !!item.to && location.pathname === item.to
                  return (
                    <li key={item.label}>
                      <button
                        type="button"
                        onClick={() => {
                          setSidebarOpen(false)
                          if (item.to) {
                            navigate(item.to)
                          }
                        }}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                          active
                            ? 'bg-teal-600 text-white'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <item.icon className="h-[18px] w-[18px]" />
                        {item.label}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 md:hidden"
            aria-label="Abrir menu"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          <button
            type="button"
            className="relative ml-auto grid h-10 w-10 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100"
            aria-label="Notificações"
          >
            <BellIcon className="h-5 w-5" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-teal-500 ring-2 ring-white" />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-teal-600 text-sm font-semibold text-white transition hover:bg-teal-700"
              aria-label="Menu do usuário"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={member.user.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                member.user.name.charAt(0).toUpperCase()
              )}
            </button>

            {menuOpen && (
              <>
                <button
                  type="button"
                  className="fixed inset-0 z-10 cursor-default"
                  aria-hidden="true"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="truncate text-sm font-medium text-slate-800">
                      {member.user.name}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {member.user.email}
                    </p>
                  </div>
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

        <main className="flex-1 p-6">{children(member)}</main>
      </div>
    </div>
  )
}
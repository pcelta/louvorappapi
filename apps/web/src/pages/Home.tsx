import type { ComponentType, SVGProps } from 'react'
import {
  UsersIcon,
  MusicalNoteIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline'
import DashboardLayout from '../components/DashboardLayout'

type HeroIcon = ComponentType<SVGProps<SVGSVGElement>>

const summaryCards: { label: string; icon: HeroIcon }[] = [
  { label: 'Membros', icon: UsersIcon },
  { label: 'Músicas', icon: MusicalNoteIcon },
  { label: 'Escalas', icon: CalendarDaysIcon },
]

export default function Home() {
  return (
    <DashboardLayout>
      {(member) => (
        <>
          <h1 className="text-2xl font-bold text-slate-900">
            Bem vindo(a), {member.user.name}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{member.church.name}</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {summaryCards.map((card) => (
              <div
                key={card.label}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-50 text-teal-600">
                    <card.icon className="h-5 w-5" />
                  </span>
                  <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700">
                    Em breve
                  </span>
                </div>
                <p className="mt-4 text-sm font-medium text-slate-500">
                  {card.label}
                </p>
                <p className="text-2xl font-bold text-slate-900">—</p>
              </div>
            ))}
          </div>
        </>
      )}
    </DashboardLayout>
  )
}
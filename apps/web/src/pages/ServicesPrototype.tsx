import { CalendarIcon } from '@heroicons/react/24/outline'
import DashboardLayout from '../components/DashboardLayout'
import InstrumentIcon from '../components/InstrumentIcon'

// PROTOTYPE ONLY — mock data, not wired to the backend.
type TeamMember = {
  name: string
  role: string
  instrument: string // InstrumentIcon key
  photo?: string
}

type MockService = {
  uid: string
  title: string
  when: string
  isSupper?: boolean
  team: TeamMember[]
}

const MOCK: MockService[] = [
  {
    uid: '1',
    title: 'Culto da Família',
    when: 'Dom, 29/06 · 18:00',
    isSupper: true,
    team: [
      { name: 'Ana Souza', role: 'Vocal', instrument: 'microphone' },
      { name: 'Pedro Ribeiro', role: 'Violão', instrument: 'acoustic-guitar' },
      { name: 'Lucas Lima', role: 'Bateria', instrument: 'drums' },
      { name: 'Marina Alves', role: 'Teclado', instrument: 'keyboard' },
    ],
  },
  {
    uid: '2',
    title: 'Culto de Oração',
    when: 'Qua, 02/07 · 19:30',
    team: [
      { name: 'João Mendes', role: 'Guitarra', instrument: 'guitar' },
      { name: 'Bia Costa', role: 'Vocal', instrument: 'microphone' },
      { name: 'Rafa Dias', role: 'Baixo', instrument: 'bass' },
    ],
  },
  {
    uid: '3',
    title: 'Ensaio Geral',
    when: 'Sex, 04/07 · 20:00',
    team: [
      { name: 'Marina Alves', role: 'Teclado', instrument: 'keyboard' },
      { name: 'Lucas Lima', role: 'Bateria', instrument: 'drums' },
    ],
  },
]

function Avatar({ member }: { member: TeamMember }) {
  return (
    <div className="group relative -ml-2 transition first:ml-0 hover:z-20">
      <div className="relative">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-teal-600 text-[11px] font-semibold text-white ring-2 ring-white">
          {member.photo ? (
            <img
              src={member.photo}
              alt={member.name}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            member.name.charAt(0).toUpperCase()
          )}
        </span>
        <span className="absolute -bottom-0.5 -right-0.5 grid h-3.5 w-3.5 place-items-center rounded-full bg-white text-teal-600 shadow ring-1 ring-slate-200">
          <InstrumentIcon name={member.instrument} className="h-2 w-2" />
        </span>
      </div>

      <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition group-hover:opacity-100">
        {member.name} · {member.role}
      </span>
    </div>
  )
}

export default function ServicesPrototype() {
  return (
    <DashboardLayout>
      {() => (
        <>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">Cultos</h1>
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                Protótipo
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Listagem com avatares da equipe escalada (dados fictícios)
            </p>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <ul className="divide-y divide-slate-100">
              {MOCK.map((service) => (
                <li
                  key={service.uid}
                  className="flex items-center gap-4 px-4 py-4 sm:px-6"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-teal-50 text-teal-600">
                    <CalendarIcon className="h-5 w-5" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-slate-900">
                      {service.title}
                      {service.isSupper && (
                        <span className="ml-2 rounded-full bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-700">
                          Ceia
                        </span>
                      )}
                    </p>
                    <p className="truncate text-sm text-slate-500">{service.when}</p>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-1.5 pl-2">
                    <span className="flex items-center gap-1 text-xs font-medium text-slate-400">
                      <InstrumentIcon name="microphone" className="h-3.5 w-3.5" />
                      Time de Louvor
                    </span>
                    <div className="flex items-center">
                      {service.team.map((member) => (
                        <Avatar key={member.name} member={member} />
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </DashboardLayout>
  )
}
import { buildPhotoUrl } from './DashboardLayout'
import InstrumentIcon from './InstrumentIcon'

export type TeamEntry = {
  uid?: string
  name: string
  photo_path?: string
  instrument: string
  role?: string
}

function Avatar({ member }: { member: TeamEntry }) {
  const photo = buildPhotoUrl(member.photo_path)
  return (
    <div className="group relative -ml-2 transition first:ml-0 hover:z-20">
      <div className="relative">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-teal-600 text-[11px] font-semibold text-white ring-2 ring-white">
          {photo ? (
            <img
              src={photo}
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
        {member.name}
        {member.role ? ` · ${member.role}` : ''}
      </span>
    </div>
  )
}

export default function WorshipTeamStack({ team }: { team: TeamEntry[] }) {
  if (team.length === 0) {
    return null
  }

  return (
    <div className="flex shrink-0 flex-col items-end gap-1.5">
      <span className="flex items-center gap-1 text-xs font-medium text-slate-400">
        <InstrumentIcon name="microphone" className="h-3.5 w-3.5" />
        Time de Louvor
      </span>
      <div className="flex items-center">
        {team.map((member, index) => (
          <Avatar key={member.uid ?? index} member={member} />
        ))}
      </div>
    </div>
  )
}
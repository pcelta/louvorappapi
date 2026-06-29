import { buildPhotoUrl } from './DashboardLayout'
import InstrumentIcon from './InstrumentIcon'
import type { TeamEntry } from './WorshipTeamStack'

function Box({ member }: { member: TeamEntry }) {
  const photo = buildPhotoUrl(member.photo_path)
  return (
    <div className="flex w-16 flex-col items-center gap-1 rounded-lg border border-slate-200 bg-white p-2">
      <div className="relative">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-teal-600 text-xs font-semibold text-white">
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
        <span className="absolute -bottom-0.5 -right-0.5 grid h-4 w-4 place-items-center rounded-full bg-white text-teal-600 shadow ring-1 ring-slate-200">
          <InstrumentIcon name={member.instrument} className="h-2.5 w-2.5" />
        </span>
      </div>
      <span className="w-full truncate text-center text-[11px] font-medium text-slate-600">
        {member.name.split(' ')[0]}
      </span>
    </div>
  )
}

export default function WorshipTeamBoxes({ team }: { team: TeamEntry[] }) {
  if (team.length === 0) {
    return <p className="text-sm text-slate-400">Sem time escalado</p>
  }

  return (
    <div className="flex flex-wrap gap-2">
      {team.map((member, index) => (
        <Box key={member.uid ?? index} member={member} />
      ))}
    </div>
  )
}
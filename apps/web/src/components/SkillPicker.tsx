import InstrumentIcon from './InstrumentIcon'
import type { Skill } from '../lib/api'

type Props = {
  skills: Skill[]
  selected: string[]
  onToggle: (slug: string) => void
}

export default function SkillPicker({ skills, selected, onToggle }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => {
        const on = selected.includes(skill.slug)
        return (
          <button
            key={skill.slug}
            type="button"
            onClick={() => onToggle(skill.slug)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
              on
                ? 'border-teal-600 bg-teal-50 text-teal-700'
                : 'border-slate-300 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <InstrumentIcon name={skill.icon} className="h-4 w-4" />
            {skill.name}
          </button>
        )
      })}
    </div>
  )
}
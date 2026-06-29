import { useEffect, useRef, useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { searchMembersByRole } from '../lib/api'
import type { PastorRef } from '../lib/api'
import { getToken } from '../lib/auth'

type Props = {
  role: string
  value: PastorRef[]
  onChange: (members: PastorRef[]) => void
  placeholder?: string
}

export default function MemberSelect({
  role,
  value,
  onChange,
  placeholder = 'Buscar membro...',
}: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<PastorRef[]>([])
  const [open, setOpen] = useState(false)
  const debounce = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    const token = getToken()
    if (!token) return

    clearTimeout(debounce.current)
    debounce.current = setTimeout(() => {
      searchMembersByRole(token, role, query)
        .then(setResults)
        .catch(() => setResults([]))
    }, 250)

    return () => clearTimeout(debounce.current)
  }, [query, role])

  const available = results.filter((r) => !value.some((v) => v.uid === r.uid))

  return (
    <div>
      {value.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {value.map((member) => (
            <span
              key={member.uid}
              className="flex items-center gap-1 rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700"
            >
              {member.name}
              <button
                type="button"
                onClick={() => onChange(value.filter((v) => v.uid !== member.uid))}
                aria-label="Remover"
              >
                <XMarkIcon className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        />
        {open && query.trim() && (
          <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
            {available.length > 0 ? (
              available.map((member) => (
                <button
                  key={member.uid}
                  type="button"
                  onClick={() => {
                    onChange([...value, member])
                    setQuery('')
                    setOpen(false)
                  }}
                  className="block w-full px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  {member.name}
                </button>
              ))
            ) : (
              <p className="px-3 py-2 text-sm text-slate-400">
                Nenhum membro encontrado
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
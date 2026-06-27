import { useEffect, useRef, useState } from 'react'
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { searchArtists, createArtist } from '../lib/api'
import type { Artist } from '../lib/api'
import { getToken } from '../lib/auth'

type Props = {
  value: Artist | null
  onChange: (artist: Artist | null) => void
}

export default function ArtistSelect({ value, onChange }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Artist[]>([])
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const debounce = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    if (value) return
    const token = getToken()
    if (!token) return

    clearTimeout(debounce.current)
    debounce.current = setTimeout(() => {
      searchArtists(token, query)
        .then(setResults)
        .catch(() => setResults([]))
    }, 250)

    return () => clearTimeout(debounce.current)
  }, [query, value])

  async function quickCreate() {
    const token = getToken()
    if (!token || !query.trim()) return
    setBusy(true)
    try {
      const artist = await createArtist(token, query.trim())
      onChange(artist)
      setOpen(false)
    } finally {
      setBusy(false)
    }
  }

  if (value) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-slate-300 px-3 py-2">
        <span className="text-sm font-medium text-slate-800">{value.name}</span>
        <button
          type="button"
          onClick={() => onChange(null)}
          className="grid h-7 w-7 place-items-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          aria-label="Remover artista"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>
    )
  }

  const exactMatch = results.some(
    (a) => a.name.toLowerCase() === query.trim().toLowerCase(),
  )

  return (
    <div className="relative">
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        placeholder="Buscar artista..."
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
      />
      {open && (query.trim() || results.length > 0) && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          {results.map((artist) => (
            <button
              key={artist.uid}
              type="button"
              onClick={() => {
                onChange(artist)
                setOpen(false)
              }}
              className="block w-full px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50"
            >
              {artist.name}
            </button>
          ))}
          {query.trim() && !exactMatch && (
            <button
              type="button"
              onClick={quickCreate}
              disabled={busy}
              className="flex w-full items-center gap-2 border-t border-slate-100 px-3 py-2 text-left text-sm font-medium text-teal-700 transition hover:bg-teal-50"
            >
              <PlusIcon className="h-4 w-4" />
              {busy ? 'Criando...' : `Criar "${query.trim()}"`}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
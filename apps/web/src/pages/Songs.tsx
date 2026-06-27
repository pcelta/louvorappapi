import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PlusIcon, MusicalNoteIcon } from '@heroicons/react/24/outline'
import DashboardLayout from '../components/DashboardLayout'
import Button from '../components/Button'
import { listSongs } from '../lib/api'
import type { SongData } from '../lib/api'
import { getToken } from '../lib/auth'
import { occasionLabel } from '../lib/occasions'

export default function Songs() {
  const navigate = useNavigate()
  const [songs, setSongs] = useState<SongData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = getToken()
    if (!token) return
    listSongs(token)
      .then(setSongs)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Erro ao carregar músicas'),
      )
      .finally(() => setLoading(false))
  }, [])

  return (
    <DashboardLayout>
      {() => (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Músicas</h1>
              <p className="mt-1 text-sm text-slate-500">
                Repertório da igreja
              </p>
            </div>
            <Button
              onClick={() => navigate('/songs/new')}
              className="flex items-center gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              Adicionar música
            </Button>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {loading ? (
              <p className="p-6 text-sm text-slate-500">Carregando...</p>
            ) : error ? (
              <p className="p-6 text-sm text-red-600">{error}</p>
            ) : songs.length === 0 ? (
              <p className="p-6 text-sm text-slate-500">Nenhuma música ainda.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {songs.map((song) => (
                  <li key={song.uid}>
                    <button
                      type="button"
                      onClick={() => navigate(`/songs/${song.uid}`)}
                      className="flex w-full items-center gap-4 px-4 py-3 text-left transition hover:bg-slate-50 sm:px-6"
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-teal-50 text-teal-600">
                        <MusicalNoteIcon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p
                          className={`truncate font-medium ${
                            song.is_active ? 'text-slate-900' : 'text-slate-400'
                          }`}
                        >
                          {song.title}
                        </p>
                        <p className="truncate text-sm text-slate-500">
                          {song.artist?.name ?? 'Sem artista'}
                        </p>
                        {song.attributes?.occasions &&
                          song.attributes.occasions.length > 0 && (
                            <div className="mt-1.5 flex flex-wrap gap-1.5">
                              {song.attributes.occasions.map((o) => (
                                <span
                                  key={o}
                                  className="rounded-md bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600"
                                >
                                  {occasionLabel(o)}
                                </span>
                              ))}
                            </div>
                          )}
                      </div>
                      {song.key && (
                        <span className="shrink-0 rounded-md bg-slate-900 px-2 py-1 text-xs font-semibold text-white">
                          {song.key}
                        </span>
                      )}
                      {!song.is_active && (
                        <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                          Inativa
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  )
}
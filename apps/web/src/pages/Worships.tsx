import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PlusIcon } from '@heroicons/react/24/outline'
import DashboardLayout from '../components/DashboardLayout'
import Button from '../components/Button'
import WorshipTeamBoxes from '../components/WorshipTeamBoxes'
import { listWorships } from '../lib/api'
import type { WorshipData } from '../lib/api'
import { getToken } from '../lib/auth'
import { mockInstrument } from '../lib/mockInstruments'

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}
export default function Worships() {
  const navigate = useNavigate()
  const [worships, setWorships] = useState<WorshipData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = getToken()
    if (!token) return
    listWorships(token)
      .then(setWorships)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Erro ao carregar escalas'),
      )
      .finally(() => setLoading(false))
  }, [])

  return (
    <DashboardLayout>
      {() => (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Escala Louvor</h1>
              <p className="mt-1 text-sm text-slate-500">
                Louvor de cada culto
              </p>
            </div>
            <Button
              onClick={() => navigate('/worships/new')}
              className="flex items-center gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              Nova escala
            </Button>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {loading ? (
              <p className="p-6 text-sm text-slate-500">Carregando...</p>
            ) : error ? (
              <p className="p-6 text-sm text-red-600">{error}</p>
            ) : worships.length === 0 ? (
              <p className="p-6 text-sm text-slate-500">Nenhuma escala ainda.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {worships.map((worship) => (
                  <li key={worship.uid} className="px-4 py-4 sm:px-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900">
                          {worship.title}
                        </p>
                        {worship.service && (
                          <p className="text-sm text-slate-500">
                            {worship.service.title}: {formatDateTime(worship.service.scheduled_at)}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => navigate(`/worships/${worship.uid}/edit`)}
                        className="shrink-0 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                      >
                        Editar
                      </button>
                    </div>

                    {worship.team.length > 0 && (
                      <div className="mt-3">
                        <p className="mb-1.5 text-xs font-medium text-slate-400">
                          Time de Louvor
                        </p>
                        <WorshipTeamBoxes
                          team={worship.team.map((m, i) => ({
                            ...m,
                            instrument: mockInstrument(i),
                          }))}
                        />
                      </div>
                    )}

                    <div className="mt-4">
                      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Repertório
                      </p>
                      {worship.songs.length > 0 ? (
                        <div className="overflow-x-auto rounded-lg border border-slate-200">
                          <table className="w-full text-sm">
                            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-400">
                              <tr>
                                <th className="px-3 py-2 font-medium">#</th>
                                <th className="px-3 py-2 font-medium">Música</th>
                                <th className="px-3 py-2 font-medium">Artista</th>
                                <th className="px-3 py-2 font-medium">Tom</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {worship.songs.map((ws, index) => (
                                <tr
                                  key={ws.uid}
                                  onClick={() =>
                                    navigate(`/songs/${ws.song.uid}`)
                                  }
                                  className="cursor-pointer transition hover:bg-slate-50"
                                >
                                  <td className="px-3 py-2 text-slate-500">
                                    {index + 1}
                                  </td>
                                  <td className="px-3 py-2 font-medium text-slate-800">
                                    {ws.song.title}
                                  </td>
                                  <td className="px-3 py-2 text-slate-600">
                                    {ws.song.artist?.name ?? '—'}
                                  </td>
                                  <td className="px-3 py-2">
                                    {ws.song.key ? (
                                      <span className="rounded bg-slate-900 px-1.5 py-0.5 text-xs font-semibold text-white">
                                        {ws.song.key}
                                      </span>
                                    ) : (
                                      '—'
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-400">Sem músicas</p>
                      )}
                    </div>
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
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  PencilSquareIcon,
  ArrowLeftIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline'
import DashboardLayout from '../components/DashboardLayout'
import Button from '../components/Button'
import LinkSourceIcon, { linkTypeLabel } from '../components/LinkSourceIcon'
import { getSong } from '../lib/api'
import type { SongData } from '../lib/api'
import { getToken } from '../lib/auth'
import { occasionLabel } from '../lib/occasions'

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-0.5 font-semibold text-slate-800">{value}</p>
    </div>
  )
}

export default function SongDetail() {
  const navigate = useNavigate()
  const { uid = '' } = useParams()
  const [song, setSong] = useState<SongData | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (!token) return
    getSong(token, uid)
      .then(setSong)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Música não encontrada'),
      )
      .finally(() => setLoading(false))
  }, [uid])

  return (
    <DashboardLayout>
      {() => (
        <div className="mx-auto max-w-2xl">
          <button
            type="button"
            onClick={() => navigate('/songs')}
            className="flex items-center gap-1 text-sm text-slate-500 transition hover:text-slate-800"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Voltar
          </button>

          {loading ? (
            <p className="mt-6 text-sm text-slate-500">Carregando...</p>
          ) : error || !song ? (
            <p className="mt-6 text-sm text-red-600">{error || 'Não encontrada'}</p>
          ) : (
            <>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="text-2xl font-bold text-slate-900">
                    {song.title}
                  </h1>
                  <p className="mt-1 text-slate-500">
                    {song.artist?.name ?? 'Sem artista'}
                    {!song.is_active && ' · Inativa'}
                  </p>
                </div>
                <Button
                  onClick={() => navigate(`/songs/${song.uid}/edit`)}
                  className="flex shrink-0 items-center gap-2"
                >
                  <PencilSquareIcon className="h-5 w-5" />
                  Editar
                </Button>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <Meta label="Tom" value={song.key || '—'} />
                <Meta label="BPM" value={song.bpm ? String(song.bpm) : '—'} />
                <Meta
                  label="Multitrack"
                  value={song.has_multitrack ? 'Sim' : 'Não'}
                />
              </div>

              {song.attributes?.occasions &&
                song.attributes.occasions.length > 0 && (
                  <div className="mt-5">
                    <p className="text-sm font-medium text-slate-700">Ocasiões</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {song.attributes.occasions.map((o) => (
                        <span
                          key={o}
                          className="rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700"
                        >
                          {occasionLabel(o)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {song.links.length > 0 && (
                <div className="mt-5">
                  <p className="text-sm font-medium text-slate-700">Links</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {song.links.map((link) => (
                      <a
                        key={link.uid}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        <LinkSourceIcon type={link.type} className="h-4 w-4" />
                        {linkTypeLabel(link.type)}
                        <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5 text-slate-400" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <p className="text-sm font-medium text-slate-700">Letra</p>
                {song.lyrics ? (
                  <div
                    className="mt-2 whitespace-pre-wrap rounded-xl border border-slate-200 bg-white p-4 text-slate-800"
                    dangerouslySetInnerHTML={{ __html: song.lyrics }}
                  />
                ) : (
                  <p className="mt-2 text-sm text-slate-400">Sem letra cadastrada.</p>
                )}
              </div>

              {song.notes && (
                <div className="mt-5">
                  <p className="text-sm font-medium text-slate-700">Observações</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">
                    {song.notes}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </DashboardLayout>
  )
}
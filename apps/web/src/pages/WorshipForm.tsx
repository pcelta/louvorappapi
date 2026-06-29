import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline'
import DashboardLayout from '../components/DashboardLayout'
import Button from '../components/Button'
import TextField from '../components/TextField'
import MemberSelect from '../components/MemberSelect'
import {
  listServices,
  listSongs,
  getWorship,
  createWorship,
  updateWorship,
} from '../lib/api'
import type { ServiceData, SongData, PastorRef } from '../lib/api'
import { getToken } from '../lib/auth'

type SelectedSong = { uid: string; title: string; artist: string }

export default function WorshipForm() {
  const navigate = useNavigate()
  const { uid } = useParams()
  const isEdit = !!uid

  const [services, setServices] = useState<ServiceData[]>([])
  const [allSongs, setAllSongs] = useState<SongData[]>([])

  const [title, setTitle] = useState('')
  const [serviceUid, setServiceUid] = useState('')
  const [songs, setSongs] = useState<SelectedSong[]>([])
  const [team, setTeam] = useState<PastorRef[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(isEdit)

  useEffect(() => {
    const token = getToken()
    if (!token) return

    listServices(token)
      .then(setServices)
      .catch(() => setServices([]))
    listSongs(token)
      .then(setAllSongs)
      .catch(() => setAllSongs([]))

    if (isEdit) {
      getWorship(token, uid)
        .then((w) => {
          setTitle(w.title)
          setServiceUid(w.service?.uid ?? '')
          setSongs(
            w.songs.map((ws) => ({
              uid: ws.song.uid,
              title: ws.song.title,
              artist: ws.song.artist?.name ?? '—',
            })),
          )
          setTeam(w.team.map((m) => ({ uid: m.uid, name: m.name })))
        })
        .catch((err) =>
          setSubmitError(err instanceof Error ? err.message : 'Erro ao carregar'),
        )
        .finally(() => setLoading(false))
    }
  }, [isEdit, uid])

  function addSong(songUid: string) {
    const song = allSongs.find((s) => s.uid === songUid)
    if (!song || songs.some((s) => s.uid === songUid)) return
    setSongs((prev) => [
      ...prev,
      { uid: song.uid, title: song.title, artist: song.artist?.name ?? '—' },
    ])
  }

  function moveSong(index: number, dir: -1 | 1) {
    setSongs((prev) => {
      const next = [...prev]
      const target = index + dir
      if (target < 0 || target >= next.length) return prev
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    setSubmitError('')
    const next: Record<string, string> = {}
    if (!title.trim()) next.title = 'Informe o título'
    if (!serviceUid) next.service = 'Selecione o culto'
    setErrors(next)
    if (Object.keys(next).length > 0) return

    const token = getToken()
    if (!token) return

    const payload = {
      title: title.trim(),
      serviceUid,
      songUids: songs.map((s) => s.uid),
      memberUids: team.map((m) => m.uid),
    }

    setSubmitting(true)
    try {
      if (isEdit) {
        await updateWorship(token, uid, payload)
      } else {
        await createWorship(token, payload)
      }
      navigate('/worships')
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Não foi possível salvar')
    } finally {
      setSubmitting(false)
    }
  }

  const availableSongs = allSongs.filter(
    (s) => !songs.some((sel) => sel.uid === s.uid),
  )

  return (
    <DashboardLayout>
      {() => (
        <div className="mx-auto max-w-2xl">
          <h1 className="text-2xl font-bold text-slate-900">
            {isEdit ? 'Editar escala' : 'Nova escala'}
          </h1>

          {loading ? (
            <p className="mt-6 text-sm text-slate-500">Carregando...</p>
          ) : (
            <form className="mt-6 space-y-5" onSubmit={submit}>
              {submitError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {submitError}
                </div>
              )}

              <TextField
                id="title"
                label="Título"
                placeholder="Ex: Louvor Culto da Família"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={errors.title}
              />

              <div>
                <label
                  htmlFor="service"
                  className="block text-sm font-medium text-slate-700"
                >
                  Culto
                </label>
                <select
                  id="service"
                  value={serviceUid}
                  onChange={(e) => setServiceUid(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                >
                  <option value="">Selecione...</option>
                  {services.map((s) => (
                    <option key={s.uid} value={s.uid}>
                      {s.title}
                    </option>
                  ))}
                </select>
                {errors.service && (
                  <p className="mt-1 text-sm text-red-600">{errors.service}</p>
                )}
              </div>

              <div>
                <p className="mb-2 block text-sm font-medium text-slate-700">
                  Músicas
                </p>
                <select
                  value=""
                  onChange={(e) => {
                    if (e.target.value) addSong(e.target.value)
                  }}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                >
                  <option value="">Adicionar música...</option>
                  {availableSongs.map((s) => (
                    <option key={s.uid} value={s.uid}>
                      {s.artist?.name ? `${s.artist.name}: ` : ''}
                      {s.title}
                    </option>
                  ))}
                </select>

                {songs.length > 0 && (
                  <ul className="mt-2 space-y-2">
                    {songs.map((song, index) => (
                      <li
                        key={song.uid}
                        className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2"
                      >
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded bg-slate-100 text-xs font-semibold text-slate-500">
                          {index + 1}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-sm text-slate-700">
                          <span className="text-slate-500">{song.artist}:</span>{' '}
                          {song.title}
                        </span>
                        <button
                          type="button"
                          onClick={() => moveSong(index, -1)}
                          className="grid h-7 w-7 place-items-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                          aria-label="Subir"
                        >
                          <ChevronUpIcon className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveSong(index, 1)}
                          className="grid h-7 w-7 place-items-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                          aria-label="Descer"
                        >
                          <ChevronDownIcon className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setSongs((prev) =>
                              prev.filter((s) => s.uid !== song.uid),
                            )
                          }
                          className="grid h-7 w-7 place-items-center rounded text-slate-400 hover:bg-slate-100 hover:text-red-600"
                          aria-label="Remover"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <p className="mb-1 block text-sm font-medium text-slate-700">
                  Time de Louvor
                </p>
                <MemberSelect
                  role="worship_team_member"
                  value={team}
                  onChange={setTeam}
                  placeholder="Buscar integrante..."
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate('/worships')}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1" disabled={submitting}>
                  {submitting ? 'Salvando...' : 'Salvar escala'}
                </Button>
              </div>
            </form>
          )}
        </div>
      )}
    </DashboardLayout>
  )
}
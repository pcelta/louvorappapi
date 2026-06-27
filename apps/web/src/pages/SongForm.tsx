import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline'
import DashboardLayout from '../components/DashboardLayout'
import Button from '../components/Button'
import TextField from '../components/TextField'
import ArtistSelect from '../components/ArtistSelect'
import LyricsEditor from '../components/LyricsEditor'
import LinkSourceIcon, { LINK_TYPES } from '../components/LinkSourceIcon'
import { getSong, createSong, updateSong } from '../lib/api'
import type { Artist, SongPayload } from '../lib/api'
import { getToken } from '../lib/auth'
import { OCCASIONS } from '../lib/occasions'

const KEYS = [
  'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb',
  'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B',
]

type LinkRow = { url: string; type: string }

export default function SongForm() {
  const navigate = useNavigate()
  const { uid } = useParams()
  const isEdit = !!uid

  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState<Artist | null>(null)
  const [songKey, setSongKey] = useState('')
  const [bpm, setBpm] = useState('')
  const [notes, setNotes] = useState('')
  const [lyrics, setLyrics] = useState('')
  const [hasMultitrack, setHasMultitrack] = useState(false)
  const [isActive, setIsActive] = useState(true)
  const [occasions, setOccasions] = useState<string[]>([])
  const [links, setLinks] = useState<LinkRow[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(isEdit)

  useEffect(() => {
    if (!isEdit) return
    const token = getToken()
    if (!token) return
    getSong(token, uid)
      .then((song) => {
        setTitle(song.title)
        setArtist(song.artist)
        setSongKey(song.key ?? '')
        setBpm(song.bpm ? String(song.bpm) : '')
        setNotes(song.notes ?? '')
        setLyrics(song.lyrics ?? '')
        setHasMultitrack(song.has_multitrack)
        setIsActive(song.is_active)
        setOccasions(song.attributes?.occasions ?? [])
        setLinks(song.links.map((l) => ({ url: l.url, type: l.type })))
      })
      .catch((err) =>
        setSubmitError(err instanceof Error ? err.message : 'Erro ao carregar'),
      )
      .finally(() => setLoading(false))
  }, [isEdit, uid])

  function toggleOccasion(slug: string) {
    setOccasions((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    )
  }

  function updateLink(index: number, patch: Partial<LinkRow>) {
    setLinks((prev) => prev.map((l, i) => (i === index ? { ...l, ...patch } : l)))
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    setSubmitError('')
    const next: Record<string, string> = {}
    if (!title.trim()) next.title = 'Informe o título'
    if (!artist) next.artist = 'Selecione um artista'
    setErrors(next)
    if (Object.keys(next).length > 0) return

    const token = getToken()
    if (!token || !artist) return

    const payload: SongPayload = {
      title: title.trim(),
      artistUid: artist.uid,
      key: songKey || undefined,
      lyrics: lyrics || undefined,
      notes: notes || undefined,
      bpm: bpm ? Number(bpm) : undefined,
      hasMultitrack,
      isActive,
      attributes: occasions.length ? { occasions } : undefined,
      links: links
        .filter((l) => l.url.trim())
        .map((l) => ({ url: l.url.trim(), type: l.type })),
    }

    setSubmitting(true)
    try {
      const song = isEdit
        ? await updateSong(token, uid, payload)
        : await createSong(token, payload)
      navigate(`/songs/${song.uid}`)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Não foi possível salvar')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      {() => (
        <div className="mx-auto max-w-2xl">
          <h1 className="text-2xl font-bold text-slate-900">
            {isEdit ? 'Editar música' : 'Nova música'}
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={errors.title}
              />

              <div>
                <p className="mb-1 block text-sm font-medium text-slate-700">
                  Artista
                </p>
                <ArtistSelect value={artist} onChange={setArtist} />
                {errors.artist && (
                  <p className="mt-1 text-sm text-red-600">{errors.artist}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="key"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Tom
                  </label>
                  <select
                    id="key"
                    value={songKey}
                    onChange={(e) => setSongKey(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  >
                    <option value="">—</option>
                    {KEYS.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                </div>
                <TextField
                  id="bpm"
                  label="BPM"
                  type="number"
                  value={bpm}
                  onChange={(e) => setBpm(e.target.value)}
                />
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={hasMultitrack}
                    onChange={(e) => setHasMultitrack(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-teal-600"
                  />
                  Possui multitrack
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-teal-600"
                  />
                  Ativa
                </label>
              </div>

              <div>
                <p className="mb-2 block text-sm font-medium text-slate-700">
                  Ocasiões
                </p>
                <div className="flex flex-wrap gap-2">
                  {OCCASIONS.map((occ) => {
                    const on = occasions.includes(occ.slug)
                    return (
                      <button
                        key={occ.slug}
                        type="button"
                        onClick={() => toggleOccasion(occ.slug)}
                        className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                          on
                            ? 'border-teal-600 bg-teal-50 text-teal-700'
                            : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {occ.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <p className="mb-1 block text-sm font-medium text-slate-700">
                  Letra
                </p>
                <LyricsEditor value={lyrics} onChange={setLyrics} />
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-slate-700"
                >
                  Observações
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-700">
                    Links externos
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      setLinks((prev) => [...prev, { url: '', type: 'youtube' }])
                    }
                    className="flex items-center gap-1 text-sm font-medium text-teal-700 hover:underline"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Adicionar link
                  </button>
                </div>
                <div className="space-y-2">
                  {links.map((link, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-slate-200">
                        <LinkSourceIcon type={link.type} className="h-4 w-4" />
                      </span>
                      <select
                        value={link.type}
                        onChange={(e) => updateLink(index, { type: e.target.value })}
                        className="shrink-0 rounded-lg border border-slate-300 px-2 py-2 text-sm text-slate-700 outline-none focus:border-teal-500"
                      >
                        {LINK_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                      <input
                        value={link.url}
                        onChange={(e) => updateLink(index, { url: e.target.value })}
                        placeholder="https://..."
                        className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setLinks((prev) => prev.filter((_, i) => i !== index))
                        }
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-red-600"
                        aria-label="Remover link"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate('/songs')}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1" disabled={submitting}>
                  {submitting ? 'Salvando...' : 'Salvar música'}
                </Button>
              </div>
            </form>
          )}
        </div>
      )}
    </DashboardLayout>
  )
}
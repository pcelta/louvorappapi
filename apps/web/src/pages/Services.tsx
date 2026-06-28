import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { PlusIcon, XMarkIcon, CalendarIcon } from '@heroicons/react/24/outline'
import DashboardLayout from '../components/DashboardLayout'
import Button from '../components/Button'
import TextField from '../components/TextField'
import PastorSelect from '../components/PastorSelect'
import { listServices, createService, updateService } from '../lib/api'
import type { ServiceData, PastorRef } from '../lib/api'
import { getToken } from '../lib/auth'

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}

function toLocalInput(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`
}

function ServiceModal({
  service,
  onClose,
  onSaved,
}: {
  service: ServiceData | null
  onClose: () => void
  onSaved: () => void
}) {
  const [title, setTitle] = useState(service?.title ?? '')
  const [subtitle, setSubtitle] = useState(service?.subtitle ?? '')
  const [scheduledAt, setScheduledAt] = useState(
    service ? toLocalInput(service.scheduled_at) : '',
  )
  const [isSupper, setIsSupper] = useState(service?.is_supper ?? false)
  const [notes, setNotes] = useState(service?.notes ?? '')
  const [pastors, setPastors] = useState<PastorRef[]>(service?.pastors ?? [])
  const [error, setError] = useState('')
  const [fieldError, setFieldError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setFieldError('')
    if (!scheduledAt) {
      setFieldError('Informe a data e hora')
      return
    }

    const token = getToken()
    if (!token) return

    const payload = {
      title: title.trim() || undefined,
      subtitle: subtitle.trim() || undefined,
      notes: notes.trim() || undefined,
      isSupper,
      scheduledAt,
      pastorUids: pastors.map((p) => p.uid),
    }

    setSubmitting(true)
    try {
      if (service) {
        await updateService(token, service.uid, payload)
      } else {
        await createService(token, payload)
      }
      onSaved()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50"
        aria-label="Fechar"
        onClick={onClose}
      />
      <div className="relative max-h-[90vh] w-full max-w-md overflow-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            {service ? 'Editar culto' : 'Novo culto'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Fechar"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <form className="mt-4 space-y-4" onSubmit={submit}>
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="scheduledAt"
              className="block text-sm font-medium text-slate-700"
            >
              Data e hora
            </label>
            <input
              id="scheduledAt"
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
            {fieldError && (
              <p className="mt-1 text-sm text-red-600">{fieldError}</p>
            )}
          </div>

          <TextField
            id="title"
            label="Título (opcional)"
            placeholder="Preenchido com a data se vazio"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            id="subtitle"
            label="Subtítulo (opcional)"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
          />

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={isSupper}
              onChange={(e) => setIsSupper(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-teal-600"
            />
            Culto com Ceia
          </label>

          <div>
            <p className="mb-1 block text-sm font-medium text-slate-700">
              Pastores
            </p>
            <PastorSelect value={pastors} onChange={setPastors} />
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

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Salvando...' : 'Salvar culto'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default function Services() {
  const [services, setServices] = useState<ServiceData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<ServiceData | null>(null)

  function load() {
    const token = getToken()
    if (!token) return
    setLoading(true)
    setError('')
    listServices(token)
      .then(setServices)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Erro ao carregar cultos'),
      )
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  return (
    <DashboardLayout>
      {() => (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Cultos</h1>
              <p className="mt-1 text-sm text-slate-500">
                Cultos e atividades da igreja
              </p>
            </div>
            <Button onClick={() => setAdding(true)} className="flex items-center gap-2">
              <PlusIcon className="h-5 w-5" />
              Adicionar culto
            </Button>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {loading ? (
              <p className="p-6 text-sm text-slate-500">Carregando...</p>
            ) : error ? (
              <p className="p-6 text-sm text-red-600">{error}</p>
            ) : services.length === 0 ? (
              <p className="p-6 text-sm text-slate-500">Nenhum culto ainda.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {services.map((service) => (
                  <li key={service.uid}>
                    <button
                      type="button"
                      onClick={() => setEditing(service)}
                      className="flex w-full items-center gap-4 px-4 py-3 text-left transition hover:bg-slate-50 sm:px-6"
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-teal-50 text-teal-600">
                        <CalendarIcon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-slate-900">
                          {service.title}
                          {service.subtitle && (
                            <span className="font-normal text-slate-500">
                              {' '}
                              · {service.subtitle}
                            </span>
                          )}
                        </p>
                        <p className="truncate text-sm text-slate-500">
                          {formatDateTime(service.scheduled_at)}
                          {service.pastors.length > 0 &&
                            ` · ${service.pastors.map((p) => p.name).join(', ')}`}
                        </p>
                      </div>
                      {service.is_supper && (
                        <span className="shrink-0 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700">
                          Ceia
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {adding && (
            <ServiceModal
              service={null}
              onClose={() => setAdding(false)}
              onSaved={load}
            />
          )}
          {editing && (
            <ServiceModal
              service={editing}
              onClose={() => setEditing(null)}
              onSaved={load}
            />
          )}
        </>
      )}
    </DashboardLayout>
  )
}
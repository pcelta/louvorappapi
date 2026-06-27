const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export type ChurchMemberPayload = {
  user: {
    name: string
    email: string
    dob?: string
    password: string
    phone: string
  }
}

export type CreateChurchPayload = {
  name: string
  members: ChurchMemberPayload[]
}

export async function createChurch(payload: CreateChurchPayload) {
  const res = await fetch(`${API_URL}/church`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.message ?? 'Não foi possível cadastrar a igreja')
  }

  return data
}
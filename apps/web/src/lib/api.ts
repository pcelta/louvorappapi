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

export async function signIn(email: string, password: string): Promise<string> {
  const res = await fetch(`${API_URL}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.message ?? 'Não foi possível entrar')
  }

  return data.access_token
}

export type CurrentMember = {
  uid: string
  user: { name: string; email: string }
  church: { uid: string; name: string; logo_path: string }
}

export async function getMe(token: string): Promise<CurrentMember> {
  const res = await fetch(`${API_URL}/member/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.message ?? 'Sessão inválida')
  }

  return data
}
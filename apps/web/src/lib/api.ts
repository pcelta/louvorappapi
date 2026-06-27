export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

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
  user: { name: string; email: string; photo_path?: string }
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

export type MemberRole = { slug: string; name: string }

export type MemberListItem = {
  uid: string
  createdAt: string
  pending: boolean
  roles: MemberRole[]
  user: { name: string; email: string; phone?: string; photo_path?: string }
}

export async function listMembers(token: string): Promise<MemberListItem[]> {
  const res = await fetch(`${API_URL}/member`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.message ?? 'Não foi possível carregar os membros')
  }

  return data
}

export type AddMemberResult = {
  member: MemberListItem
  invitation: { code: string; path: string; expires_at: string }
}

export async function addMember(
  token: string,
  name: string,
  email: string,
): Promise<AddMemberResult> {
  const res = await fetch(`${API_URL}/member`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, email }),
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.message ?? 'Não foi possível adicionar o membro')
  }

  return data
}

export type InvitationInfo = {
  code: string
  accepted: boolean
  accepted_at?: string
  expires_at: string
  member: {
    user: { name: string; email: string }
    church: { name: string; logo_path: string }
  }
}

export async function getInvitation(code: string): Promise<InvitationInfo> {
  const res = await fetch(`${API_URL}/member-invitation/${code}`)

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.message ?? 'Convite inválido')
  }

  return data
}

export async function acceptInvitation(
  code: string,
  fields: { password: string; phone: string; photo?: File | null },
): Promise<void> {
  const form = new FormData()
  form.append('password', fields.password)
  form.append('phone', fields.phone)
  if (fields.photo) {
    form.append('photo', fields.photo)
  }

  const res = await fetch(`${API_URL}/member-invitation/${code}/accept`, {
    method: 'POST',
    body: form,
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.message ?? 'Não foi possível aceitar o convite')
  }
}
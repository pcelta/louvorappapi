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
  skills: { slug: string; name: string; icon: string }[]
}

export async function updateProfile(
  token: string,
  fields: {
    name: string
    email: string
    password?: string
    photo?: File | null
    skills: string[]
  },
): Promise<void> {
  const form = new FormData()
  form.append('name', fields.name)
  form.append('email', fields.email)
  form.append('skills', JSON.stringify(fields.skills))
  if (fields.password) {
    form.append('password', fields.password)
  }
  if (fields.photo) {
    form.append('photo', fields.photo)
  }

  const res = await fetch(`${API_URL}/member/me`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.message ?? 'Não foi possível salvar o perfil')
  }
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

export type Church = { uid: string; name: string; logo_path: string }

export async function updateChurch(
  token: string,
  fields: { name?: string; logo?: File | null },
): Promise<Church> {
  const form = new FormData()
  if (fields.name) {
    form.append('name', fields.name)
  }
  if (fields.logo) {
    form.append('logo', fields.logo)
  }

  const res = await fetch(`${API_URL}/church`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.message ?? 'Não foi possível salvar as configurações')
  }

  return data
}

export type MemberRole = { slug: string; name: string }

export type Skill = { uid: string; slug: string; name: string; icon: string }

export type MemberSkill = { slug: string; name: string; icon: string }

export async function listSkills(): Promise<Skill[]> {
  const res = await fetch(`${API_URL}/skill`)

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.message ?? 'Não foi possível carregar as habilidades')
  }

  return data
}

export type MemberListItem = {
  uid: string
  createdAt: string
  pending: boolean
  invite_code: string | null
  roles: MemberRole[]
  skills: MemberSkill[]
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

export async function updateMemberSkills(
  token: string,
  uid: string,
  skills: string[],
): Promise<void> {
  const res = await fetch(`${API_URL}/member/${uid}/skills`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ skills }),
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.message ?? 'Não foi possível atualizar as habilidades')
  }
}

export async function listRoles(token: string): Promise<MemberRole[]> {
  const res = await fetch(`${API_URL}/role`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.message ?? 'Não foi possível carregar as funções')
  }

  return data
}

export async function updateMemberRoles(
  token: string,
  uid: string,
  roles: string[],
): Promise<void> {
  const res = await fetch(`${API_URL}/member/${uid}/roles`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ roles }),
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.message ?? 'Não foi possível atualizar as funções')
  }
}

export type AddMemberResult = {
  member: MemberListItem
  invitation: { code: string; path: string; expires_at: string }
}

export async function addMember(
  token: string,
  name: string,
  email: string,
  skills: string[] = [],
  roles: string[] = [],
): Promise<AddMemberResult> {
  const res = await fetch(`${API_URL}/member`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, email, skills, roles }),
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
    skills: MemberSkill[]
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

export type Artist = { uid: string; name: string; cover_image?: string }

export async function searchArtists(
  token: string,
  query: string,
): Promise<Artist[]> {
  const res = await fetch(
    `${API_URL}/artist?search=${encodeURIComponent(query)}`,
    { headers: { Authorization: `Bearer ${token}` } },
  )

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.message ?? 'Não foi possível buscar artistas')
  }

  return data
}

export async function createArtist(
  token: string,
  name: string,
): Promise<Artist> {
  const res = await fetch(`${API_URL}/artist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.message ?? 'Não foi possível criar o artista')
  }

  return data
}

export type SongLinkData = { uid?: string; url: string; type: string }

export type SongAttributes = { occasions?: string[] } | null

export type SongData = {
  uid: string
  title: string
  lyrics?: string
  key?: string
  notes?: string
  bpm?: number
  has_multitrack: boolean
  is_active: boolean
  attributes: SongAttributes
  created_at: string
  artist: Artist | null
  links: { uid: string; url: string; type: string }[]
}

export type SongPayload = {
  title: string
  artistUid: string
  key?: string
  lyrics?: string
  notes?: string
  bpm?: number
  hasMultitrack?: boolean
  isActive?: boolean
  attributes?: { occasions?: string[] }
  links?: { url: string; type: string }[]
}

export async function listSongs(token: string): Promise<SongData[]> {
  const res = await fetch(`${API_URL}/song`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.message ?? 'Não foi possível carregar as músicas')
  }

  return data
}

export async function getSong(token: string, uid: string): Promise<SongData> {
  const res = await fetch(`${API_URL}/song/${uid}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.message ?? 'Música não encontrada')
  }

  return data
}

export async function createSong(
  token: string,
  payload: SongPayload,
): Promise<SongData> {
  const res = await fetch(`${API_URL}/song`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.message ?? 'Não foi possível salvar a música')
  }

  return data
}

export async function updateSong(
  token: string,
  uid: string,
  payload: SongPayload,
): Promise<SongData> {
  const res = await fetch(`${API_URL}/song/${uid}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.message ?? 'Não foi possível salvar a música')
  }

  return data
}

export type PastorRef = { uid: string; name: string }

export async function searchPastors(
  token: string,
  query: string,
): Promise<PastorRef[]> {
  const res = await fetch(
    `${API_URL}/member/search?role=pastor&q=${encodeURIComponent(query)}`,
    { headers: { Authorization: `Bearer ${token}` } },
  )

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.message ?? 'Não foi possível buscar pastores')
  }

  return data
}

export type ServiceData = {
  uid: string
  title: string
  subtitle?: string
  notes?: string
  is_supper: boolean
  scheduled_at: string
  created_at: string
  pastors: PastorRef[]
}

export type ServicePayload = {
  title?: string
  subtitle?: string
  notes?: string
  isSupper?: boolean
  scheduledAt: string
  pastorUids?: string[]
}

export async function listServices(token: string): Promise<ServiceData[]> {
  const res = await fetch(`${API_URL}/service`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.message ?? 'Não foi possível carregar os cultos')
  }

  return data
}

export async function createService(
  token: string,
  payload: ServicePayload,
): Promise<ServiceData> {
  const res = await fetch(`${API_URL}/service`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.message ?? 'Não foi possível salvar o culto')
  }

  return data
}

export async function updateService(
  token: string,
  uid: string,
  payload: ServicePayload,
): Promise<ServiceData> {
  const res = await fetch(`${API_URL}/service/${uid}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.message ?? 'Não foi possível salvar o culto')
  }

  return data
}

export async function acceptInvitation(
  code: string,
  fields: {
    password: string
    phone: string
    photo?: File | null
    skills: string[]
  },
): Promise<void> {
  const form = new FormData()
  form.append('password', fields.password)
  form.append('phone', fields.phone)
  form.append('skills', JSON.stringify(fields.skills))
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
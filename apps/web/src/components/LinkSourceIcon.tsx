import type { ComponentType } from 'react'
import { SiYoutube, SiSpotify } from '@icons-pack/react-simple-icons'
import { LinkIcon } from '@heroicons/react/24/outline'

export const LINK_TYPES: { value: string; label: string }[] = [
  { value: 'youtube', label: 'YouTube' },
  { value: 'spotify', label: 'Spotify' },
  { value: 'cifraclub', label: 'Cifra Club' },
  { value: 'cifras', label: 'Cifras' },
  { value: 'letras', label: 'Letras' },
  { value: 'other', label: 'Outro' },
]

export const linkTypeLabel = (type: string) =>
  LINK_TYPES.find((t) => t.value === type)?.label ?? type

type IconConfig = { Icon: ComponentType<{ size?: number; color?: string; className?: string }>; color: string }

// simple-icons covers YouTube/Spotify; the Brazilian cifra sites fall back to a
// generic link icon with a brand-ish color.
const brand: Record<string, IconConfig> = {
  youtube: { Icon: SiYoutube, color: '#FF0000' },
  spotify: { Icon: SiSpotify, color: '#1DB954' },
}

export default function LinkSourceIcon({
  type,
  className,
}: {
  type: string
  className?: string
}) {
  const config = brand[type]
  if (config) {
    const { Icon, color } = config
    return <Icon color={color} className={className} />
  }
  return <LinkIcon className={className} />
}
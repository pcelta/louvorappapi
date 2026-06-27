import type { ComponentType } from 'react'
import type { LucideProps } from 'lucide-react'
import { Guitar, Drum, MicVocal, KeyboardMusic, Music } from 'lucide-react'

type Props = LucideProps & { name: string }

// Maps the skill's `icon` key (stored in DB) to a Lucide icon component.
// Lucide has no distinct bass/acoustic icon, so they reuse Guitar.
const icons: Record<string, ComponentType<LucideProps>> = {
  microphone: MicVocal,
  guitar: Guitar,
  bass: Guitar,
  'acoustic-guitar': Guitar,
  keyboard: KeyboardMusic,
  drums: Drum,
}

export default function InstrumentIcon({ name, ...props }: Props) {
  const Icon = icons[name] ?? Music
  return <Icon aria-hidden="true" {...props} />
}
export const OCCASIONS: { slug: string; label: string }[] = [
  { slug: 'entrada', label: 'Entrada' },
  { slug: 'louvor', label: 'Louvor' },
  { slug: 'adoracao', label: 'Adoração' },
  { slug: 'ceia', label: 'Ceia' },
  { slug: 'dizimo', label: 'Dízimo / Ofertório' },
  { slug: 'ministracao', label: 'Ministração' },
  { slug: 'comunhao', label: 'Comunhão' },
  { slug: 'batismo', label: 'Batismo' },
]

export const occasionLabel = (slug: string) =>
  OCCASIONS.find((o) => o.slug === slug)?.label ?? slug
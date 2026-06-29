// PLACEHOLDER: the worship roster doesn't store an instrument per member yet,
// so the instrument shown next to each avatar is mocked deterministically by
// index. Swap for a real instrument field on the roster when available.
const INSTRUMENTS = [
  'microphone',
  'guitar',
  'bass',
  'keyboard',
  'acoustic-guitar',
  'drums',
]

export const mockInstrument = (index: number) =>
  INSTRUMENTS[index % INSTRUMENTS.length]
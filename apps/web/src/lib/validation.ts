export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

export const isE164 = (v: string) => /^\+[1-9]\d{1,14}$/.test(v)

export const otpGenerator = (length?: number | null): string => {
  const numbers = '0123456789'
  return Array.from({ length: length ?? 6 }, () => numbers.charAt(Math.floor(Math.random() * numbers.length))).join('')
}

export const codeGenerator = (length: number): string => {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  return Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('')
}

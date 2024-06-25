import bcrypt from 'bcrypt'

export const hashPassword = (password: string): string | null => {
  const saltRounds = 10
  const salt = bcrypt.genSaltSync(saltRounds)
  const hashPassword = bcrypt.hashSync(password, salt)
  return hashPassword
}

export const validPassword = (password: string, hashPassword: string): boolean => {
  const isValid = bcrypt.compareSync(password, hashPassword)
  return isValid
}

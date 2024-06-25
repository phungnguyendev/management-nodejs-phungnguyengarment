import 'dotenv/config'
import jwt, { JwtPayload } from 'jsonwebtoken'
import appConfig from '~/config/app.config'

type SecretType = 'access_token' | 'refresh_token'

const accessToken = appConfig.secret.accessKey
const refreshToken = appConfig.secret.refreshKey

export const generateToken = (payload: string | object | Buffer, secretType: SecretType): string => {
  const token = jwt.sign(payload, secretType === 'access_token' ? accessToken : refreshToken, {
    expiresIn: secretType === 'access_token' ? '1h' : '7d',
    algorithm: 'HS256'
  })
  return token
}

export const verifyToken = (token: string, secretType: SecretType): JwtPayload | string => {
  return jwt.verify(token, secretType === 'access_token' ? accessToken : refreshToken)
}

export const decodeToken = (token: string): null | JwtPayload | string => {
  return jwt.decode(token)
}

import 'dotenv/config'
import jwt, { JwtPayload, VerifyCallback, VerifyOptions } from 'jsonwebtoken'
import appConfig from '~/config/app.config'

type SecretType = 'access_token' | 'refresh_token'

export type ExpiresType = 'minutes' | 'hour' | 'day' | 'year'

export interface JwtConfig {
  secret: string
  expiresIn: number
  expiresType: ExpiresType
}

export const jwtConfig: { accessToken: JwtConfig; refreshToken: JwtConfig } = {
  accessToken: {
    secret: appConfig.secret.accessKey,
    expiresIn: 1,
    expiresType: 'minutes'
  },
  refreshToken: {
    secret: appConfig.secret.accessKey,
    expiresIn: 2,
    expiresType: 'minutes'
  }
}

const getExpiresIn = (jwtConfig: JwtConfig): string => {
  const expiresIn = jwtConfig.expiresIn
  switch (jwtConfig.expiresType) {
    case 'day':
      return `${expiresIn}d`
    case 'minutes':
      return `${expiresIn}m`
    case 'hour':
      return `${expiresIn}h`
    default:
      return `${expiresIn}y`
  }
}

export const generateToken = (payload: string | object | Buffer, secretType: SecretType): string => {
  const token = jwt.sign(
    payload,
    secretType === 'access_token' ? jwtConfig.accessToken.secret : jwtConfig.refreshToken.secret,
    {
      expiresIn:
        secretType === 'access_token' ? getExpiresIn(jwtConfig.accessToken) : getExpiresIn(jwtConfig.refreshToken),
      algorithm: 'HS512'
    }
  )
  return token
}

export const verifyToken = (
  token: string,
  secretType: SecretType,
  options?: VerifyOptions & { complete?: false }
): string | jwt.JwtPayload => {
  return jwt.verify(
    token,
    secretType === 'access_token' ? jwtConfig.accessToken.secret : jwtConfig.refreshToken.secret,
    options
  )
}

export const verifyTokenSync = (
  token: string,
  secretType: SecretType,
  callback?: VerifyCallback<JwtPayload | string>
) => {
  jwt.verify(
    token,
    secretType === 'access_token' ? jwtConfig.accessToken.secret : jwtConfig.refreshToken.secret,
    callback
  )
}

export const decodeToken = (token: string): null | JwtPayload | string => {
  return jwt.decode(token)
}

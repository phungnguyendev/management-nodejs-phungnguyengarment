import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import appConfig from '~/config/app.config'
import * as authService from '~/services/auth/auth.service'
import * as tokenService from '~/services/auth/token.service'
import * as userRoleService from '~/services/user-role.service'
import * as userService from '~/services/user.service'

const PATH = 'Auth'
const NAMESPACE = 'controllers/auth'

export const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.login(req.body.email.toLowerCase(), req.body.password)
    return res.formatter.ok({ data: result })
  } catch (error: any) {
    return res.formatter.badRequest({ message: `${error.message}` })
  }
}

export const getUserInfoFromAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authToken = req.headers['authorization']
    if (!authToken) throw new Error(`Token not found!`)
    const [Bearer, token] = authToken.split(' ')
    if (Bearer !== 'Bearer') throw new Error('Invalid token format!')
    jwt.verify(token, appConfig.secret.accessKey, async (err, payload: any) => {
      if (err?.message === 'jwt expired')
        return res.formatter.badRequest({ message: 'Login session has expired, please log in again!' })
      if (err) return res.formatter.forbidden({})
      const userFound = await userService.getItemByPk(payload.userID)
      const userRolesFound = await userRoleService.getItemByUserID(payload.userID)
      return res.formatter.ok({
        data: {
          user: userFound,
          userRoles: userRolesFound
        }
      })
    })
  } catch (error: any) {
    next(error)
  }
}

export const verifyEmailAndSendOTP = async (req: Request, res: Response) => {
  try {
    const email = String(req.params.email)
    const result = await authService.verifyEmailAndSendOTP(email)
    return res.formatter.ok({ data: result })
  } catch (err: any) {
    return res.formatter.badRequest({ message: `${err.message}` })
  }
}

export const verifyOTPCode = async (req: Request, res: Response) => {
  try {
    const email = String(req.params.email)
    const otp = String(req.body.otp)
    const verified = await authService.verifyOTPCode(email, otp)
    return res.formatter.ok({ data: verified, message: 'User authenticated successfully!' })
  } catch (err: any) {
    return res.formatter.badRequest({ message: `${err.message}` })
  }
}

export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) throw new Error('Refresh token is required!')
    await tokenService.revokeRefreshToken(refreshToken)
    return res.formatter.ok({ message: 'User logged out successfully!' })
  } catch (err: any) {
    return res.formatter.badRequest({ message: `${err.message}` })
  }
}

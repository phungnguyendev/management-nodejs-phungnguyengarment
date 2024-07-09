import { NextFunction, Request, Response } from 'express'
import * as authService from '~/services/auth/auth.service'
import * as tokenService from '~/services/auth/token.service'

const PATH = 'Auth'
const NAMESPACE = 'controllers/auth'

export const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.login(req.body.email.toLowerCase(), req.body.password)
    return res.formatter.ok({ data: result })
  } catch (error: any) {
    return res.formatter.badRequest({ message: error })
  }
}

export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) return res.formatter.badRequest({ message: 'Refresh token is required' })

    const newAccessToken = await tokenService.refreshAccessToken(refreshToken)
    return res.formatter.ok({ data: { accessToken: newAccessToken } })
  } catch (error: any) {
    return res.formatter.badRequest({ message: error })
  }
}

export const getUserInfoFromAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authToken = req.headers['authorization']
    if (!authToken)
      return res.formatter.notFound({
        error: {
          error: 'Error get user from accessToken',
          errorDetail: 'Token not found!'
        }
      })
    const result = await authService.getUserInfoFromAccessToken(authToken)
    return res.formatter.ok({ data: result })
  } catch (error: any) {
    return res.formatter.badRequest({ message: error })
  }
}

export const verifyEmailAndSendOTP = async (req: Request, res: Response) => {
  try {
    const email = String(req.params.email)
    const result = await authService.verifyEmailAndSendOTP(email)
    return res.formatter.ok({ data: result })
  } catch (error: any) {
    return res.formatter.badRequest({ message: error })
  }
}

export const verifyOTPCode = async (req: Request, res: Response) => {
  try {
    const email = String(req.params.email)
    const otp = String(req.body.otp)
    const verified = await authService.verifyOTPCode(email, otp)
    return res.formatter.ok({ data: verified, message: 'User authenticated successfully!' })
  } catch (error: any) {
    return res.formatter.badRequest({ message: error })
  }
}

export const resetPasswordWithAccesskey = async (req: Request, res: Response) => {
  try {
    const { email } = req.params
    const { accessKey, newPassword } = req.body
    const userUpdated = await authService.resetPasswordWithAccesskey(email, newPassword, accessKey)
    return res.formatter.ok({ data: userUpdated })
  } catch (error: any) {
    return res.formatter.badRequest({ message: error })
  }
}

export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) throw new Error('Refresh token is required!')
    const result = await tokenService.revokeRefreshToken(refreshToken)
    return res.formatter.ok({ message: result.message })
  } catch (error: any) {
    return res.formatter.badRequest({ message: error })
  }
}

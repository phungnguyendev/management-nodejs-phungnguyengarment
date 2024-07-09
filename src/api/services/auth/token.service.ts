import { Op } from 'sequelize'
import { dateFormatterToString, expiresDateFormJWTConfig } from '~/api/helpers/date.helper'
import { decodeToken, generateToken, jwtConfig, verifyToken } from '~/api/helpers/jsonwebtoken.helper'
import TokenSchema from '~/models/token.model'

const NAMESPACE = 'services/token'

// Kiểm tra và lấy Token
export const getToken = async (userID: number): Promise<TokenSchema> => {
  try {
    const tokenFound = await TokenSchema.findOne({ where: { userID, expiresAt: { [Op.gt]: new Date() } } })
    if (!tokenFound) throw new Error(`Token not found`)
    return tokenFound
  } catch (error: any) {
    throw `${error.message}`
  }
}

// Tạo AccessToken, RefreshToken và lưu trữ
export const generateAndSaveTokens = async (userID: number) => {
  try {
    const tokenFound = await TokenSchema.findOne({
      where: {
        userID
      }
    })
    if (tokenFound) await tokenFound.destroy()

    const accessToken = generateToken({ userID }, 'access_token')
    const refreshToken = generateToken({ userID }, 'refresh_token')
    // const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7Days
    const expiresAt = expiresDateFormJWTConfig(jwtConfig.accessToken) // 7Days
    await TokenSchema.create({ userID, refreshToken, expiresAt: dateFormatterToString(expiresAt, 'iso8601') })
    return { accessToken, refreshToken }
  } catch (error: any) {
    throw `${error.message}`
  }
}

// Làm mới AccessToken
export const refreshAccessToken = async (refreshToken: string): Promise<string> => {
  try {
    const verify = verifyToken(refreshToken, 'refresh_token')
    if (!verify) throw new Error(`Invalid refresh token!`)
    const payload = verify as { userID: number }
    const storedToken = await TokenSchema.findOne({
      where: {
        userID: payload.userID,
        refreshToken: refreshToken,
        expiresAt: {
          [Op.gt]: new Date()
        }
      }
    })
    if (!storedToken) throw new Error(`Refresh token not found or expired!`)
    return generateToken({ userID: payload.userID }, 'access_token')
  } catch (error: any) {
    throw `${error.message}`
  }
}

// Xóa RefreshToken
export const revokeRefreshToken = async (refreshToken: string) => {
  try {
    const decoded = decodeToken(refreshToken)
    const payload = decoded as { userID: number }
    const storedToken = await TokenSchema.findOne({
      where: {
        userID: payload.userID
      }
    })
    if (!storedToken) throw new Error(`Token not found!`)
    await storedToken.destroy()
    return { message: `Logout successfully!` }
  } catch (error: any) {
    throw `${error.message}`
  }
}

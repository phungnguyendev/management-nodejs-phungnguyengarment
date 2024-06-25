import { Op } from 'sequelize'
import { generateToken, verifyToken } from '~/api/helpers/jsonwebtoken.helper'
import TokenSchema from '~/models/token.model'

const NAMESPACE = 'services/token'

// Kiểm tra và lấy Token
export const getToken = async (userID: number): Promise<TokenSchema> => {
  try {
    const tokenFound = await TokenSchema.findOne({ where: { userID, expiresAt: { [Op.gt]: new Date() } } })
    if (!tokenFound) throw new Error(`Token not found`)
    return tokenFound
  } catch (error: any) {
    throw new Error(`Error getting token: ${error.message}`)
  }
}

// Tạo AccessToken, RefreshToken và lưu trữ
export const generateAndSaveTokens = async (userID: number) => {
  try {
    const accessToken = generateToken({ userID }, 'access_token')
    const refreshToken = generateToken({ userID }, 'refresh_token')
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7Days
    const tokenFound = await TokenSchema.findOne({
      where: {
        userID
      }
    })
    if (tokenFound) {
      await tokenFound.destroy()
    }
    await TokenSchema.create({ userID, refreshToken, expiresAt })
    return { accessToken, refreshToken }
  } catch (error: any) {
    throw new Error(`Error refresh accessToken: ${error.message}`)
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
    throw new Error(`Error refresh accessToken: ${error.message}`)
  }
}

// Xóa RefreshToken
export const revokeRefreshToken = async (refreshToken: string) => {
  try {
    const verify = verifyToken(refreshToken, 'refresh_token')
    if (!verify) throw new Error(`Invalid refresh token!`)
    const payload = verify as { userID: number }
    const storedToken = await TokenSchema.findOne({
      where: {
        userID: payload.userID
      }
    })
    if (!storedToken) throw new Error(`Token not found!`)
    await storedToken.destroy()
    return { message: 'Success!' }
  } catch (error: any) {
    throw new Error(`Error revoke refreshToken: ${error.message}`)
  }
}

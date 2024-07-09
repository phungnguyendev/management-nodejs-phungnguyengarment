/* eslint-disable no-unreachable */
import { decodeToken } from '~/api/helpers/jsonwebtoken.helper'
import RoleSchema from '~/api/models/role.model'
import UserRoleSchema from '~/api/models/user-role.model'
import { codeGenerator, otpGenerator } from '~/api/utils'
import { mailOptionVerifyOTPCode, transporter } from '~/config/nodemailer.config'
import UserSchema from '~/models/user.model'
import * as tokenService from '~/services/auth/token.service'

const NAMESPACE = 'Auth'
const PATH = 'services/auth'

export const login = async (email: string, password: string) => {
  try {
    const userFound = await UserSchema.findOne({
      where: {
        email
      }
    })
    if (!userFound) throw new Error(`User not found!`)
    if (password !== userFound.password) throw new Error(`Invalid password!`)
    const { accessToken, refreshToken } = await tokenService.generateAndSaveTokens(userFound.id)
    if (userFound.otp) await userFound.update({ otp: null })
    delete userFound.dataValues.password
    return { ...userFound.dataValues, accessToken, refreshToken }
  } catch (error: any) {
    throw `${error.message}`
  }
}

export const verifyEmailAndSendOTP = async (email: string) => {
  try {
    const userFound = await UserSchema.findOne({
      where: {
        email
      }
    })
    if (!userFound) throw new Error(`User not found!`)
    if (userFound.status === 'deleted') throw new Error(`User has been deleted!`)
    const otp = otpGenerator()
    await transporter.sendMail(mailOptionVerifyOTPCode(email, otp)).catch((err) => {
      throw new Error(err)
    })
    await userFound.update({ otp: otp })
    delete userFound.dataValues.password
    return userFound
  } catch (error: any) {
    throw `${error.message}`
  }
}

export const verifyOTPCode = async (email: string, otp: string) => {
  try {
    const userFound = await UserSchema.findOne({
      where: {
        email
      }
    })
    if (!userFound) throw new Error(`User not found!`)
    // if (userFound.status === 'active') throw new Error(`The user has been authenticated!`)
    if (userFound.status === 'deleted') throw new Error(`User has been deleted!`)
    if (!userFound.otp) throw new Error(`Otp code not available, please verify email again!`)
    if (userFound.otp !== otp) throw new Error(`The OTP code is incorrect, please try again!`)
    if (userFound.otp === otp) {
      if (userFound.status === 'pending') userFound.update({ status: 'active' })
      userFound.update({ otp: null })
    }
    const accessKey = codeGenerator(8)
    await userFound.update({ accessKey })
    delete userFound.dataValues.password
    return userFound
  } catch (error: any) {
    throw `${error.message}`
  }
}

export const getUserInfoFromAccessToken = async (authToken: string) => {
  try {
    const [Bearer, token] = authToken.split(' ')
    if (Bearer !== 'Bearer') throw new Error('Invalid token format!')
    const decoded = decodeToken(token) as { userID: number }
    const userFound = await UserSchema.findByPk(decoded.userID)
    if (!userFound) throw new Error(`User not found`)
    const userRolesFound = await UserRoleSchema.findAll({
      where: { userID: decoded.userID },
      include: [{ model: RoleSchema, as: 'role' }]
    })
    if (!userRolesFound) throw new Error(`User role not found`)
    delete userFound.dataValues.password
    delete userFound.dataValues.otp
    delete userFound.dataValues.accessKey
    return { user: userFound, userRoles: userRolesFound }
  } catch (error: any) {
    throw `${error.message}`
  }
}

export const resetPasswordWithAccesskey = async (email: string, newPassword: string, accesskey: string) => {
  try {
    const userFound = await UserSchema.findOne({ where: { email } })
    if (!userFound) throw new Error(`Can not find user with email: ${email}`)
    if (!userFound.accessKey) throw new Error(`Access key unavailable!`)
    if (accesskey !== userFound.accessKey) throw new Error(`Access key does not match!`)
    await userFound.update({ password: newPassword })
    await userFound.update({ accessKey: null })
    delete userFound.dataValues.otp
    delete userFound.dataValues.accessKey
    return userFound
  } catch (error: any) {
    throw `${error.message}`
  }
}

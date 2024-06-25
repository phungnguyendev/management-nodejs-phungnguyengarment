/* eslint-disable no-unreachable */
import { otpGenerator } from '~/api/utils'
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
    throw new Error(`Error login: ${error.message}`)
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
    if (userFound.status === 'deleted') throw new Error(`Người dùng đã bị xoá!`)
    const otp = otpGenerator()
    await transporter
      .sendMail(mailOptionVerifyOTPCode(email, otp))
      .then(() => {
        userFound.update({ otp: otp })
      })
      .catch((err) => {
        throw new Error(err)
      })
    return { otp }
  } catch (error: any) {
    throw new Error(`Error send otp code: ${error.message}`)
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
    if (userFound.status === 'active') throw new Error(`The user has been authenticated!`)
    if (userFound.status === 'deleted') throw new Error(`User has been deleted!`)
    if (!userFound.otp) throw new Error(`There was an error during authentication, please try again!`)
    if (userFound.otp !== otp) throw new Error(`The OTP code is incorrect, please try again!`)
    if (userFound.otp === otp) {
      if (userFound.status === 'pending') userFound.update({ status: 'active' })
      userFound.update({ otp: null })
    }
    delete userFound.dataValues.password
    return userFound
  } catch (error: any) {
    throw new Error(`Error verify otp code: ${error.message}`)
  }
}

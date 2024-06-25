import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import appConfig from '~/config/app.config'
import UserSchema from '../models/user.model'

export const authentication = async (req: Request, res: Response, next: NextFunction) => {
  //Get the jwt token from the head
  try {
    const authHeader = req.headers['authorization']
    if (!authHeader) throw new Error()
    const [bearer, token] = authHeader.split(' ')
    if (bearer !== 'Bearer' || !token) throw new Error('Invalid token format')
    jwt.verify(token, appConfig.secret.accessKey, async (err, payload: any) => {
      if (err) return res.formatter.forbidden({})
      const userFound = await UserSchema.findOne({ where: { id: payload.userID } })
      if (!userFound) return res.formatter.notFound({ message: `User not found!` })
      if (userFound.status === 'pending') return res.formatter.badRequest({ message: `Please verify your account!` })
      if (userFound.status === 'deleted') return res.formatter.badRequest({ message: `User has been deleted!` })
      res.locals.userID = payload.userID
      next()
    })
  } catch (error: any) {
    return res.formatter.unauthorized({ message: `${error.message}` })
  }
}

export const authenticationAdmin = async (req: Request, res: Response, next: NextFunction) => {
  //Get the jwt token from the head
  try {
    const authHeader = req.headers['authorization']
    if (!authHeader) throw new Error()
    const [bearer, token] = authHeader.split(' ')
    if (bearer !== 'Bearer' || !token) throw new Error('Invalid token format')
    jwt.verify(token, appConfig.secret.accessKey, async (err, payload: any) => {
      if (err) {
        return res.formatter.forbidden({})
      }
      const userFound = await UserSchema.findOne({ where: { id: payload.userID } })
      if (!userFound) return res.formatter.notFound({ message: `User not found!` })
      if (!userFound.isAdmin) return res.formatter.unauthorized({ message: `User is not allowed!` })
      res.locals.userID = payload.userID
      next()
    })
  } catch (error: any) {
    return res.formatter.unauthorized({ message: `${error.message}` })
  }
}

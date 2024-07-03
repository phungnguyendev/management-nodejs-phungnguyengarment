import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import appConfig from '~/config/app.config'
import { verifyTokenSync } from '../helpers/jsonwebtoken.helper'
import RoleSchema from '../models/role.model'
import UserRoleSchema from '../models/user-role.model'

export const authentication = async (req: Request, res: Response, next: NextFunction) => {
  //Get the jwt token from the head
  try {
    const authHeader = req.headers['authorization']
    if (!authHeader) throw new Error()
    const [bearer, token] = authHeader.split(' ')
    if (bearer !== 'Bearer' || !token) throw new Error('Invalid token format')
    // verifyTokenSync(token, 'access_token', (err, decoded) => {
    //   if (err) {
    //     return res.formatter.badRequest({
    //       data: decoded,
    //       error: { error: err?.name ?? '', errorDetail: err?.message ?? '' }
    //     })
    //   }
    // })
    // jwt.verify(token, appConfig.secret.accessKey, async (err, user) => {
    //   // if (err) return res.formatter.forbidden({ data: err })
    //   const decoded = jwt.decode(token)
    //   const payload = decoded as { userID: number }
    //   const userFound = await UserSchema.findOne({ where: { id: payload.userID } })
    //   if (!userFound) return res.formatter.notFound({ message: `User not found!` })
    //   if (userFound.status === 'pending') return res.formatter.badRequest({ message: `Please verify your account!` })
    //   if (userFound.status === 'deleted') return res.formatter.badRequest({ message: `User has been deleted!` })
    //   res.locals.userID = payload.userID
    //   next()
    // })
    next()
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
        return res.formatter.forbidden({
          error: {
            error: 'Authentication user',
            errorDetail: 'User is not allowed!'
          }
        })
      }
      const adminRole = await RoleSchema.findOne({ where: { role: 'admin' } })
      if (!adminRole) throw new Error('Can not find role admin!')
      const userRoleAdmin = await UserRoleSchema.findOne({ where: { userID: payload.userID, roleID: adminRole.id } })
      if (!userRoleAdmin) return res.formatter.unauthorized({ message: `User is not allowed!` })
      res.locals.userID = payload.userID
      next()
    })
  } catch (error: any) {
    return res.formatter.unauthorized({ message: `${error.message}` })
  }
}

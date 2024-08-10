import { Router } from 'express'
import validationRules from '~/api/middleware/request-validator'
import * as controller from '~/controllers/auth/auth.controller'

const router = Router()

router.post(
  '/login',
  validationRules([
    { field: 'email', type: 'string', location: 'body' },
    { field: 'password', type: 'string', location: 'body' }
  ]),
  controller.login
)

router.get(
  '/user-info',
  validationRules([{ field: 'authorization', type: 'string', location: 'headers' }]),
  controller.getUserInfoFromAccessToken
)

router.post(
  '/refresh-token',
  validationRules([{ field: 'refreshToken', type: 'string', location: 'body' }]),
  controller.refreshAccessToken
)

router.post(
  '/verify-email/:email',
  validationRules([{ field: 'email', type: 'string', location: 'params' }]),
  controller.verifyEmailAndSendOTP
)

router.post(
  '/verify-otp/:email',
  validationRules([
    { field: 'email', type: 'string', location: 'params' },
    { field: 'otp', type: 'string', location: 'body' }
  ]),
  controller.verifyOTPCode
)

router.post(
  '/reset-password/:email',
  validationRules([
    { field: 'email', type: 'string', location: 'params' },
    { field: 'newPassword', type: 'string', location: 'body' },
    { field: 'accessKey', type: 'string', location: 'body' }
  ]),
  controller.resetPasswordWithAccesskey
)

router.post(
  '/logout',
  validationRules([{ field: 'refreshToken', type: 'string', location: 'body' }]),
  controller.logout
)

export default router

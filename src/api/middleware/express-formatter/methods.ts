// Using this code or using library npm 'http-errors'

export type MethodType =
  | 'ok'
  | 'created'
  | 'accepted'
  | 'partialInformation'
  | 'noContent'
  | 'badRequest'
  | 'unauthorized'
  | 'forbidden'
  | 'notFound'
  | 'methodNotAllowed'
  | 'timeout'
  | 'conflict'
  | 'unprocessed'
  | 'tooManyRequests'
  | 'serverError'
  | 'badGateway'
  | 'serviceUnavailable'
  | 'gatewayTimeout'

export type MethodStatus =
  | 200
  | 201
  | 202
  | 203
  | 204
  | 400
  | 401
  | 403
  | 404
  | 405
  | 408
  | 409
  | 422
  | 429
  | 500
  | 502
  | 503
  | 504

export interface Method {
  status: MethodStatus
  message: string
  type: MethodType
}

const methods: Method[] = [
  {
    type: 'ok',
    status: 200,
    message: 'Success'
  },
  {
    type: 'created',
    status: 201,
    message: 'Created'
  },
  {
    type: 'accepted',
    status: 202,
    message: 'Accepted'
  },
  {
    type: 'partialInformation',
    status: 203,
    message: 'Partial Information'
  },
  {
    type: 'noContent',
    status: 204,
    message: 'No Content'
  },
  {
    type: 'badRequest',
    status: 400,
    message: 'Bad Request'
  },
  {
    type: 'unauthorized',
    status: 401,
    message: 'Unauthorized'
  },
  {
    type: 'forbidden',
    status: 403,
    message: 'Forbidden'
  },
  {
    type: 'notFound',
    status: 404,
    message: 'Not Found'
  },
  {
    type: 'methodNotAllowed',
    status: 405,
    message: 'Method not allowed!'
  },
  {
    type: 'timeout',
    status: 408,
    message: 'timeout'
  },
  {
    type: 'conflict',
    status: 409,
    message: 'Conflict'
  },
  {
    type: 'unprocessed',
    status: 422,
    message: 'Unprocessed'
  },
  {
    type: 'tooManyRequests',
    status: 429,
    message: 'Too many requests'
  },
  {
    type: 'serverError',
    status: 500,
    message: 'Server error'
  },
  {
    type: 'badGateway',
    status: 502,
    message: 'Bad Gateway'
  },
  {
    type: 'serviceUnavailable',
    status: 503,
    message: 'Service Unavailable'
  },
  {
    type: 'gatewayTimeout',
    status: 504,
    message: 'Gateway Timeout'
  }
]

export default methods

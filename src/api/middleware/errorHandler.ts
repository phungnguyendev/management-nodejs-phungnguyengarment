import { NextFunction, Request, Response } from 'express'
import { EagerLoadingError } from 'sequelize'

const errorHandler = (err: EagerLoadingError, req: Request, res: Response, next: NextFunction) => {
  console.error(`Error: ${err.message || 'Unknown error'}`)
  console.error(err.stack)

  if (err.message && err.message.includes('Validation error')) {
    return res.formatter.badRequest({
      error: {
        error: 'Validation error!',
        errorDetail: err.message
      }
    })
  }

  if (err.message && err.message.includes('Unique constraint error')) {
    return res.formatter.badRequest({
      error: {
        error: 'Unique constraint error!',
        errorDetail: err.message
      }
    })
  }

  if (err.message && err.message.includes('User not found')) {
    return res.formatter.notFound({
      error: {
        error: 'User not found!',
        errorDetail: err.message
      }
    })
  }

  return res.formatter.serverError({
    error: {
      error: 'Internal server error!',
      errorDetail: err.message
    }
  })
}

export default errorHandler

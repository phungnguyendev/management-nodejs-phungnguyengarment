import { NextFunction, Request, Response } from 'express'
import { EagerLoadingError } from 'sequelize'

  console.error(`Error: ${err.message || 'Unknown error'}`)
  console.error(err.stack)

  if (err.message && err.message.includes('Validation error')) {
    return res.formatter.badRequest({ message: 'Validation error!', detailError: err.message })
  }

  if (err.message && err.message.includes('Unique constraint error')) {
    return res.formatter.badRequest({ message: 'Unique constraint error!', detailError: err.message })
  }

  if (err.message && err.message.includes('User not found')) {
    return res.formatter.notFound({ message: 'User not found!', detailError: err.message })
  }

  return res.formatter.serverError({ message: 'Internal server error!', detailError: err.message })
}

export default errorHandler

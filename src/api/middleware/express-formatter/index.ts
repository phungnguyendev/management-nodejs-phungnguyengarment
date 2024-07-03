/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import { ErrorType } from '~/type'
import methods, { Method, MethodType } from './methods'

export interface ResponseStory {
  success?: boolean | null
  message?: string | null
  error?: ErrorType | null
  data?: any
  meta?: any
  length?: number | null
  page?: number | null
  pageSize?: number | null
  total?: number | null
}

type ResponseFunction = {
  [key in MethodType]: (response: ResponseStory) => void
}

declare global {
  namespace Express {
    interface Response {
      formatter: ResponseFunction
    }
  }
}

export const responseEnhancer =
  () =>
  (_req: Request, res: Response, next: NextFunction): void => {
    res.formatter = _generateFormatters(res)
    next()
  }

const _generateFormatters = (res: Response) => {
  const formatter = {} as ResponseFunction

  methods.map((method: Method) => {
    formatter[method.type] = (response: ResponseStory) => {
      const statusSuccess =
        method.status === 200 ||
        method.status === 201 ||
        method.status === 202 ||
        method.status === 203 ||
        method.status === 204
      return res.status(method.status).json({
        success: statusSuccess,
        message: response.message ? response.message : method.message,
        error: response.error,
        data: response.data,
        meta: response.meta,
        length: response.length,
        page: response.page,
        pageSize: response.pageSize,
        total: response.total
      })
    }
  })

  return formatter
}

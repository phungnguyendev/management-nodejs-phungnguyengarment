import { NextFunction, Request, Response } from 'express'
import { Group } from '~/models/group.model'
import * as service from '~/services/group.service'
import { RequestBodyType } from '~/type'

const NAMESPACE = 'controllers/group'

export const createNewItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dataRequest: Group = {
      ...req.body,
      status: req.body.status ?? 'active'
    }
    const newItem = await service.createNewItem(dataRequest)
    return res.formatter.created({ data: newItem })
  } catch (error: any) {
    return res.formatter.badRequest({ message: error })
  }
}

export const getItemByPk = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id)
    const itemFound = await service.getItemByPk(id)
    return res.formatter.ok({ data: itemFound })
  } catch (error: any) {
    return res.formatter.badRequest({ message: error })
  }
}

export const getItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bodyRequest: RequestBodyType = {
      ...req.body
    }
    const items = await service.getItems(bodyRequest)
    const countAll = await service.getItems({
      ...bodyRequest,
      filter: { status: ['active'], field: 'id', items: [-1] }
    })
    return res.formatter.ok({
      data: items.rows,
      length: items.count,
      page: Number(bodyRequest.paginator.page),
      pageSize: Number(bodyRequest.paginator.pageSize),
      total: bodyRequest.search.term.length > 0 ? items.count : countAll.count
    })
  } catch (error: any) {
    return res.formatter.badRequest({ message: error })
  }
}

export const updateItemByPk = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id)
    const itemRequest: Group = {
      ...req.body
    }
    const itemUpdated = await service.updateItemByPk(id, itemRequest)
    return res.formatter.ok({ data: itemUpdated })
  } catch (error: any) {
    return res.formatter.badRequest({ message: error })
  }
}

export const deleteItemByPk = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id)
    const destroyed = await service.deleteItemByPk(id)
    return res.formatter.ok({ message: destroyed.message })
  } catch (error: any) {
    return res.formatter.badRequest({ message: error })
  }
}

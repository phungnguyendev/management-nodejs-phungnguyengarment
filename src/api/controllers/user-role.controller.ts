import { NextFunction, Request, Response } from 'express'
import * as service from '~/services/user-role.service'
import { RequestBodyType } from '~/type'
import { UserRole } from '../models/user-role.model'

const NAMESPACE = 'controllers/user-role'

export const createNewItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dataRequest: UserRole = {
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
    const itemsFound = await service.getItemByPk(id)
    return res.formatter.ok({ data: itemsFound })
  } catch (error: any) {
    return res.formatter.badRequest({ message: error })
  }
}

export const getItemsByUserID = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userID = Number(req.params.userID)
    const itemsFound = await service.getItemByUserID(userID)
    return res.formatter.ok({ data: itemsFound })
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
    const itemRequest: UserRole = {
      ...req.body
    }
    const itemUpdated = await service.updateItemByPk(id, itemRequest)
    return res.formatter.ok({ data: itemUpdated })
  } catch (error: any) {
    return res.formatter.badRequest({ message: error })
  }
}

export const updateItemByUserID = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userID = Number(req.params.userID)
    const itemRequest: UserRole = {
      ...req.body
    }
    const itemUpdated = await service.updateItemByUserID(userID, itemRequest)
    return res.formatter.ok({ data: itemUpdated })
  } catch (error: any) {
    return res.formatter.badRequest({ message: error })
  }
}

export const updateItemsByUserID = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userID = Number(req.params.userID)
    const records = req.body as UserRole[]
    const updatedItems = await service.updateItemsBy({ field: 'userID', id: userID }, records)
    return res.formatter.ok({ data: updatedItems })
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

export const deleteItemByUserID = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userID = Number(req.params.userID)
    const destroyed = await service.deleteItemByUserID(userID)
    return res.formatter.ok({ message: destroyed.message })
  } catch (error: any) {
    return res.formatter.badRequest({ message: error })
  }
}

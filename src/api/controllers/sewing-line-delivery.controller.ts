import { NextFunction, Request, Response } from 'express'
import { SewingLineDelivery } from '~/models/sewing-line-delivery.model'
import * as service from '~/services/sewing-line-delivery.service'
import { RequestBodyType } from '~/type'

const NAMESPACE = 'controllers/sewing-line-delivery'

export const createNewItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dataRequest: SewingLineDelivery = {
      ...req.body,
      status: req.body.status ?? 'active'
    }
    const newItem = await service.createNewItem(dataRequest)
    return res.formatter.created({ data: newItem })
  } catch (error) {
    next(error)
  }
}

export const getItemByPk = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id)
    const itemFound = await service.getItemByPk(id)
    return res.formatter.ok({ data: itemFound })
  } catch (error) {
    next(error)
  }
}

export const getItemByProductID = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productID = Number(req.params.productID)
    const itemFound = await service.getItemByProductID(productID)
    return res.formatter.ok({ data: itemFound })
  } catch (error) {
    next(error)
  }
}

export const getItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bodyRequest: RequestBodyType = {
      ...req.body
    }
    const items = await service.getItems(bodyRequest)
    const countAll = await service.getItems({ ...bodyRequest, filter: { status: 'active', field: 'id', items: [-1] } })
    return res.formatter.ok({
      data: items.rows,
      length: items.count,
      page: Number(bodyRequest.paginator.page),
      pageSize: Number(bodyRequest.paginator.pageSize),
      total: bodyRequest.search.term.length > 0 ? items.count : countAll.count
    })
  } catch (error) {
    next(error)
  }
}

export const updateItemByPk = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id)
    const itemRequest: SewingLineDelivery = {
      ...req.body
    }
    const itemUpdated = await service.updateItemByPk(id, itemRequest)
    return res.formatter.ok({ data: itemUpdated })
  } catch (error) {
    next(error)
  }
}

export const updateItemByProductID = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productID = Number(req.params.productID)
    const itemRequest: SewingLineDelivery = {
      ...req.body
    }
    const itemUpdated = await service.updateItemByProductID(productID, itemRequest)
    return res.formatter.ok({ data: itemUpdated })
  } catch (error) {
    next(error)
  }
}

export const updateItemsByProductID = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productID = Number(req.params.productID)
    const records = req.body as SewingLineDelivery[]
    const updatedItems = await service.updateItemsBy({ field: 'productID', id: productID }, records)
    return res.formatter.ok({ data: updatedItems })
  } catch (error) {
    next(error)
  }
}

export const deleteItemByPk = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id)
    const destroyed = await service.deleteItemByPk(id)
    return res.formatter.ok({ message: destroyed.message })
  } catch (error) {
    next(error)
  }
}

export const deleteItemByProductID = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productID = Number(req.params.productID)
    await service.deleteItemByProductID(productID)
    return res.formatter.ok({})
  } catch (error) {
    next(error)
  }
}

import { NextFunction, Request, Response } from 'express'
import { Product } from '~/models/product.model'
import * as service from '~/services/product.service'
import { RequestBodyType } from '~/type'

const NAMESPACE = 'controllers/product'

export const createNewItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dataRequest: Product = {
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

export const getItemByProductCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productCode = String(req.params.productCode)
    const itemFound = await service.getItemByProductCode(productCode)
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
    const itemRequest: Product = {
      ...req.body
    }
    const itemUpdated = await service.updateItemByPk(id, itemRequest)
    return res.formatter.ok({ data: itemUpdated })
  } catch (error) {
    next(error)
  }
}

export const updateItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const itemRequest: Product[] = req.body
    const updatedItems = await service.updateItems(itemRequest)
    return res.formatter.ok({ data: updatedItems })
  } catch (error) {
    next(error)
  }
}

export const deleteItemByPk = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id)
    await service.deleteItemByPk(id)
    return res.formatter.ok({})
  } catch (error) {
    next(error)
  }
}
